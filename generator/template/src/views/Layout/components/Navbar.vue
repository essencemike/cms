<template lang="pug">
.app-navbar
  // eui-hamburger.hamburger-container(:isActive="sidebar.opened", @icon-click="toggleSidebar")
  logo
  eui-breadcrumb.breadcrumb-container
  .right-navbar
    .avator
    el-dropdown.user-container(trigger="click", @command="handleUserOperate")
      span.el-dropdown-link
        | {{ username || 'admin@qq.com' }}
        i.el-icon-caret-bottom
      el-dropdown-menu(slot="dropdown")
        //- el-dropdown-item(command="editPass") {{ $t('app.editPass') }}
        el-dropdown-item(command="logout") {{ $t('app.logout') }}
  el-dialog(
    title="设置新密码",
    :visible.sync="editPassVisible",
    width="30%",
    center,
    append-to-body,
    :close-on-click-modal="false",
  )
    el-form(:model="passForm", :rules="passRules", ref="passForm")
      el-form-item(prop="newPassword")
        el-input(
          name="newPassword",
          type="password",
          v-model="passForm.newPassword",
          minlength="6",
          maxlength="20",
          placeholder="6-20位数字和字母的组合",
        )
      el-form-item(prop="checkPass")
        el-input(
          name="checkPass",
          type="password",
          v-model="passForm.checkPass",
          minlength="6",
          maxlength="20",
          placeholder="再次输入设置的新密码",
        )
    span.dialog-footer(slot="footer")
      el-button(@click="handleEditPass", type="primary") 完成
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';
import { TOGGLE_SIDEBAR } from '@/constants';
import { Form } from 'element-ui';
import { removeToken, getUser, removeLocalStorage } from '@/utils';
import Logo from './Logo.vue';

@Component({
  components: {
    Logo,
  },
})
export default class Navbar extends Vue {
  @Getter('sidebar') sidebar: any;
  username: string = '';
  userCode: string = '';

  @Action(TOGGLE_SIDEBAR) TOGGLE_SIDEBAR: any;

  editPassVisible: boolean = false;

  passForm: any = {
    newPassword: '',
    checkPass: '',
  };

  passRules: any = {
    newPassword: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '请输入6-20个字符', trigger: 'blur' },
      {
        pattern: /^[0-9a-zA-Z]+$/,
        message: '密码格式不正确',
        trigger: 'blur',
      },
    ],
    checkPass: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '请输入6-20个字符', trigger: 'blur' },
      {
        pattern: /^[0-9a-zA-Z]+$/,
        message: '密码格式不正确',
        trigger: 'blur',
      },
      { validator: this.validateCheckPass, trigger: 'blur' },
    ],
  };

  userCommands: any = {
    editPass() {
      this.handleOpen();
    },
    logout() {
      // TODO 清除token
      this.$api.global.logout().then(() => {
        removeToken();
        this.$router.push({ path: '/login' });
      });
    },
  };

  validateCheckPass(rule: any, value: string, callback: any) {
    if (value !== this.passForm.newPassword) {
      callback(new Error('两次输入密码不一致'));
    }

    return callback();
  }

  mounted() {
    const user = getUser();
    this.username = user.username || user.telephone;
    this.userCode = user.userCode || '';
  }

  toggleSidebar() {
    this.TOGGLE_SIDEBAR();
  }

  handleOpen() {
    this.passForm = {
      newPassword: '',
      checkPass: '',
    };
    this.editPassVisible = true;
  }

  handleUserOperate(command: string) {
    this.userCommands[command].call(this);
  }

  handleEditPass() {
    (this.$refs.passForm as Form).validate(async (valid) => {
      if (valid) {
        try {
          await this.$api.global.editPass(this.passForm);
          this.$message.success('密码修改成功！');
          this.editPassVisible = false;
          removeLocalStorage('userInfo');
          this.userCommands.logout.call(this);
        } catch (error) {}
      }
    });
  }
}
</script>
<style lang="less" scoped>
.app-navbar {
  position: relative;
  display: flex;
  height: 100%;
  align-items: center;

  .right-navbar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    padding-right: 20px;
  }

  .avator {
    width: 32px;
    height: 32px;
    background: url('~@/assets/avator.png');
    background-repeat: no-repeat;
    background-size: cover;
  }

  .lang-container,
  .user-container {
    margin-left: 20px;
  }

  .el-dropdown-link {
    cursor: pointer;
  }
}
</style>
