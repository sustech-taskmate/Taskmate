<template>
  <main class="class-shell" data-testid="lms-class">
    <header class="class-header">
      <button class="back-button" type="button" @click="goHome">返回</button>
      <div>
        <p class="eyebrow">{{ klass?.course.code || "LMS" }}</p>
        <h1>{{ klass?.name || "课程" }}</h1>
        <p class="subtitle">{{ klass?.course.name || "正在加载课程信息" }}</p>
      </div>
    </header>

    <p v-if="error" class="error-state" data-testid="lms-class-error">{{ error }}</p>
    <p v-if="isLoading" class="empty-state" data-testid="lms-class-loading">正在加载课程...</p>

    <template v-if="klass && !isLoading">
      <section class="metrics" aria-label="课程概览">
        <article class="metric-card">
          <span>成员</span>
          <strong>{{ klass.users.length }}</strong>
        </article>
        <article class="metric-card">
          <span>作业</span>
          <strong>{{ klass.assignments.length }}</strong>
        </article>
        <article class="metric-card">
          <span>近期截止</span>
          <strong>{{ deadlines.length }}</strong>
        </article>
        <article class="metric-card">
          <span>讨论</span>
          <strong>{{ discussionCount }}</strong>
        </article>
        <article class="metric-card">
          <span>资源</span>
          <strong>{{ resources.length }}</strong>
        </article>
      </section>

      <section class="content-grid">
        <article class="panel">
          <div class="section-heading">
            <h2>作业</h2>
            <span>{{ klass.assignments.length }} 项</span>
          </div>
          <ul v-if="klass.assignments.length" class="list">
            <li v-for="item in klass.assignments" :key="item.id">
              <button class="list-button" type="button" @click="openAssignment(item.id)">
                <div>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.name }}</p>
                </div>
                <time>{{ formatDate(item.endTime) }}</time>
              </button>
            </li>
          </ul>
          <p v-else class="empty-state">还没有作业。</p>
        </article>

        <article class="panel">
          <div class="section-heading">
            <h2>近期截止</h2>
            <span>{{ deadlines.length }} 项</span>
          </div>
          <ul v-if="deadlines.length" class="list">
            <li v-for="item in deadlines" :key="item.id">
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.slug }}</p>
              </div>
              <time>{{ formatDate(item.endTime) }}</time>
            </li>
          </ul>
          <p v-else class="empty-state">近期没有截止项。</p>
        </article>

        <article class="panel wide">
          <div class="section-heading">
            <h2>最近提交</h2>
            <span>{{ submissionTotal }} 次</span>
          </div>
          <ul v-if="submissions.length" class="activity-list" data-testid="class-submissions">
            <li v-for="item in submissions" :key="item.id">
              <button class="list-button" type="button" @click="openSubmission(item.slug)">
                <span>{{ item.submitterName }}</span>
                <strong>{{ item.assignment.title }}</strong>
                <time>{{ submissionStatus(item) }} · {{ formatDate(item.createdAt) }}</time>
              </button>
            </li>
          </ul>
          <p v-else class="empty-state">暂无提交。</p>
          <p v-if="submissionError" class="error-state compact">{{ submissionError }}</p>
        </article>

        <article class="panel">
          <div class="section-heading">
            <h2>公告</h2>
            <span>{{ announcements.length }} 条</span>
          </div>
          <ul v-if="announcements.length" class="list" data-testid="class-announcements">
            <li v-for="item in announcements" :key="item.id">
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.pinned ? "置顶" : "公告" }}</p>
              </div>
              <time>{{ formatDate(item.createdAt) }}</time>
            </li>
          </ul>
          <p v-else class="empty-state">暂无公告。</p>
        </article>

        <article class="panel">
          <div class="section-heading">
            <h2>课程资源</h2>
            <span>{{ resources.length }} 项</span>
          </div>
          <ul v-if="resources.length" class="list" data-testid="class-resources">
            <li v-for="item in resources" :key="item.id">
              <button class="list-button" type="button" @click="openResource(item)">
                <div>
                  <strong>{{ item.name }}</strong>
                  <p>{{ item.type || "FILE" }}</p>
                </div>
                <span>{{ formatSize(item.size) }}</span>
              </button>
            </li>
          </ul>
          <p v-else class="empty-state">暂无课程资源。</p>
          <p v-if="resourceMessage" class="success-state compact" data-testid="resource-success">{{ resourceMessage }}</p>
          <p v-if="resourceError" class="error-state compact">{{ resourceError }}</p>
        </article>

        <article class="panel wide">
          <div class="section-heading">
            <h2>讨论</h2>
            <span>{{ discussions.length }} 条</span>
          </div>
          <ul v-if="discussions.length" class="activity-list" data-testid="class-discussions">
            <li v-for="item in discussions" :key="item.id">
              <button class="list-button" type="button" @click="openDiscussion(item.id)">
                <span>{{ item.authorName || "未知用户" }}</span>
                <strong>{{ item.title }}</strong>
                <time>{{ item.replyCount || 0 }} 回复 · {{ formatDate(item.updatedAt) }}</time>
              </button>
            </li>
          </ul>
          <p v-else class="empty-state">暂无讨论。</p>
          <form class="discussion-form" @submit.prevent="createDiscussion">
            <input
              v-model="discussionTitle"
              aria-label="讨论标题"
              maxlength="160"
              placeholder="讨论标题"
              required
            >
            <textarea
              v-model="discussionBody"
              aria-label="讨论正文"
              maxlength="1000"
              rows="3"
              placeholder="讨论正文"
              required
            />
            <button class="primary-button" type="submit" :disabled="discussionDisabled">
              {{ isCreatingDiscussion ? "发布中..." : "发起讨论" }}
            </button>
            <p v-if="discussionError" class="error-state compact">{{ discussionError }}</p>
          </form>
        </article>

        <article class="panel">
          <div class="section-heading">
            <h2>学习路径</h2>
            <span>{{ learningProgressLabel }}</span>
          </div>
          <ul v-if="learningModules.length" class="list" data-testid="class-learning-path">
            <li v-for="item in learningModules" :key="item.id">
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.items?.length || 0 }} 项内容</p>
                <ul v-if="item.items?.length" class="learning-items">
                  <li v-for="child in item.items" :key="child.id">
                    <span>{{ child.title }}</span>
                    <div class="learning-actions">
                      <button
                        v-if="canOpenLearningItem(child)"
                        class="small-button"
                        type="button"
                        :aria-label="`打开 ${child.title}`"
                        @click="openLearningItem(child)"
                      >
                        打开
                      </button>
                      <button class="small-button" type="button" :disabled="pendingLearningItemId === String(child.id)" @click="toggleLearningItem(child)">
                        {{ pendingLearningItemId === String(child.id) ? "更新中..." : isLearningItemCompleted(child) ? "已完成" : "标记完成" }}
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <p v-else class="empty-state">暂无学习路径。</p>
          <p v-if="learningMessage" class="success-state compact" data-testid="learning-success">{{ learningMessage }}</p>
          <p v-if="learningError" class="error-state compact">{{ learningError }}</p>
        </article>

        <article class="panel">
          <div class="section-heading">
            <h2>题库</h2>
            <span>{{ problems.length }} 题</span>
          </div>
          <ul v-if="problems.length" class="list" data-testid="class-problems">
            <li v-for="item in problems" :key="item.id || item.name || item.title">
              <div>
                <strong>{{ item.title || item.name || "未命名题目" }}</strong>
                <p>{{ item.name || "problem" }}</p>
              </div>
            </li>
          </ul>
          <p v-else class="empty-state">暂无题目。</p>
        </article>

        <article class="panel wide">
          <div class="section-heading">
            <h2>课堂动态</h2>
            <span>{{ activities.length }} 条</span>
          </div>
          <ul v-if="activities.length" class="activity-list">
            <li v-for="item in activities" :key="item.id">
              <span>{{ item.actorName }}</span>
              <strong>{{ item.targetName }}</strong>
              <time>{{ formatDate(item.createdAt) }}</time>
            </li>
          </ul>
          <p v-else class="empty-state">暂无课堂动态。</p>
        </article>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {
    createLmsDiscussion,
    getLmsClass,
    getLmsClassSubmissions,
    getLmsResource,
    LmsClassDetails,
    LmsLearningPathItem,
    LmsClassSubmissionList,
    setLmsLearningItemCompletion
} from "@/composable/serverRequest";

