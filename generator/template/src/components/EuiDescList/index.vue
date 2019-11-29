<template lang="pug">
.eui-desc-list
  el-row(:gutter="20")
    template(v-for="n in span")
      el-col(:span="getSpan(n)")
        dl.dl-horizontal
          template(v-for="map in getMapping(n)")
            dt(:title="map.value") {{ map.value }}:
            dd(v-if="map.type && map.type === 'file'")
              div(v-if="data[map.key]")
                .file-wrapper(
                  v-for="(item, index) in getImageArray(map)",
                  @click="download(item, data[map.fileNameKey][index])"
                )
                  .fa.fa-file-archive-o(aria-hidden="true", style="margin-right: 5px;")
                  | {{ data[map.fileNameKey][index] }}
              span(v-else) {{ empty }}
            dd(v-if="map.type && map.type === 'image'")
              .img-container(v-if="data[map.key]")
                .img-wrapper(
                  v-for="item in getImageArray(map)",
                  :key="item",
                  @click="openImg(item)"
                )
                  img(:alt="map.value", :src="convertUrl(item)")
              span(v-else) {{ empty }}
            dd(v-if="!map.type")  {{ getData(map) }}
  el-dialog(
    :visible.sync="imageVisible",
    append-to-body,
    width="49%",
    top="24px",
    @close="hanleClose",
  )
    div(style="width: 90%; margin: auto;")
      img(:src="bigImageUrl", width="100%")
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import isFunction from 'lodash/isFunction';
import { downloadLink } from '@/utils/download';
import { IMAGE_PREFIX, FILE_PREFIX } from '@/config';

const prefix = process.env.VUE_APP_IMAGE_SERVER;

@Component
export default class EuiDescList extends Vue {
  @Prop({ type: Array, required: true }) mapping!: any[];
  @Prop({ type: Object, required: true }) data!: any;
  @Prop({ type: String, default: '--' }) empty!: string;
  // 根据 element-ui 栅栏系统，暂时不考虑不被24整除的span
  @Prop({ type: Number, default: 1 }) span!: number;
  @Prop({ type: Number }) left!: number;

  row: number = 24;
  imageVisible: boolean = false;
  bigImageUrl: any = '';

  getSpan() {
    return Math.floor(this.row / this.span);
  }

  /**
   * key: string,
   * value: string,
   * hidden: boolean | function,
   * fn: function, 自定义展示方式
   */
  getData(map: any) {
    if (map.fn && isFunction(map.fn)) {
      return map.fn(this.data);
    }

    return this.data[map.key] || this.empty;
  }

  filterMapping() {
    // 去掉不显现的mapping
    return this.mapping.filter((map: any) => {
      const hidden = map.hidden || false;

      if (isFunction(hidden)) {
        return !hidden(this.data);
      }

      return !hidden;
    });
  }

  getMapping(n: number) {
    const mapping = this.filterMapping();
    const size = Math.ceil(mapping.length / this.span);
    const start = size * ( n - 1);
    const end = n * size;

    // 适配只有2列，且指定了左边一列的数量
    if (this.left && this.span === 2) {
      const s = this.left * (n - 1);
      const e = n === 1 ? this.left : mapping.length;
      return mapping.slice(this.left * (n - 1), e);
    }
    return mapping.slice(start, end);
  }

  getImageArray(map: any) {
    const value = this.data[map.key];
    return Array.isArray(value) ? value : [value];
  }

  download(item: string, filename: string) {
    const url = `${FILE_PREFIX}${item}`;
    downloadLink(url, filename);
  }

  convertUrl(key: string) {
    return `${IMAGE_PREFIX}${key}`;
  }

  openImg(key: string) {
    const imgSrc = this.convertUrl(key);
    this.imageVisible = true;
    this.bigImageUrl = imgSrc;
  }

  hanleClose() {
    this.imageVisible = false;
    this.bigImageUrl = '';
  }
}
</script>
<style lang="less" scoped>
</style>
