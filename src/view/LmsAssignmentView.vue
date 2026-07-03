<template>
  <main class="assignment-shell" data-testid="lms-assignment">
    <header class="assignment-header">
      <button class="back-button" type="button" @click="goBack">返回</button>
      <div>
        <p class="eyebrow">{{ assignment?.class?.course?.name || "LMS" }}</p>
        <h1>{{ assignment?.title || "作业" }}</h1>
        <p class="subtitle">{{ assignment?.name || "正在加载作业信息" }}</p>
      </div>
    </header>

    <p v-if="error" class="error-state" data-testid="lms-assignment-error">{{ error }}</p>
    <p v-if="isLoading" class="empty-state" data-testid="lms-assignment-loading">正在加载作业...</p>

    <template v-if="assignment && !isLoading">
      <section class="metrics" aria-label="作业概览">
        <article class="metric-card">
          <span>状态</span>
          <strong>{{ assignment.status }}</strong>
        </article>
        <article class="metric-card">
          <span>题目</span>
          <strong>{{ problemCount }}</strong>
        </article>
        <article class="metric-card">
          <span>提交</span>
          <strong>{{ assignment.submissions.length }}</strong>
        </article>
      </section>

      <section class="content-grid">
        <article class="panel">
          <div class="section-heading">
            <h2>题目</h2>
            <span>{{ problemCount }} 项</span>
          </div>
          <ul v-if="problems.length" class="list">
            <li v-for="item in problems" :key="item.id || item.title">
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.name || "未命名题目" }}</p>
              </div>
              <span>{{ item.gradingPolicyKind || "manual" }}</span>
            </li>
          </ul>
          <p v-else class="empty-state">暂无题目。</p>
        </article>

        <article class="panel submit-panel">
          <div class="section-heading">
            <h2>提交</h2>
            <span>{{ selectedFile?.name || "未选择文件" }}</span>
          </div>
          <form class="submit-form" @submit.prevent="submitAssignment">
            <label class="file-picker">
              <span>选择文件</span>
              <input data-testid="submission-file" type="file" @change="onFileChange" />
            </label>
            <button class="primary-button" type="submit" :disabled="submitDisabled">
              {{ isSubmitting ? "提交中..." : "提交作业" }}
            </button>
          </form>
          <p v-if="submitMessage" class="success-state" data-testid="submission-success">{{ submitMessage }}</p>
          <p v-if="submitError" class="error-state compact" data-testid="submission-error">{{ submitError }}</p>
          <div class="workspace-box" data-testid="assignment-workspace">
            <div class="workspace-copy">
              <strong>Workspace</strong>
              <p>{{ workspaceHint }}</p>
              <p v-if="workspacePath" class="workspace-path" data-testid="workspace-path">{{ workspacePath }}</p>
            </div>
            <div class="workspace-actions">
              <button class="secondary-button" type="button" :disabled="createWorkspaceDisabled" @click="createWorkspace">
                {{ isCreatingWorkspace ? "创建中..." : "创建 Workspace" }}
              </button>
              <button class="primary-button" type="button" :disabled="submitWorkspaceDisabled" @click="submitWorkspace">
                {{ isSubmittingWorkspace ? "提交中..." : "提交 Workspace" }}
              </button>
            </div>
          </div>
          <p v-if="workspaceMessage" class="success-state" data-testid="workspace-success">{{ workspaceMessage }}</p>
          <p v-if="workspaceError" class="error-state compact" data-testid="workspace-error">{{ workspaceError }}</p>
        </article>

        <article class="panel">
          <div class="section-heading">
            <h2>最近提交</h2>
            <span>{{ assignment.submissions.length }} 次</span>
          </div>
          <ul v-if="assignment.submissions.length" class="list">
            <li v-for="item in assignment.submissions" :key="item.id">
              <button class="list-button" type="button" @click="openSubmission(item.slug)">
                <div>
                  <strong>{{ item.name }}</strong>
                  <p>{{ item.currentAutoJudge?.verdict || item.currentAutoJudge?.phase || "未评测" }}</p>
                </div>
                <time>{{ formatDate(item.createdAt) }}</time>
              </button>
            </li>
          </ul>
          <p v-else class="empty-state">还没有提交。</p>
        </article>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import {isTauri} from "@tauri-apps/api/core";