const route = useRoute();
const router = useRouter();
const klass = ref<LmsClassDetails | null>(null);
const submissionList = ref<LmsClassSubmissionList | null>(null);
const isLoading = ref(true);
const error = ref("");
const submissionError = ref("");
const resourceMessage = ref("");
const resourceError = ref("");
const learningMessage = ref("");
const learningError = ref("");
const pendingLearningItemId = ref("");
const discussionTitle = ref("");
const discussionBody = ref("");
const discussionError = ref("");
const isCreatingDiscussion = ref(false);

const deadlines = computed(() => klass.value?.deadlines ?? []);
const activities = computed(() => klass.value?.activities ?? []);
const announcements = computed(() => klass.value?.announcements ?? []);
const resources = computed(() => klass.value?.resources ?? []);
const discussions = computed(() => klass.value?.discussions ?? []);
const learningModules = computed(() => {
    const learningPath = klass.value?.learningPath;
    if (!learningPath) return [];
    return Array.isArray(learningPath) ? learningPath : learningPath.modules ?? [];
});
const learningProgressLabel = computed(() => {
    const learningPath = klass.value?.learningPath;
    if (!learningPath || Array.isArray(learningPath) || !learningPath.progress) {
        return `${learningModules.value.length} 个模块`;
    }
    const completedItems = learningPath.progress.completedRequiredItems ?? learningPath.progress.completedItems ?? 0;
    const totalItems = learningPath.progress.totalRequiredItems ?? learningPath.progress.totalItems ?? 0;
    return `${completedItems}/${totalItems} 项`;
});
const problems = computed(() => klass.value?.problems ?? []);
const discussionCount = computed(() => discussions.value.length);
const submissions = computed(() => submissionList.value?.submissions ?? []);
const submissionTotal = computed(() => submissionList.value?.pagination.total ?? submissions.value.length);
const discussionDisabled = computed(() => {
    return isCreatingDiscussion.value || !discussionTitle.value.trim() || !discussionBody.value.trim() || !klass.value;
});

