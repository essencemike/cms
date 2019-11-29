<template lang="pug">
section.logo-wrapper
  router-link.logo-img-wrapper(to="/")
    img(alt="logo", src="~@/assets/logo-mini.png")
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Logo extends Vue {}
</script>
<style lang="less" scoped>
@import "~@/styles/variables.less";

.logo-wrapper {
  width: 200px;
  height: @navbar_height;
  background-color: @aside-bg-color;

  .logo-img-wrapper {
    display: block;
    width: 100%;
    height: 100%;
    // background: url('~@/assets/logo.png');
    // background-size: contain;
    // background-repeat: no-repeat;

    > img {
      width: 140px;
      height: 80px;
      margin-top: -10px;
      margin-left: 20px;
    }
  }
}
</style>
