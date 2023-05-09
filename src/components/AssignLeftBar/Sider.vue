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
      <template v-for="(item, index) in this.nodes.values()" :key="index">
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

<script lang="ts">
import {
  Document,
  VideoPlay,
  PictureFilled,
} from '@element-plus/icons-vue'
import {defineComponent, PropType} from 'vue';
import TreeMenu from "@/components/AssignLeftBar/TreeMenu.vue";
import {FileTo, FileTreeNode} from '@/store/assign';
import {useRouterPush} from "@/composable";
import {AssignFileType} from "@/store/assign";
import {encrypt} from "@/util/crypto";
import {useRoute} from "vue-router";
import {findNode} from "@/composable/grade";

export default defineComponent({
  name: 'Sider',
  props: {
    nodes: {
      type: Object as PropType<Map<string, FileTreeNode>>,
      required: true
    },
    myCollapse: {
      type: Boolean,
      required: true
    }
  },
  components: {
    TreeMenu,
    Document,
    VideoPlay,
    PictureFilled,
  },
  data() {
    return {
      route: useRoute(),
      AssignFileType: AssignFileType
    }
  },
  methods: {
    handleUpdateMenu(_key: string, keyPath: string[]) {
      let node = undefined;
      if (_key == keyPath[0]) {
        node = this.nodes.get(_key) as FileTreeNode;
      } else  {
        let root = this.nodes.get(keyPath[0]) as FileTreeNode;
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
  }
});

</script>

<style scoped>
.el-menu-vertical-demo {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