onMounted(loadClass);

async function loadClass() {
    isLoading.value = true;
    error.value = "";
    submissionError.value = "";
    resourceMessage.value = "";
    resourceError.value = "";
    learningMessage.value = "";
    learningError.value = "";
    discussionError.value = "";
    try {
        const classId = String(route.params.id);
        const [classData, submissionData] = await Promise.all([
            getLmsClass(classId),
            getLmsClassSubmissions(classId).catch(() => null),
        ]);
        klass.value = classData;
        submissionList.value = submissionData;
        if (!submissionData) submissionError.value = "无法加载提交列表。";
    } catch {
        error.value = "无法连接 LMS，请稍后重试。";
    } finally {
        isLoading.value = false;
    }
}

async function goHome() {
    await router.push({name: "index"});
}

async function openAssignment(assignmentId: number) {
    await router.push({name: "lmsAssignment", params: {id: assignmentId}});
}

async function openSubmission(slug: string) {
    await router.push({name: "lmsSubmission", params: {slug}});
}

async function openDiscussion(threadId: string) {
    await router.push({name: "lmsDiscussion", params: {threadId}});
}

async function createDiscussion() {
    if (!klass.value) return;

    discussionError.value = "";
    isCreatingDiscussion.value = true;
    try {
        const result = await createLmsDiscussion(klass.value.id, {
            title: discussionTitle.value.trim(),
            body: discussionBody.value.trim(),
        });
        if (!result) {
            discussionError.value = "发布失败，请稍后重试。";
            return;
        }
        discussionTitle.value = "";
        discussionBody.value = "";
        await openDiscussion(result.id);
    } catch {
        discussionError.value = "发布失败，请稍后重试。";
    } finally {
        isCreatingDiscussion.value = false;
    }
}

async function openResource(item: NonNullable<LmsClassDetails["resources"]>[number]) {
    resourceMessage.value = "";
    resourceError.value = "";

    if (item.type && item.type !== "FILE") {
        resourceError.value = "文件夹暂不支持直接打开。";
        return;
    }

    const resource = await getLmsResource(item.id).catch(() => null);
    if (!resource?.url) {
        resourceError.value = "无法打开资源。";
        return;
    }

    globalThis.open(resource.url, "_blank", "noopener");
    resourceMessage.value = `已打开 ${item.name}`;
}

