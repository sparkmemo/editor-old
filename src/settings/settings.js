// eslint-disable-next-line
new Vue({
  el: '#app',
  // eslint-disable-next-line
  vuetify: new Vuetify(),
  data() {
    return {
      tab: null,
      tabs: ['通用', '语言'],
      displayLang: ['中文简体'],
      picProcess: ['复制到 .assets 文件夹', '复制到以下特定位置'],
    };
  },
});
