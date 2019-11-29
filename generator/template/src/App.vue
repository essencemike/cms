<template>
  <div id="app" class="app">
    <router-view />
  </div>
</template>

<style lang="less">
html, body {
  width: 100%;
  height: 100%;
  // background-color: #f0f0f0;
  overflow: hidden;
}
.app {
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-family: Helvetica Neue, Helvetica, STHeiti, Microsoft YaHei, Verdana, Arial, Tahoma, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
