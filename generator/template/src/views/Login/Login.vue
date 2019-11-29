<template lang="pug">
.login-wrap
  el-container
    el-main.login-content(ref='preview')
      .left
        el-header(height='80px')
          el-row
            el-col(:span='6')
              img.logo(:src='logoSrc', alt='这是一个logo')
        .loginBanner
      .login-content-inner
        .wid100.text-center
          h3.login-title 联通云雀-录单系统
        .wid100
          el-form.demo-ruleForm(:model='ruleForm', status-icon='', :rules='rules', ref='ruleForm')
            el-form-item(prop='tel')
              el-input(
                type='text',
                maxlength='11',
                placeholder='请输入手机号',
                prefix-icon='el-icon-mobile-phone',
                v-model.trim='ruleForm.tel',
                clearable
              )
            el-form-item
              el-row
                el-col(:span='15')
                  el-form-item(prop='valiteCode')
                    el-input(
                      type='text',
                      prefix-icon='el-icon-message',
                      placeholder='请输入验证码',
                      maxlength='4',
                      v-model.trim='ruleForm.valiteCode',
                      clearable
                    )
                el-col(:span='1') &nbsp;
                el-col(:span='8')
                  el-button.send-btn(size='small', @click='sendCode', :disabled='sendCodeDisable', :loading='sendCodeLoading')
                    | {{ ruleForm.sendCodeBtn }}
            .btns-wrap
              el-button(type='primary', :loading='loginLoading', @keyup.enter="submitForm('ruleForm')", @click="submitForm('ruleForm')") 登录
      el-footer.login-footer
        | Copyright©2019联通云数据有限公司
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Mutation } from 'vuex-class';
import { Form } from 'element-ui';
import { LoginForm } from '@/types/interface/user';
import { SET_USER } from '@/constants';
import { setToken, TOKEN_KEY, setLocalStorage, getLocalStorage, removeLocalStorage } from '@/utils';
import { countDown } from '@/utils/time';
import { errorCaptured } from '@/utils/async';

@Component
export default class LoginControl extends Vue {
  logoSrc: any = require('@/assets/logo.png');
  sendCodeDisable: boolean = false;
  sendCodeLoading: boolean = false;
  loginLoading: boolean = false;
  ruleForm: any = {
    tel: '',
    valiteCode: '',
    sendCodeBtn: '获取验证码',
  };

  rules: any = {
    tel: [
      { required: true, message: '手机号不能为空', trigger: 'blur' },
      { validator: this.telValite, message: '手机号格式错误', trigger: 'blur' },
    ],
    valiteCode: [
      { required: true, message: '验证码不能为空', trigger: ['blur'] },
    ],
  };

  @Mutation(SET_USER) SET_USER: any;

  get redirectUrl(): string {
    let redirect = this.$route.query.redirect;

    if (Array.isArray(redirect)) {
      redirect = redirect[0] as string;
    }

    return redirect || '/';
  }

  telValite(rule: any, value: any, callback: any): any {
    const reg: any = /^1[3-9][0-9]{9}$/;
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('手机号格式错误'));
    }
  }

  endingStatus() {
    this.sendCodeDisable = false;
    this.sendCodeLoading = false;
    this.ruleForm.sendCodeBtn = '获取验证码';
  }

  pendingStatus(time: number) {
    this.sendCodeDisable = true;
    this.ruleForm.sendCodeBtn = `重新发送(${time}s)`;
  }

  async sendVerifCode() {
    this.sendCodeLoading = true;
    this.sendCodeLoading = true;

    await errorCaptured(this.$api.global.sendCode({ telephone: this.ruleForm.tel }));
    this.$message.success('短信验证码已发送，请查收');

    this.sendCodeLoading = false;
    this.sendCodeLoading = false;
  }

  sendCode(): void {
    const reg: any = /^1[3-9][0-9]{9}$/;
    if (reg.test(this.ruleForm.tel)) {
      countDown(this.endingStatus, this.pendingStatus, this.sendVerifCode);
    } else {
      this.$message.error('手机号格式错误');
    }
  }

  submitForm(formName: string) {
    (this.$refs[formName] as Form).validate(async (valid: boolean) => {
      if (valid) {
        this.loginLoading = true;
        const params = {
          telephone: this.ruleForm.tel,
          identifyingCode: this.ruleForm.valiteCode,
        };
        const [err, user] = await errorCaptured(this.$api.global.codeLogin(params));

        this.loginLoading = false;

        setToken(user[TOKEN_KEY]);
        this.SET_USER(user);
        this.$router.push({ path: this.redirectUrl });
      }

      return false;
    });
  }
}
</script>
<style lang="less" scoped>
@import "~@/styles/variables";
@import "~@/styles/extends.less";
@import "~@/styles/mixin.less";

/*组件样式*/
.el-header {
  filter: Alpha(opacity=50);
  *zoom: 1;
  background: rgba(0, 0, 0, 0);
}

.el-main {
  filter: Alpha(opacity=50);
  *zoom: 1;
  background: rgba(0, 0, 0, 0);
}

.el-input {
  margin: 0;
  padding: 0;
}

/*组件样式*/
.wid100 {
  &:extend(.wid100);
}

.text-center {
  text-align: center;
}

.logo {
  width: 200px;
  height: 80px;
  border: none;
  border-radius: 0;
}

.login-wrap {
  height: 100%;
}

.login-title {
  font-size: 25px;
  font-weight: 400;
  color: #5995FF;
  padding-bottom: 10px;
}

.loginBanner {
  width: 475px;
  height: 402px;
  position: absolute;
  top: 50%;
  right: 50%;
  margin-left: -237.5px;
  margin-top: -201px;
  background: url('~@/assets/loginBanner.png') no-repeat;
  background-size: 100% 100%;
}

.login-content {
  display: flex;
  position: relative;
  padding: 0;
  min-width: 890px;
  width: 100%;
  height: 100%;
  justify-content: center;
}

.login-content-inner {
  width: 30%;
  .y-flex(center);
  flex-direction: column;
  flex-wrap: wrap;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0 0 10px #D2E1FC;
  padding: 30px;
}

.btns-wrap {
  .el-button--primary {
    &:extend(.wid100);
  }
}

.send-btn {
  &:extend(.wid100);
}

.login-footer {
  .y-flex(center);
  position: absolute;
  bottom: 20px;
}

.left {
  width: 70%;
  background: url("~@/assets/loginBg.jpg") no-repeat;
  background-size:cover;
}

.el-container {
  height: 100%;
}

.demo-ruleForm {
  position: relative;
  padding-top: 15px;
}
</style>
