<template>
  <el-scrollbar style="height: 40%; margin-right: 2%;">
    <el-menu
        id="assign-sider"
        class="el-menu-vertical-demo"
        :collapse="myCollapse"
        @select="handleUpdateMenu"
        style="border-right: none; width: 100%;"
    >
      <h2 v-if="!myCollapse">Assignment Files</h2>
      <template v-for="(item, index) in nodes.values()" :key="index">
        <tree-menu v-if="item.format===AssignFileType.zip" :index="item.url" :nodes="[item]"/>
        <el-menu-item v-else :index="item.url">
          <el-icon v-if="item.format===AssignFileType.video">
            <VideoPlay/>
          </el-icon>
          <el-icon v-else-if="item.format===AssignFileType.image">
            <PictureFilled/>
          </el-icon>
          <el-icon v-else>
            <Document/>
          </el-icon>
          <template #title>
            <span>{{ item.filename }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {PropType} from 'vue';

import {FileTo, FileTreeNode} from '@/store/assign';
import {useRouterPush} from "@/composable";
import {AssignFileType} from "@/store/assign";
import {encrypt} from "@/util";
import {findNode} from "@/composable/grade";

const props = defineProps({
  nodes: {
    type: Object as PropType<Map<string, FileTreeNode>>,
    required: true
  },
  myCollapse: {
    type: Boolean,
    required: true
  }
})

const handleUpdateMenu = (_key: string, keyPath: string[]) => {
  let node: undefined | FileTreeNode;
  if (_key == keyPath[0]) {
    node = props.nodes.get(_key) as FileTreeNode;
  } else  {
    let root = props.nodes.get(keyPath[0]) as FileTreeNode;
    node = findNode(root, keyPath);
  }
  let to = new FileTo(node.url, node.format);
  const {routerPush} = useRouterPush();
  routerPush({
    name: 'render',
    query: {
      detail: encrypt(to),
    }
  })
}

</script>

<script lang="ts">
import {defineComponent} from 'vue';
import {
  Document,
  VideoPlay,
  PictureFilled,
} from '@element-plus/icons-vue'
import TreeMenu from "@/components/AssignLeftBar/TreeMenu.vue";

export default defineComponent({
  name: 'Sider',
  components: {
    TreeMenu,
    Document,
    VideoPlay,
    PictureFilled,
  },
});

</script>

<style scoped>
.el-menu-vertical-demo {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
