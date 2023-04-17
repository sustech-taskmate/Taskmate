<template>
  <template v-for="(node, index) in nodes" :key="index">
    <el-sub-menu v-if="node.isRoot" :index="node.filename">
      <template #title>
        <el-icon>
          <FolderOpened/>
        </el-icon>
        <span>{{ node.filename }}</span>
      </template>
      <tree-menu :nodes="node.children"></tree-menu>
    </el-sub-menu>
    <el-sub-menu v-else-if="node.isDir" :index="node.filename">
      <template #title>
        <el-icon>
          <Folder/>
        </el-icon>
        <span>{{ node.filename }}</span>
      </template>
      <tree-menu :nodes="node.children"></tree-menu>
    </el-sub-menu>
    <el-menu-item v-else :index="node.filename">
      <el-icon>
        <Document/>
      </el-icon>
      <template #title>
        {{ node.filename }}
      </template>
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
import type {FileTreeNode} from '@/store/assign';
import {Document, Folder, FolderOpened} from "@element-plus/icons-vue";
const props = defineProps({
  nodes:{
    type: Array as () => FileTreeNode[],
    required: true
  }
})
</script>