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
    win.webContents.openDevTools();
    const menu = Menu.buildFromTemplate(MenuTemplate);
    Menu.setApplicationMenu(menu);

    win.on('close', ((event) => {
      event.preventDefault();
      win.webContents.send('exportContentReq', 'quitAfterSave');
    }));
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
    settings.on('close', (event) => {
      event.preventDefault();
      settings.webContents.send('saveSettingsOnQuit');
    });
  },
  createHiddenPDFWindow(parentWindow) {
    parentWindow.webContents.send('exportContentReq', 'exportPDF');
  },
};
