// eslint-disable-next-line import/no-extraneous-dependencies
const { BrowserWindow, Menu } = require('electron');
const path = require('path');
const MenuTemplate = require('./menu.js');

module.exports = {
  createEditorWindow() {
    const win = new BrowserWindow({
      width: 1280,
      height: 720,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    win.loadFile(path.join('src', 'editor', 'editor.html'));

    const menu = Menu.buildFromTemplate(MenuTemplate);
    Menu.setApplicationMenu(menu);
  },
  createSettingsWindow(parentWindow) {
    const settings = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
      parent: parentWindow,
      modal: true,
      autoHideMenuBar: true,
      title: 'SparkMEMO Editor 设置',
    });
    settings.loadFile(path.join('src', 'settings', 'settings.html'));
    settings.webContents.openDevTools();
  },
};