import {appDataDir, BaseDirectory, join} from "@tauri-apps/api/path";
import {exists, mkdir, readFile, writeTextFile} from "@tauri-apps/plugin-fs";
import {computed, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getLmsAssignment, submitLmsFile} from "@/composable/serverRequest";
import type {LmsAssignmentDetails, LmsSubmissionRequirement} from "@/composable/serverRequest";

const route = useRoute();
const router = useRouter();
const assignment = ref<LmsAssignmentDetails | null>(null);
const isLoading = ref(true);
const error = ref("");
const selectedFile = ref<File | null>(null);
const isSubmitting = ref(false);
const submitMessage = ref("");
const submitError = ref("");
const isCreatingWorkspace = ref(false);
const isSubmittingWorkspace = ref(false);
const workspacePath = ref("");
const workspaceMessage = ref("");
const workspaceError = ref("");

const problems = computed(() => {
    if (!assignment.value) return [];
    return assignment.value.problemItems
        .map((item) => item.problem)
        .filter((item): item is NonNullable<typeof item> => Boolean(item));
});
const problemCount = computed(() => problems.value.length || assignment.value?.problemIds.length || 0);
const submitDisabled = computed(() => isSubmitting.value || !selectedFile.value || !assignment.value);
const primaryProblemItem = computed(() => assignment.value?.problemItems[0] ?? null);
const workspaceRequirement = computed(() => {
    const requirements = primaryProblemItem.value?.problem?.submissionRequirements ?? assignment.value?.problem?.submissionRequirements ?? [];
    return requirements.find((item) => item.required && item.kind === "code")
        ?? requirements.find((item) => item.required && item.kind === "file")
        ?? null;
});
const workspaceFileName = computed(() => workspaceRequirement.value ? fileNameForRequirement(workspaceRequirement.value) : "");
const workspaceRelativeDir = computed(() => {
    if (!assignment.value || !primaryProblemItem.value) return "";
    return `workspaces/assignment-${assignment.value.id}/problem-${primaryProblemItem.value.id}`;
});
const workspaceRelativeFile = computed(() => {
    if (!workspaceRelativeDir.value || !workspaceFileName.value) return "";
    return `${workspaceRelativeDir.value}/${workspaceFileName.value}`;
});
const workspaceHint = computed(() => {
    if (!workspaceRequirement.value) return "当前题目没有可用提交要求。";
    return `目标文件：${workspaceFileName.value}`;
});
const createWorkspaceDisabled = computed(() => {
    return isCreatingWorkspace.value || isSubmittingWorkspace.value || !assignment.value || !primaryProblemItem.value || !workspaceRequirement.value;
});
const submitWorkspaceDisabled = computed(() => {
    return createWorkspaceDisabled.value || !workspacePath.value;
});

onMounted(loadAssignment);

async function loadAssignment() {
    isLoading.value = true;
    error.value = "";
    try {
        assignment.value = await getLmsAssignment(String(route.params.id));
        workspacePath.value = localStorage.getItem(workspaceStorageKey()) ?? "";
    } catch {
        error.value = "无法连接 LMS，请稍后重试。";
    } finally {
        isLoading.value = false;
    }
}

async function goBack() {
    const classId = assignment.value?.classId;
    if (classId) {
        await router.push({name: "lmsClass", params: {id: classId}});
        return;
    }
    await router.push({name: "index"});
}

async function openSubmission(slug: string) {
    await router.push({name: "lmsSubmission", params: {slug}});
}

function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    selectedFile.value = input.files?.[0] ?? null;
    submitMessage.value = "";
    submitError.value = "";
}

