// eslint-disable-next-line import/no-extraneous-dependencies
const { shell, BrowserWindow } = require('electron');
const path = require('path');

function createSettingWindow(parentWindow) {
  const setting = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    parent: parentWindow,
    modal: true,
  });

  // and load the index.html of the app.
  setting.loadFile(path.join('src', 'settings', 'settings.html'));
  // setting.setMenu(null);

  setting.webContents.openDevTools();
}

module.exports = [
  {
    label: 'File',
    submenu: [
      {
        role: 'quit',
      },
      {
        label: 'Settings',
        accelerator: 'CmdOrCtrl+,',
        click(menuItem, parentWindow) {
          createSettingWindow(parentWindow);
        },
      },
    ],
  },
  {
    role: 'editMenu',
  },
  {
    role: 'viewMenu',
  },
  {
    role: 'windowMenu',
  },
];
