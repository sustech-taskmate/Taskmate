<template>
  <main class="submission-shell" data-testid="lms-submission">
    <header class="submission-header">
      <button class="back-button" type="button" @click="goBack">返回</button>
      <div>
        <p class="eyebrow">{{ submission?.problem.class.course.name || "LMS" }}</p>
        <h1>{{ submission?.assignment.title || "提交详情" }}</h1>
        <p class="subtitle">{{ submission?.submitter.name || "正在加载提交信息" }}</p>
      </div>
    </header>

    <p v-if="error" class="error-state" data-testid="lms-submission-error">{{ error }}</p>
    <p v-if="isLoading" class="empty-state" data-testid="lms-submission-loading">正在加载提交...</p>

    <template v-if="submission && !isLoading">
      <section class="metrics" aria-label="提交概览">
        <article class="metric-card">
          <span>状态</span>
          <strong>{{ judgeLabel }}</strong>
        </article>
        <article class="metric-card">
          <span>分数</span>
          <strong>{{ scoreLabel }}</strong>
        </article>
        <article class="metric-card">
          <span>文件</span>
          <strong>{{ submission.fileEntries.length }}</strong>
        </article>
      </section>

      <section class="content-grid">
        <article class="panel">
          <div class="section-heading">
            <h2>提交信息</h2>
            <span>{{ formatDate(submission.createdAt) }}</span>
          </div>
          <dl class="detail-list">
            <div>
              <dt>学生</dt>
              <dd>{{ submission.submitter.name }} · {{ submission.submitter.email }}</dd>
            </div>
            <div>
              <dt>题目</dt>
              <dd>{{ submission.problem.title }}</dd>
            </div>
            <div>
              <dt>提交名</dt>
              <dd>{{ submission.name }}</dd>
            </div>
          </dl>
        </article>

        <article class="panel">
          <div class="section-heading">
            <h2>文件</h2>
            <span>{{ submission.fileEntries.length }} 项</span>
          </div>
          <ul v-if="submission.fileEntries.length" class="list">
            <li v-for="item in submission.fileEntries" :key="item.id">
              <button class="list-button" type="button" @click="openSubmissionFile(item)">
                <div>
                  <strong>{{ item.name }}</strong>
                  <p>{{ item.type || "FILE" }}</p>
                </div>
                <span>{{ formatSize(item.size) }}</span>
              </button>
            </li>
          </ul>
          <p v-else class="empty-state">暂无文件。</p>
          <p v-if="fileMessage" class="success-state compact" data-testid="submission-file-success">{{ fileMessage }}</p>
          <p v-if="fileError" class="form-error compact">{{ fileError }}</p>
        </article>

        <article class="panel wide">
          <div class="section-heading">
            <h2>反馈</h2>
            <span>{{ submission.feedbacks.length }} 条</span>
          </div>
          <ul v-if="submission.feedbacks.length" class="list">
            <li v-for="item in submission.feedbacks" :key="item.id">
              <div>
                <strong>{{ item.score }}</strong>
                <p>{{ item.reason || item.creator?.name || "无备注" }}</p>
              </div>
              <time>{{ formatDate(item.releasedAt) }}</time>
            </li>
          </ul>
          <p v-else class="empty-state">暂无反馈。</p>
        </article>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {
    getLmsResource,
    getLmsSubmission,
    LmsSubmissionDetails
} from "@/composable/serverRequest";

const route = useRoute();
const router = useRouter();
const submission = ref<LmsSubmissionDetails | null>(null);
const isLoading = ref(true);
const error = ref("");
const fileMessage = ref("");
const fileError = ref("");

const judgeLabel = computed(() => {
    const judge = submission.value?.currentAutoJudge;
    if (!judge) return "submitted";
    return judge.verdict || judge.phase;
});
const scoreLabel = computed(() => {
    const grade = submission.value?.currentGrade.released || submission.value?.currentGrade.draft;
    if (grade) return String(grade.points);
    const rawScore = submission.value?.currentAutoJudge?.rawScore;
    return typeof rawScore === "number" ? String(rawScore) : "-";
});

onMounted(loadSubmission);

async function loadSubmission() {
    isLoading.value = true;
    error.value = "";
    fileMessage.value = "";
    fileError.value = "";
    try {
        const details = await getLmsSubmission(String(route.params.slug));
        submission.value = details;
    } catch {
        error.value = "无法连接 LMS，请稍后重试。";
    } finally {
        isLoading.value = false;
    }
}

async function goBack() {
    const classId = submission.value?.problem.class.id;
    if (classId) {
        await router.push({name: "lmsClass", params: {id: classId}});
        return;
    }
    await router.push({name: "index"});
}

async function openSubmissionFile(item: LmsSubmissionDetails["fileEntries"][number]) {
    fileMessage.value = "";
    fileError.value = "";

    if (item.type && item.type !== "FILE") {
        fileError.value = "文件夹暂不支持直接打开。";
        return;
    }

    const resource = await getLmsResource(item.id).catch(() => null);
    if (!resource?.url) {
        fileError.value = "无法打开文件。";
        return;
    }

    globalThis.open(resource.url, "_blank", "noopener");
    fileMessage.value = `已打开 ${item.name}`;
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

function formatSize(value: number | null | undefined) {
    if (!value) return "-";
    if (value < 1024) return `${value} B`;
    return `${(value / 1024).toFixed(1)} KB`;
}
</script>

<style scoped>
.submission-shell {
  min-height: 100vh;
  padding: 28px;
  color: #172026;
  background: #f7fafc;
}

.submission-header {
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

.panel.wide {
  grid-column: 1 / -1;
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

.list strong,
.detail-list dd {
  color: #172026;
}

.list p {
  margin-top: 2px;
  color: #52636c;
  font-size: 13px;
  text-wrap: pretty;
}

.success-state,
.form-error {
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
}

.success-state.compact,
.form-error.compact {
  margin-top: 12px;
}

.success-state {
  color: #0f5132;
  background: #ecfdf3;
}

.form-error {
  color: #991b1b;
  background: #fff1f2;
}

.detail-list {
  display: grid;
  gap: 12px;
  margin: 0;
}

.detail-list div {
  display: grid;
  gap: 4px;
}

.detail-list dt {
  color: #6b7a83;
  font-size: 13px;
}

.detail-list dd {
  margin: 0;
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

@media (max-width: 760px) {
  .submission-shell {
    padding: 18px;
  }

  .submission-header {
    flex-direction: column;
  }

  .metrics,
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