async function toggleLearningItem(item: LmsLearningPathItem) {
    learningMessage.value = "";
    learningError.value = "";

    const itemId = Number(item.id);
    if (!Number.isInteger(itemId) || itemId <= 0) {
        learningError.value = "无法更新学习项。";
        return;
    }

    pendingLearningItemId.value = String(item.id);
    try {
        const nextCompleted = !isLearningItemCompleted(item);
        const result = await setLmsLearningItemCompletion(itemId, nextCompleted);
        if (!result) {
            learningError.value = "更新失败，请稍后重试。";
            return;
        }
        item.completed = Boolean(result.completedAt);
        item.completedAt = result.completedAt;
        item.status = result.completedAt ? "completed" : "available";
        learningMessage.value = isLearningItemCompleted(item) ? "已标记完成" : "已取消完成";
    } catch {
        learningError.value = "更新失败，请稍后重试。";
    } finally {
        pendingLearningItemId.value = "";
    }
}

async function openLearningItem(item: LmsLearningPathItem) {
    learningMessage.value = "";
    learningError.value = "";

    if (item.status === "locked") {
        learningError.value = "学习项尚未解锁。";
        return;
    }

    if (item.assignmentId) {
        await router.push({name: "lmsAssignment", params: {id: item.assignmentId}});
        return;
    }

    if (item.fileEntryId) {
        const resource = await getLmsResource(item.fileEntryId).catch(() => null);
        if (!resource?.url) {
            learningError.value = "无法打开学习资源。";
            return;
        }
        globalThis.open(resource.url, "_blank", "noopener");
        learningMessage.value = `已打开 ${item.title}`;
        return;
    }

    if (item.externalUrl) {
        globalThis.open(item.externalUrl, "_blank", "noopener");
    }
}

function canOpenLearningItem(item: LmsLearningPathItem) {
    return Boolean(item.assignmentId || item.fileEntryId || item.externalUrl);
}

function isLearningItemCompleted(item: LmsLearningPathItem) {
    return item.completed === true || Boolean(item.completedAt) || item.status === "completed";
}

function submissionStatus(item: LmsClassSubmissionList["submissions"][number]) {
    return item.statuses.length ? item.statuses.join(" / ") : "submitted";
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
.class-shell {
  min-height: 100vh;
  padding: 28px;
  color: #172026;
  background: #f7fafc;
}

.class-header {
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
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
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
  font-size: 30px;
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

.list,
.activity-list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.list li,
.activity-list li {
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
  transition-property: transform;
  transition-duration: 120ms;
}

.list-button:active {
  transform: scale(0.96);
}

.list strong,
.activity-list strong {
  color: #172026;
}

.list p {
  margin-top: 2px;
  color: #52636c;
  font-size: 13px;
  text-wrap: pretty;
}

.learning-items {
  display: grid;
  gap: 6px;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}

.learning-items li {
  min-height: 36px;
  padding: 8px;
  background: #ffffff;
}

.small-button {
  min-height: 32px;
  border: 0;
  border-radius: 8px;
  padding: 0 10px;
  color: #0f766e;
  background: #eefcf8;
}

.small-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.learning-actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.discussion-form {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.discussion-form input,
.discussion-form textarea {
  width: 100%;
  box-sizing: border-box;
  border: 0;
  border-radius: 8px;
  padding: 10px 12px;
  color: #172026;
  background: #f8fbfc;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
}

.discussion-form textarea {
  resize: vertical;
}

.primary-button {
  min-height: 40px;
  border: 0;
  border-radius: 8px;
  padding: 0 14px;
  color: #ffffff;
  background: #0f766e;
}

.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.activity-list span {
  color: #0f766e;
  font-weight: 700;
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

.error-state.compact {
  margin: 12px 0 0;
}

.success-state {
  border-radius: 8px;
  padding: 12px 14px;
  color: #166534;
  background: #f0fdf4;
  box-shadow: 0 0 0 1px rgba(22, 101, 52, 0.12);
}

.success-state.compact {
  margin: 12px 0 0;
}

@media (max-width: 760px) {
  .class-shell {
    padding: 18px;
  }

  .class-header {
    flex-direction: column;
  }

  .metrics,
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
