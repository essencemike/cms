<template lang="pug">
.upload-component
  el-upload(
    :action='upLoadUrl',
    :headers='headers',
    :multiple='multiple',
    :limit='limit',
    :show-file-list='true',
    :disabled='false',
    :list-type="listType || 'picture-card'",
    :file-list='fileListArr',
    :before-upload='beforeAvatarUpload',
    :on-success='handleAvatarSuccess',
    :on-error='handleAvatarError',
    :on-preview='handlePictureCardPreview',
    :on-remove='handleRemove',
    :on-exceed='handleExceed',
    :class='{hide: hideUpload}'
  )
    i.el-icon-plus(v-if="listType !== 'text'")
    div(v-else='')
      el-button(size='small')
        i.el-icon-upload2
        | 上传文件
  el-dialog(:visible.sync='dialogVisible')
    img(width='100%', :src='dialogImageUrl', alt='')
</template>

<script lang="ts">
// props: {
//     multiple: Boolean,  // 是否支持多选文件
//     listType: String,   // 文件列表的类型 text/picture/picture-card
//                            默认picture-card
//                            为text的时候 是上传附件
//     fileListArr: Ayyay, // 上传的文件列表 默认[]
//     limit:Number,       // 最大允许上传个数
// }

// 传给父组件的函数
// deleteImg(data) // 删除的单条数据
// imageData(data) // 新增的单条数据

// 优化： 所有图片上传的地方，有最大限制数的情况下，达到最大数量时不再显示后面的+上传图标
// 根据fileListNum和limit的值来判断

import { Component, Vue, Prop } from 'vue-property-decorator';
import { getToken } from '@/utils/index';
import { uploadConfig } from '@/utils/upload_config';
import { handleResponse } from '@/config';

@Component
export default class Upload extends Vue {
  @Prop(Boolean) multiple!: boolean;
  @Prop({ type: String, default: 'picture-card' }) listType!: string;
  @Prop({ type: Array, required: true }) fileListArr!: any[];
  @Prop(Number) limit!: number;

  // initial data
  dialogImageUrl = '';
  dialogVisible = false;
  hideUpload = false;
  imgData: any = {};
  headers = uploadConfig.headers;

  fileListNum = 0; // 上传的个数

  upLoadUrl = uploadConfig.action;

  // 图片上传之前
  beforeAvatarUpload(file: any) {
    const isLt100M = file.size / 1024 / 1024 < 100;
    if (this.listType === 'text') { // 上传附件
      const fileType = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
      // zip或rar格式的压缩包、Word文档、Excel表格的
      if (
        fileType === 'xlsx' ||
        fileType === 'doc' ||
        fileType === 'docx' ||
        fileType === 'xls' ||
        fileType === 'zip' ||
        fileType === 'rar'
      ) {

        if (!isLt100M) {
          this.$message.error('上传文件不能超过 100MB!');
          return false;
        }
        return true;
      } else {
        this.$message.error('请上传正确的文件格式!');
        return false;
      }
    }

    const isJPEG = file.type === 'image/jpeg';
    const isJPG = file.type === 'image/jpg';
    const isPNG = file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 5;

    if (!isJPG && !isJPEG && !isPNG) {
      this.$message.error('图片只能是jpeg/png/jpg格式!');
    }
    if (!isLt2M) {
      this.$message.error('图片大小不能超过 5MB!');
    }
    if ((isJPEG || isJPG || isPNG) && isLt2M) this.hideUpload = true;
    return (isJPEG || isJPG || isPNG) && isLt2M;
  }

  // 图片上传成功
  async handleAvatarSuccess(res: any, file: any) {
    // 控制加号是否显示
    this.fileListNum ++;
    if (+this.limit === 1) this.hideUpload = true;
    else this.hideUpload = this.fileListNum >= this.limit;

    const data = await handleResponse({ data: res });

    this.imgData.id = data.id;
    this.imgData.uri = data.uri;
    this.$emit('imageData', data);

    if (this.listType === 'text') this.$message.success('附件上传成功');
    else this.$message.success('图片上传成功');
  }

  // 图片上传失败
  handleAvatarError() {
    if (this.listType === 'text') this.$message.error('附件上传失败，请重新上传');
    else this.$message.error('图片上传失败，请重新上传');
  }

  // 预览图
  handlePictureCardPreview(file: any) {
    this.dialogImageUrl = file.url;
    this.dialogVisible = true;
  }

  // 删除图片
  handleRemove(file: any) {
    this.fileListNum --;
    if (+this.limit === 1) this.hideUpload = false;
    else this.hideUpload = this.fileListNum >= this.limit;

    let codeDetail = '';
    if (!file.response && file.url) {
      const code = file.url.split('/');
      codeDetail = code[code.length - 1];
    }
    const fileCode = file && file.response && file.response.data && file.response.data.code;
    this.$emit('deleteImg', !file.response ? codeDetail : fileCode);
  }

  // 超出限制的文件的时候
  handleExceed(files: any, filesList: any[]) {
    if (this.listType === 'text') this.$message.error( `上传附件不能超过${this.limit}个`);
    else this.$message.error( `上传图片不能超过${this.limit}张`);
  }

  mounted() {
    setTimeout(() => {
      this.fileListNum = this.fileListArr.length;
      if (+this.limit === 1) this.hideUpload = +this.fileListNum === 1;
      else this.hideUpload = this.fileListNum >= this.limit;
    }, 500);
  }

}
</script>

<style lang="less" >
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
}
.hide .el-upload--picture-card {
  display: none;
}
</style>
