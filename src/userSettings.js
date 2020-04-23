const Store = require('electron-store');

const store = new Store({
  defaults: {
    userSettings: {
      general: {
        displayLang: 'zhCN',
      },
      edit: {
        tabSize: 4,
        customFontFamily: null,
        customFontSize: 16,
      },
      render: {
        markdownTheme: 'github',
        codeHighlightTheme: 'github',
        customCSS: null,
      },
      export: {
        picProcess: 'keepOldPath',
        picSavePath: null,
      },
    },
  },
});

// store.reset('userSettings');
// console.log(store.get('userSettings'));

module.exports = {
  store,
};
