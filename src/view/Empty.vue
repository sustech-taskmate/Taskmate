<template>
  <h1>Unauthenticated!</h1>
</template>

<script lang="ts" setup>
import {useRouterPush} from "@/composable";
import {request} from "@/service/request";
import type {Service} from "@/typing/system";
import {Body} from "@tauri-apps/api/http";
import {loginAuth} from '@/util'

loginAuth()

let listener = async function (e: any) {
  if (e.detail && e.detail.key == 'token' && e.detail.value) {
    let token = e.detail.value
    const {routerPush} = useRouterPush();
    await request.post("https://spaces.sustech.cloud/api/auth/login",
        {
          body: Body.json({
            token: token
          })
        } as Service.RequestOption);
    await routerPush({name: 'index'})
  }
  window.removeEventListener("setToken", listener)
}

window.addEventListener('setToken', listener)
</script>

<style scoped>

</style>