async function submitAssignment() {
    if (!assignment.value || !selectedFile.value) return;

    isSubmitting.value = true;
    submitError.value = "";
    submitMessage.value = "";
    try {
        const result = await submitLmsFile({
            assignmentId: assignment.value.id,
            assignmentProblemItemId: assignment.value.problemItems[0]?.id,
            file: selectedFile.value,
            name: `${assignment.value.title} desktop submission`,
        });
        if (!result) {
            submitError.value = "提交失败，请稍后重试。";
            return;
        }
        selectedFile.value = null;
        await router.push({name: "lmsSubmission", params: {slug: result.slug}});
    } catch {
        submitError.value = "提交失败，请稍后重试。";
    } finally {
        isSubmitting.value = false;
    }
}

async function createWorkspace() {
    if (!assignment.value || !primaryProblemItem.value || !workspaceRelativeFile.value) return;

    workspaceError.value = "";
    workspaceMessage.value = "";
    if (!isTauri()) {
        workspaceError.value = "无法创建 Workspace，请在桌面端使用。";
        return;
    }

    isCreatingWorkspace.value = true;
    try {
        await mkdir(workspaceRelativeDir.value, {baseDir: BaseDirectory.AppData, recursive: true});
        const fileExists = await exists(workspaceRelativeFile.value, {baseDir: BaseDirectory.AppData});
        if (!fileExists) {
            await writeTextFile(workspaceRelativeFile.value, "", {baseDir: BaseDirectory.AppData});
        }
        workspacePath.value = await resolveWorkspacePath();
        localStorage.setItem(workspaceStorageKey(), workspacePath.value);
        workspaceMessage.value = `Workspace 已创建：${workspaceFileName.value}`;
    } catch {
        workspaceError.value = "无法创建 Workspace。";
    } finally {
        isCreatingWorkspace.value = false;
    }
}

async function submitWorkspace() {
    if (!assignment.value || !primaryProblemItem.value || !workspaceRelativeFile.value) return;

    workspaceError.value = "";
    workspaceMessage.value = "";
    if (!isTauri()) {
        workspaceError.value = "无法读取 Workspace，请在桌面端使用。";
        return;
    }

    isSubmittingWorkspace.value = true;
    try {
        const fileExists = await exists(workspaceRelativeFile.value, {baseDir: BaseDirectory.AppData});
        if (!fileExists) {
            workspaceError.value = "Workspace 文件不存在，请先创建。";
            return;
        }
        const bytes = await readFile(workspaceRelativeFile.value, {baseDir: BaseDirectory.AppData});
        const file = new File([bytes], workspaceFileName.value, {type: "application/octet-stream"});
        const result = await submitLmsFile({
            assignmentId: assignment.value.id,
            assignmentProblemItemId: primaryProblemItem.value.id,
            file,
            name: `${assignment.value.title} desktop submission`,
        });
        if (!result) {
            workspaceError.value = "提交失败，请稍后重试。";
            return;
        }
        await router.push({name: "lmsSubmission", params: {slug: result.slug}});
    } catch {
        workspaceError.value = "无法读取 Workspace。";
    } finally {
        isSubmittingWorkspace.value = false;
    }
}

function fileNameForRequirement(requirement: LmsSubmissionRequirement) {
    const languageFileName = Object.values(requirement.languageFilenames ?? {})[0];
    return languageFileName || requirement.filename || `${requirement.id}.txt`;
}

function workspaceStorageKey() {
    return `taskmate.workspace.${assignment.value?.id ?? "assignment"}.${primaryProblemItem.value?.id ?? "problem"}`;
}

async function resolveWorkspacePath() {
    const base = await appDataDir();
    return join(base, workspaceRelativeDir.value, workspaceFileName.value);
}

