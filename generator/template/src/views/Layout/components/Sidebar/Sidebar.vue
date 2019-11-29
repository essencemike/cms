<template lang="pug">
el-scrollbar(wrapClass="scrollbar-wrapper")
  el-menu.app-menu(
    mode="vertical",
    :show-timeout="200",
    :default-active="activeMenu",
    :collapse="isCollapse",
    background-color="#EAF1F6",
    text-color="#54667A",
    @select="handleSelect",
  )
    sidebar-item(
      v-for="route in routes",
      :key="route.path",
      :item="route",
      :base-path="route.path",
    ) {{ route.name }}
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { RouteConfig } from 'vue-router';

import SidebarItem from './SidebarItem.vue';

// background-color="#EAF1F6",
// text-color="#54667A",
// active-text-color="#3B8CFF",

@Component({
  components: { SidebarItem },
})
export default class Sidebar extends Vue {
  @Getter('sidebar') sidebar: any;
  @Getter('routes') routes!: RouteConfig[];

  get isCollapse() {
    return !this.sidebar.opened;
  }

  get activeMenu() {
    const { meta, path } = this.$route;
    if (meta.activeMenu) {
      return meta.activeMenu;
    }
    return path;
  }

  handleSelect(name: string) {
    if (name.indexOf('isTurnByHref__') > -1) {
      window.open(name.split('__')[1]);
      return;
    }
  }
}
</script>
<style lang="less" scoped>
.app-menu {
  border-right-color: #EAF1F6;
}
</style>
