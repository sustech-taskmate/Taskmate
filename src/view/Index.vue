<template>
  <main class="lms-shell" data-testid="lms-home">
    <header class="topbar">
      <div>
        <p class="eyebrow">LMS Desktop</p>
        <h1>{{ displayName }} 的课程工作台</h1>
      </div>
      <button class="ghost-button" type="button" @click="refresh">
        刷新
      </button>
    </header>

    <p v-if="error" class="error-state" data-testid="lms-home-error">
      {{ error }}
    </p>

    <p v-if="isLoading" class="empty-state" data-testid="lms-home-loading">
      正在加载 LMS 数据...
    </p>

    <section v-if="!isLoading" class="metrics" aria-label="作业概览">
      <article class="metric-card">
        <span>总作业</span>
        <strong>{{ stats.totalAssignments }}</strong>
      </article>
      <article class="metric-card">
        <span>本周提交</span>
        <strong>{{ stats.submissionsThisWeek }}</strong>
      </article>
      <article class="metric-card warn">
        <span>待批改</span>
        <strong>{{ stats.pendingToGrade }}</strong>
      </article>
      <article class="metric-card">
        <span>平均分</span>
        <strong>{{ averageScore }}</strong>
      </article>
    </section>

    <section v-if="!isLoading" class="workspace">
      <div class="section-heading">
        <h2>我的课程</h2>
        <span>{{ classes.length }} 门</span>
      </div>

      <div v-if="classes.length > 0" class="class-grid">
        <button
          v-for="item in classes"
          :key="item.id"
          class="class-card"
          data-testid="class-card"
          type="button"
          @click="openClass(item.id)"
        >
          <div class="class-code">{{ item.code || "LMS" }}</div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.course.name }}</p>
          <div class="class-meta">
            <span>{{ item.semester.year }} {{ item.semester.season }}</span>
            <span>#{{ item.id }}</span>
          </div>
        </button>
      </div>

      <p v-else class="empty-state" data-testid="empty-classes">
        当前账号还没有加入课程。
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {getLmsHome, LmsHomeResponse} from "@/composable/serverRequest";

const home = ref<LmsHomeResponse | null>(null);
const isLoading = ref(true);
const error = ref("");
const router = useRouter();

const classes = computed(() => {
    const seasonOrder = new Map([
        ["Spring", 1],
        ["Summer", 2],
        ["Fall", 3],
        ["Winter", 4],
    ]);

    return [...(home.value?.classes ?? [])].sort((a, b) => {
        const semesterA = a.semester.year * 10 + (seasonOrder.get(a.semester.season) ?? 0);
        const semesterB = b.semester.year * 10 + (seasonOrder.get(b.semester.season) ?? 0);
        return semesterB - semesterA || a.id - b.id;
    });
});

const stats = computed(() => home.value?.assignmentStats ?? {
    totalAssignments: 0,
    submissionsThisWeek: 0,
    pendingToGrade: 0,
    averageScore: null,
});
const displayName = computed(() => home.value?.user.name || home.value?.user.email || "同学");
const averageScore = computed(() => {
    const score = stats.value.averageScore;
    return score === null ? "-" : score.toFixed(1);
});

async function refresh() {
    isLoading.value = true;
    error.value = "";
    try {
        home.value = await getLmsHome();
    } catch {
        error.value = "无法连接 LMS，请稍后重试。";
    } finally {
        isLoading.value = false;
    }
}

async function openClass(classId: number) {
    await router.push({name: "lmsClass", params: {id: classId}});
}

onMounted(refresh);
</script>

<style scoped>
.lms-shell {
  min-height: 100vh;
  padding: 28px;
  color: #172026;
  background:
    linear-gradient(180deg, rgba(247, 250, 252, 0.96), rgba(242, 246, 248, 0.98)),
    #f7fafc;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
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
h3,
p {
  margin: 0;
}

h1 {
  font-size: 28px;
  line-height: 1.2;
  text-align: left;
  text-wrap: balance;
}

.ghost-button {
  min-width: 72px;
  min-height: 40px;
  border: 0;
  border-radius: 8px;
  padding: 0 16px;
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

.ghost-button:hover {
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.08);
}

.ghost-button:active {
  transform: scale(0.96);
}

.metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 28px;
}

.metric-card {
  min-height: 96px;
  border-radius: 8px;
  padding: 16px;
  background: #ffffff;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 1px 2px -1px rgba(0, 0, 0, 0.06),
    0 3px 8px rgba(0, 0, 0, 0.04);
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

.metric-card.warn strong {
  color: #b45309;
}

.workspace {
  max-width: 1160px;
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
.class-meta {
  color: #6b7a83;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.class-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.class-card {
  display: block;
  width: 100%;
  min-height: 156px;
  border: 0;
  border-radius: 8px;
  padding: 16px;
  color: inherit;
  text-align: left;
  background: #ffffff;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 1px 2px -1px rgba(0, 0, 0, 0.06),
    0 3px 8px rgba(0, 0, 0, 0.04);
  transition-property: box-shadow, transform;
  transition-duration: 160ms;
  transition-timing-function: ease-out;
}

.class-card:active {
  transform: scale(0.96);
}

.class-card:hover {
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.09),
    0 4px 12px rgba(0, 0, 0, 0.08);
}

.class-code {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  border-radius: 6px;
  padding: 0 9px;
  margin-bottom: 16px;
  color: #0f766e;
  background: #e8f5f2;
  font-size: 12px;
  font-weight: 700;
}

.class-card h3 {
  margin-bottom: 6px;
  font-size: 17px;
  line-height: 1.25;
  text-wrap: balance;
}

.class-card p {
  min-height: 44px;
  color: #52636c;
  line-height: 1.45;
  text-wrap: pretty;
}

.class-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
}

.empty-state {
  border-radius: 8px;
  padding: 24px;
  color: #52636c;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.error-state {
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 16px;
  color: #991b1b;
  background: #fff1f2;
  box-shadow: 0 0 0 1px rgba(153, 27, 27, 0.12);
}

@media (max-width: 760px) {
  .lms-shell {
    padding: 18px;
  }

  .topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