function formatDate(value: string | null | undefined) {
    if (!value) return "-";
    return new Intl.DateTimeFormat("zh-CN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}
</script>

<style scoped>
.assignment-shell {
  min-height: 100vh;
  padding: 28px;
  color: #172026;
  background: #f7fafc;
}

.assignment-header {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 24px;
}

.back-button {
  min-width: 64px;
  min-height: 40px;
  border: 0;
  border-radius: 8px;
  padding: 0 14px;
  color: #172026;
  background: #ffffff;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 1px 2px -1px rgba(0, 0, 0, 0.08),
    0 2px 5px rgba(0, 0, 0, 0.05);
  transition-property: box-shadow, transform;
  transition-duration: 160ms;
  transition-timing-function: ease-out;
}

.back-button:active {
  transform: scale(0.96);
}

.eyebrow {
  margin: 0 0 6px;
  color: #0f766e;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  font-size: 30px;
  line-height: 1.18;
  text-align: left;
  text-wrap: balance;
}

.subtitle {
  margin-top: 8px;
  color: #52636c;
  text-wrap: pretty;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
  max-width: 860px;
}

.metric-card,
.panel {
  border-radius: 8px;
  background: #ffffff;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 1px 2px -1px rgba(0, 0, 0, 0.06),
    0 3px 8px rgba(0, 0, 0, 0.04);
}

.metric-card {
  min-height: 92px;
  padding: 16px;
}

.metric-card span {
  display: block;
  margin-bottom: 14px;
  color: #5f6f78;
  font-size: 13px;
}

.metric-card strong {
  font-size: 26px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  max-width: 1160px;
}

.panel {
  padding: 16px;
}

.submit-panel {
  grid-column: 1 / -1;
}

.submit-form {
  display: flex;
  align-items: center;
  gap: 10px;
}

.workspace-box {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
  border-radius: 8px;
  padding: 12px;
  background: #f8fbfc;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.workspace-copy {
  min-width: 0;
}

.workspace-copy strong {
  display: block;
  margin-bottom: 4px;
}

.workspace-copy p {
  color: #52636c;
  font-size: 13px;
}

.workspace-path {
  margin-top: 6px;
  overflow-wrap: anywhere;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
}

.workspace-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.file-picker {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  border-radius: 8px;
  padding: 0 12px;
  color: #172026;
  background: #f8fbfc;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.file-picker input {
  max-width: 260px;
  margin-left: 10px;
}

.primary-button {
  min-height: 40px;
  border: 0;
  border-radius: 8px;
  padding: 0 14px;
  color: #ffffff;
  background: #0f766e;
  transition-property: opacity, transform;
  transition-duration: 160ms;
  transition-timing-function: ease-out;
}

.secondary-button {
  min-height: 40px;
  border: 0;
  border-radius: 8px;
  padding: 0 14px;
  color: #172026;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  transition-property: opacity, transform;
  transition-duration: 160ms;
  transition-timing-function: ease-out;
}

.primary-button:disabled,
.secondary-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.primary-button:active:not(:disabled),
.secondary-button:active:not(:disabled) {
  transform: scale(0.96);
}

.section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.section-heading h2 {
  font-size: 18px;
  text-wrap: balance;
}

.section-heading span,
time,
.list span {
  color: #6b7a83;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 56px;
  border-radius: 8px;
  padding: 10px 12px;
  background: #f8fbfc;
}

.list-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  min-height: 44px;
  border: 0;
  border-radius: 8px;
  padding: 0;
  color: inherit;
  text-align: left;
  background: transparent;
  box-shadow: none;
  transition: transform 120ms ease-out;
}

.list-button:active {
  transform: scale(0.96);
}

.list strong {
  color: #172026;
}

.list p {
  margin-top: 2px;
  color: #52636c;
  font-size: 13px;
  text-wrap: pretty;
}

.empty-state,
.error-state {
  border-radius: 8px;
  padding: 14px 16px;
  color: #52636c;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.error-state {
  margin-bottom: 16px;
  color: #991b1b;
  background: #fff1f2;
  box-shadow: 0 0 0 1px rgba(153, 27, 27, 0.12);
}

.error-state.compact,
.success-state {
  margin-top: 12px;
}

.success-state {
  border-radius: 8px;
  padding: 12px 14px;
  color: #166534;
  background: #f0fdf4;
  box-shadow: 0 0 0 1px rgba(22, 101, 52, 0.12);
}

@media (max-width: 760px) {
  .assignment-shell {
    padding: 18px;
  }

  .assignment-header {
    flex-direction: column;
  }

  .metrics,
  .content-grid {
    grid-template-columns: 1fr;
  }

  .submit-form,
  .workspace-box,
  .workspace-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
