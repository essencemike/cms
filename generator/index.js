const fs = require('fs');
const Path = require('path');

function deleteFile(path) {
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    } else {
      console.log('文件不存在: ', path);
    }
  } catch(e) {
    console.log('删除文件发生错误: ', e);
  }
}

function deleteFolder(path) {
  try {
    if (fs.existsSync(path)) {
      const delFn = (address) => {
        const files = fs.readdirSync(address);
        for (let i = 0; i < files.length; i++) {
          const dirPath = Path.join(address, files[i]);

          if (fs.statSync(dirPath).isDirectory()) {
            delFn(dirPath);
          } else {
            deleteFile(dirPath);
          }
        }

        fs.rmdirSync(address);
      };

      delFn(path);
    } else {
      console.log('不存在该文件夹: ', path);
    }
  } catch (error) {
    console.log('删除文件夹发生错误: ', error);
  }
}

// deleteFile('/Users/imike/code/github/vue-cli-plugin-cms/example/my-app/src/router/index.ts');

module.exports = (api, options = {}) => {
  api.extendPackage({
    dependencies: {
      'axios': '^0.19.0',
      'element-ui': '2.7.2',
      'font-awesome': '^4.7.0',
      'js-cookie': '^2.2.0',
      'lodash': '^4.17.11',
      'moment': '^2.24.0',
      'normalize.css': '^8.0.1',
      'nprogress': '^0.2.0',
      'vue-i18n': '^8.11.2',
      'vuex-class': '^0.3.2'
    },
    devDependencies: {
      '@types/js-cookie': '^2.2.2',
      '@types/lodash': '^4.14.134',
      '@types/nprogress': '^0.2.0',
      'copy-webpack-plugin': '^5.0.3',
      'pug': '^2.0.4',
      'pug-plain-loader': '^1.0.0',
      "ts-jest": "^23.0.0",
    }
  });

  api.render('./template');

  api.onCreateComplete(() => {
    // 删除 router 文件， 以及文件夹
    deleteFile(api.resolve('./src/router/index.ts'));
    deleteFolder(api.resolve('./src/router'));
    // 删除 HelloWorld.vue 组件
    deleteFile(api.resolve('./src/components/HelloWorld.vue'));
    // 删除 views 中 About.vue 以及 Home.vue 页面
    deleteFile(api.resolve('./src/views/Home.vue'));
    deleteFile(api.resolve('./src/views/About.vue'));
    // 删除 shims 等 ts 声明文件
    deleteFile(api.resolve('./src/shims-vue.d.ts'));
    deleteFile(api.resolve('./src/shims-tsx.d.ts'));
  });
};
