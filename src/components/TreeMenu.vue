<template>
  <el-menu v-for="(node, index) in nodes" :key="index" :index="node.filename">
    <el-sub-menu v-if="node.isDir">
      <template #title>
        <el-icon>
          <Location/>
        </el-icon>
        <span>{{ node.filename }}</span>
      </template>
      <tree-menu :nodes="node.children"></tree-menu>
    </el-sub-menu>
    <el-menu-item v-if="!node.isDir" :index="node.filename">
      <template #title>
        {{ node.filename }}
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {FileTreeNode} from '@/store/assign';
import {Location} from "@element-plus/icons-vue";

export default defineComponent({
  name: 'TreeMenu',
  components: {Location},
  props: {
    nodes: {
      type: Array as () => FileTreeNode[],
      required: true,
    },
  },
});

</script>