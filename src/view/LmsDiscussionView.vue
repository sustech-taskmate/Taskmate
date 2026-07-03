<template>
  <main class="discussion-shell" data-testid="lms-discussion">
    <header class="discussion-header">
      <button class="back-button" type="button" @click="goBack">返回</button>
      <div>
        <p class="eyebrow">LMS 讨论</p>
        <h1>{{ discussion?.title || "讨论" }}</h1>
        <p class="subtitle">{{ discussion ? `${discussion.posts.length} 条回复` : "正在加载讨论" }}</p>
      </div>
    </header>

    <p v-if="error" class="error-state" data-testid="lms-discussion-error">{{ error }}</p>
    <p v-if="isLoading" class="empty-state" data-testid="lms-discussion-loading">正在加载讨论...</p>

    <template v-if="discussion && !isLoading">
      <section class="panel">
        <div class="section-heading">
          <h2>帖子</h2>
          <span>{{ formatDate(discussion.updatedAt) }}</span>
        </div>
        <ul v-if="discussion.posts.length" class="post-list">
          <li v-for="item in discussion.posts" :key="item.id">
            <div class="post-meta">
              <strong>{{ item.author.name || item.author.email || "未知用户" }}</strong>
              <time>{{ formatDate(item.createdAt) }}</time>
            </div>
            <p>{{ bodyText(item.body) }}</p>
          </li>
        </ul>
        <p v-else class="empty-state">暂无帖子。</p>
      </section>

      <section class="panel">
        <div class="section-heading">
          <h2>回复</h2>
          <span>{{ reply.length }}/1000</span>
        </div>
        <form class="reply-form" @submit.prevent="submitReply">
          <textarea
            v-model="reply"
            aria-label="回复"
            maxlength="1000"
            rows="4"
            placeholder="写一条回复"
          />
          <button class="primary-button" type="submit" :disabled="isSubmitting || !reply.trim()">
            {{ isSubmitting ? "发送中..." : "发送回复" }}
          </button>
          <p v-if="message" class="success-state" data-testid="discussion-success">{{ message }}</p>
          <p v-if="replyError" class="error-state compact">{{ replyError }}</p>
        </form>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {createLmsDiscussionPost, getLmsDiscussion, LmsDiscussionDetails} from "@/composable/serverRequest";

const route = useRoute();
const router = useRouter();
const discussion = ref<LmsDiscussionDetails | null>(null);
const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref("");
const replyError = ref("");
const message = ref("");
const reply = ref("");

onMounted(loadDiscussion);

async function loadDiscussion() {
    isLoading.value = true;
    error.value = "";
    try {
        discussion.value = await getLmsDiscussion(String(route.params.threadId));
    } catch {
        error.value = "无法连接 LMS，请稍后重试。";
    } finally {
        isLoading.value = false;
    }
}

async function submitReply() {
    if (!discussion.value) return;

    const body = reply.value.trim();
    if (!body) return;

    isSubmitting.value = true;
    replyError.value = "";
    message.value = "";
    try {
        const post = await createLmsDiscussionPost(discussion.value.id, body);
        if (!post) {
            replyError.value = "发送失败，请稍后重试。";
            return;
        }
        const now = new Date().toISOString();
        discussion.value.posts = [
            ...discussion.value.posts,
            {
                id: post.id,
                body,
                createdAt: now,
                updatedAt: now,
                author: {id: "me", name: "我", email: "", image: null},
            },
        ];
        reply.value = "";
        message.value = "已发送回复";
    } catch {
        replyError.value = "发送失败，请稍后重试。";
    } finally {
        isSubmitting.value = false;
    }
}

async function goBack() {
    if (discussion.value?.classId) {
        await router.push({name: "lmsClass", params: {id: discussion.value.classId}});
        return;
    }
    await router.push({name: "index"});
}

function bodyText(value: unknown): string {
    if (typeof value === "string") return value;
    if (!value) return "";
    if (Array.isArray(value)) return value.map(bodyText).filter(Boolean).join("\n");
    if (typeof value === "object") {
        const record = value as {text?: unknown; children?: unknown; root?: unknown};
        if (typeof record.text === "string") return record.text;
        if (record.root) return bodyText(record.root);
        if (record.children) return bodyText(record.children);
    }
    return JSON.stringify(value);
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
.discussion-shell {
  min-height: 100vh;
  padding: 28px;
  color: #172026;
  background: #f7fafc;
}

.discussion-header {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 24px;
}

.back-button,
.primary-button {
  min-height: 40px;
  border: 0;
  border-radius: 8px;
  padding: 0 14px;
}

.back-button {
  color: #172026;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.primary-button {
  color: #ffffff;
  background: #0f766e;
}

.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
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
}

.subtitle,
time,
.section-heading span {
  color: #52636c;
}

.panel {
  max-width: 860px;
  margin-bottom: 12px;
  border-radius: 8px;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.section-heading,
.post-meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}

.section-heading {
  margin-bottom: 12px;
}

.post-list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.post-list li {
  border-radius: 8px;
  padding: 12px;
  background: #f8fbfc;
}

.post-list p {
  margin-top: 8px;
  color: #172026;
  white-space: pre-wrap;
}

.reply-form {
  display: grid;
  gap: 10px;
}

textarea {
  width: 100%;
  box-sizing: border-box;
  border: 0;
  border-radius: 8px;
  padding: 12px;
  color: #172026;
  background: #f8fbfc;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  resize: vertical;
}

.empty-state,
.error-state,
.success-state {
  border-radius: 8px;
  padding: 12px 14px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.error-state {
  margin-bottom: 16px;
  color: #991b1b;
  background: #fff1f2;
}

.error-state.compact {
  margin: 0;
}

.success-state {
  color: #166534;
  background: #f0fdf4;
}

@media (max-width: 760px) {
  .discussion-shell {
    padding: 18px;
  }

  .discussion-header,
  .section-heading,
  .post-meta {
    flex-direction: column;
  }
}
</style>
