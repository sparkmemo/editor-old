const fs = require('fs');
const path = require('path');

let codeTheme = fs.readdirSync('node_modules/highlight.js/styles');
codeTheme = codeTheme.filter((item) => item.match(/.css/));
codeTheme = codeTheme.map((item) => path.basename(item, '.css'));
// console.log(codeTheme);

module.exports = {
  settingsOption: {
    tab: ['通用', '编辑', '渲染', '导出'],
    settings: {
      general: {
        displayLang: [
          {
            text: '简体中文',
            value: 'zhCN',
          },
        ],
      },
      render: {
        markdownTheme: ['github'],
        codeHighlightTheme: codeTheme,
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
      },
    },
  },
};
