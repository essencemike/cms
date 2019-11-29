<template lang="pug">
.eui-empty
  .empty-text(v-if="emptyText") {{ emptyText }}
  .empty-img
    img(alt="empty image", src="@/assets/empty.png")
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EuiEmpty extends Vue {
  @Prop({ type: String, default: '' }) emptyText!: string;
}
</script>
<style lang="less" scoped>
.eui-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 0;

  .empty-text {
    margin-bottom: 10px;
    align-self: flex-start;
    font-size: 12px;
    color: #171717;
  }
}
</style>
