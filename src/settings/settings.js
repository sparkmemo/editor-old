const { dialog } = require('electron').remote;

// eslint-disable-next-line
new Vue({
  el: '#app',
  // eslint-disable-next-line
  vuetify: new Vuetify({}),
  data() {
    return {
      tab: null,
      tabs: ['通用', '编辑', '渲染', '导出'],
      settings: {
        general: {
          displayLang: ['简体中文'],
        },
        edit: {
          tabSize: '4',
          customFontFamily: null,
          customFontSize: null,
        },
        render: {
          markdownTheme: ['Github'],
          codeHighlightTheme: ['Github'],
          customCSS: null,
        },
        export: {
          picProcess: [
            {
              text: '保留原有路径',
              value: 'keepOldPath',
            },
            {
              text: '复制到以下特定位置',
              value: 'copyToPath',
            },
          ],
          picSavePath: null,
        },
      },
      userSettings: {
        general: {
          displayLang: null,
        },
        edit: {
          tabSize: null,
          customFontFamily: null,
          customFontSize: null,
        },
        render: {
          markdownTheme: null,
          codeHighlightTheme: null,
          customCSS: null,
        },
        export: {
          picProcess: null,
          picSavePath: null,
        },
      },
    };
  },
  methods: {
    choosePicSavePath() {
      const pathList = dialog.showOpenDialogSync({
        title: '图片转存路径',
        defaultPath: this.userSettings.export.picSavePath || '',
        properties: ['openDirectory'],
      });
      if (pathList !== undefined) {
        this.userSettings.export.picSavePath = pathList[0];
      }
    },
  },
});
