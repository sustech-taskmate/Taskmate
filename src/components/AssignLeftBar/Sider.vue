<template>
  <el-scrollbar style="height: 40%; margin-right: 2%;">
    <el-menu
        id="assign-sider"
        class="el-menu-vertical-demo"
        :default-active="route.query?.path"
        :collapse="myCollapse"
        @select="handleUpdateMenu"
        style="border-right: none; width: 100%;"
    >
      <h2>作业文件</h2>
      <template v-for="(item, index) in this.AssignMap.values()" :key="index">
        <TreeMenu v-if="item.format===AssignFileType.zip" :index="item.index" :nodes="zipNode">
        </TreeMenu>

        <el-menu-item v-else :index="item.index">
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
            <span>{{ item.name }}</span>
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
import JSZip, {JSZipObject} from 'jszip';
import {FileTreeNode, ZipFile} from '@/store/assign';
import {useRouterPush} from "@/composable";
import {AssignFileType} from "@/store/assign";
import {App} from "@/typing/system";
import {encrypt, decrypt} from "@/util/crypto";
import {useRoute} from "vue-router";

export default defineComponent({
  name: 'Sider',
  props: {
    AssignMap: {
      type: Object as PropType<Map<string, App.AssignMenu>>,
      required: true
    },
    zipNode: {
      type: Array as () => FileTreeNode[],
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
    handleUpdateMenu(_key: string, keyPath: string) {
      const {routerPush} = useRouterPush();
      routerPush({
        name: 'render',
        query: {
          detail: encrypt(this.AssignMap.get(_key.split('_')[0])),
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