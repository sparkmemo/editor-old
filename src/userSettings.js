const Store = require('electron-store');

const store = new Store({
  defaults: {
    userSettings: {
      general: {
        displayLang: 'zhCN',
      },
      edit: {
        tabSize: 6,
        customFontFamily: null,
        customFontSize: null,
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
console.log(store.get('userSettings'));

module.exports = {
  store,
};
