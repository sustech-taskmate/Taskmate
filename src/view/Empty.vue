<template>
  <h1>Unauthenticated!</h1>
</template>

<script lang="ts" setup>
import {useRouterPush} from "@/composable";
import {loginAuth} from '@/util'
import {login} from "@/composable/serverRequest";

await loginAuth()

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

window.addEventListener('setToken', listener)
</script>

<style scoped>

</style>
