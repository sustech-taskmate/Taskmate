<template>
  <main class="auth-shell" data-testid="auth-empty">
    <section class="auth-panel">
      <p class="eyebrow">LMS</p>
      <h1>等待授权</h1>
      <p class="subtitle">{{ authMessage }}</p>
    </section>
  </main>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useRouterPush} from "@/composable";
import {loginAuth} from '@/util'
import {login} from "@/composable/serverRequest";

const authMessage = ref("正在连接 LMS 账号...");

let listener = async function (e: any) {
  if (e.detail && e.detail.key == 'token' && e.detail.value) {
    const token = e.detail.value
    const {routerPush} = useRouterPush();
    const res = await login(token)
    if (res) {
      await routerPush({name: 'index'})
      window.removeEventListener("setToken", listener)
    }
  }
}

onMounted(async () => {
  window.addEventListener('setToken', listener)
  try {
    await loginAuth()
  } catch {
    authMessage.value = "暂时无法打开授权入口。"
  }
})

onUnmounted(() => {
  window.removeEventListener("setToken", listener)
})
</script>

<style scoped>
.auth-shell {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 24px;
  color: #172026;
  background: #f7fafc;
}

.auth-panel {
  width: min(420px, 100%);
  border-radius: 8px;
  padding: 24px;
  background: #ffffff;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 1px 2px -1px rgba(0, 0, 0, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.06);
}

.eyebrow {
  margin: 0 0 8px;
  color: #0f766e;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
}

h1,
p {
  margin: 0;
}

h1 {
  font-size: 28px;
  line-height: 1.18;
  text-wrap: balance;
}

.subtitle {
  margin-top: 10px;
  color: #52636c;
  text-wrap: pretty;
}
</style>
