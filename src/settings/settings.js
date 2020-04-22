// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog } = require('electron').remote;
// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const { settingsOption } = require('../settingsOption.js');
const { store } = require('../userSettings.js');

// eslint-disable-next-line
const vm = new Vue({
  el: '#app',
  // eslint-disable-next-line
  vuetify: new Vuetify({}),
  created() {
    this.userSettings = store.get('userSettings');
  },
  data: {
    tab: null,
    tabs: settingsOption.tab,
    settings: settingsOption.settings,
    userSettings: {},
  },
  methods: {
    choosePicSavePath() {
      const pathList = dialog.showOpenDialogSync({
        title: '选择图片转存路径',
        defaultPath: this.userSettings.export.picSavePath || '',
        properties: ['openDirectory'],
      });
      if (pathList !== undefined) {
        this.userSettings.export.picSavePath = pathList[0];
      }
    },
    chooseCustomCSSPath() {
      const pathList = dialog.showOpenDialogSync({
        title: '选择自定义 CSS 样式表路径',
        defaultPath: this.userSettings.render.customCSS || '',
        properties: ['openFile'],
        filters: [
          {
            name: 'CSS 样式表',
            extensions: ['css'],
          },
        ],
      });
      if (pathList !== undefined) {
        this.userSettings.render.customCSS = pathList[0];
      }
    },
  },
});

function validateSettings() {
  const userSettings = vm.$data.userSettings;
  // eslint-disable-next-line no-restricted-globals
  if (userSettings.edit.tabSize === '') {
    ipcRenderer.send('operationError', {
      error: 'settingsTabSizeEmpty',
    });
    return false;
  }
  if (userSettings.edit.customFontSize === '') {
    ipcRenderer.send('operationError', {
      error: 'settingsCustomFontSizeEmpty',
    });
    return false;
  }
  if (userSettings.export.picProcess === 'copyToPath' && userSettings.export.picSavePath === null) {
    ipcRenderer.send('operationError', {
      error: 'settingsPicSavePathEmpty',
    });
    return false;
  }
  return true;
}

ipcRenderer.on('saveSettingsOnQuit', () => {
  const valid = validateSettings();
  if (valid) {
    store.set('userSettings', vm.$data.userSettings);
    ipcRenderer.send('destroySettingsWindow');
  }
});
