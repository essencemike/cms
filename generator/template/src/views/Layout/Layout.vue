<template lang="pug">
el-container.app-wrapper
  el-header.app-header
    navbar
  el-container.app-main-container
    el-aside.app-aside-wrapper(:width="sideWidth")
      sidebar
    el-main.app-main-wrapper
      app-main
</template>
<script lang="ts">
import { Getter } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';
import { Navbar, Sidebar, AppMain, Logo } from './components';

@Component({
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Logo,
  },
})
export default class Layout extends Vue {
  @Getter('sidebar') sidebar: any;

  get sideWidth() {
    return this.sidebar.opened ? '200px' : '64px';
  }
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
@import "~@/styles/mixin.less";
@import "~@/styles/variables.less";

.app-wrapper {
  .clearfix();
  position: relative;
  width: 100%;
  height: 100%;

  .app-header {
    background-color: #fff;
    box-shadow: 0 2px 1px 1px rgba(100, 100, 100, .1);
    position: relative;
    padding: 0;
    z-index: 11;
  }

  .app-aside-wrapper {
    background-color: @aside-bg-color;
    transition: width 0.38s;
  }

  .app-main-container {
    overflow: hidden;
  }

  .app-main-wrapper {
    overflow-x: hidden;
    padding: 0;
  }
}
</style>
