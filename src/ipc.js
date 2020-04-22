const os = require('os');
const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog, ipcMain, BrowserWindow } = require('electron');

function notifyInsertMarkdown(window, contentDelta, indexDelta) {
  window.webContents.send('insertMarkdown', contentDelta);
  window.webContents.send('shiftCursor', indexDelta);
}

function insertMarkdown(window, shortcode) {
  switch (shortcode) {
    case 'h1':
      notifyInsertMarkdown(window, '# ', 0);
      break;
    case 'h2':
      notifyInsertMarkdown(window, '## ', 0);
      break;
    case 'h3':
      notifyInsertMarkdown(window, '### ', 0);
      break;
    case 'h4':
      notifyInsertMarkdown(window, '#### ', 0);
      break;
    case 'h5':
      notifyInsertMarkdown(window, '##### ', 0);
      break;
    case 'h6':
      notifyInsertMarkdown(window, '###### ', 0);
      break;
    case 'bold':
      notifyInsertMarkdown(window, '****', -2);
      break;
    case 'italic':
      notifyInsertMarkdown(window, '**', -1);
      break;
    case 'strikethrough':
      notifyInsertMarkdown(window, '~~~~', -2);
      break;
    case 'inline-code':
      notifyInsertMarkdown(window, '``', -1);
      break;
    case 'inline-math':
      notifyInsertMarkdown(window, '\\\\(\\\\)', -3);
      break;
    case 'block-code':
      notifyInsertMarkdown(window, `${os.EOL}\`\`\`${os.EOL}\`\`\``, -4);
      break;
    case 'block-math':
      notifyInsertMarkdown(window, `${os.EOL}$$$$`, -2);
      break;
    case 'link':
      notifyInsertMarkdown(window, '[]()', -3);
      break;
    case 'img':
      notifyInsertMarkdown(window, '![]()', -3);
      break;
    case 'quote':
      notifyInsertMarkdown(window, '> ', 0);
      break;
    case 'ol':
      notifyInsertMarkdown(window, `${os.EOL}1. `, 0);
      break;
    case 'ul':
      notifyInsertMarkdown(window, `${os.EOL}- `, 0);
      break;
    case 'hr':
      notifyInsertMarkdown(window, `${os.EOL}---${os.EOL}${os.EOL}`, 0);
      break;
    default:
      break;
  }
  window.webContents.send('renderMarkdown');
}

function openFile(window) {
  const filePathList = dialog.showOpenDialogSync(window, {
    title: '打开文件',
    filters: [
      {
        name: 'Markdown 文件',
        extensions: ['md'],
      },
    ],
    properties: ['openFile'],
  }) || [];
  if (filePathList.length === 1) {
    const filePath = filePathList[0];
    const fileTitle = path.basename(filePath);
    const fileContent = fs.readFileSync(filePath, {
      encoding: 'utf8',
    });
    window.webContents.send('openFile', {
      path: filePath,
      title: fileTitle,
      content: fileContent,
    }, false);
  }
}

function saveAsFile(window, res) {
  const saveAsPath = dialog.showSaveDialogSync(window, {
    title: '保存文件',
    filters: [
      {
        name: 'Markdown 文件',
        extensions: ['md'],
      },
    ],
  });
  if (saveAsPath) {
    fs.writeFileSync(saveAsPath, res.mdSource, {
      encoding: 'utf8',
    });
    window.webContents.send('updateFile', {
      path: saveAsPath,
      title: path.basename(saveAsPath),
    });
    window.webContents.send('updateTitle');
  }
}

function saveFile(window, res) {
  if (res.path === '') {
    saveAsFile(window, res);
  } else {
    fs.writeFileSync(res.path, res.mdSource, {
      encoding: 'utf8',
    });
    window.webContents.send('updateTitle');
  }
}

ipcMain.on('operationError', ((event, errorInfo) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  let clickedBtnIndex;
  switch (errorInfo.error) {
    case 'unsavedChangeWhenOpenNewDoc':
      // eslint-disable-next-line no-case-declarations
      clickedBtnIndex = dialog.showMessageBoxSync(window, {
        type: 'warning',
        buttons: ['继续打开新文件', '取消打开新文件'],
        title: '警告',
        message: '您尚有未保存的改动',
        detail: '当前操作会丢弃任何未保存的改动且无法恢复，请确认是否继续打开新文件？',
      });
      if (clickedBtnIndex === 0) {
        event.sender.send('openFile', errorInfo.openInfo, true);
      }
      break;
    case 'settingsTabSizeEmpty':
      dialog.showErrorBox('无法保存您的偏好设置', '设置 "编辑 > Tab 键大小" 中的值不应为空。');
      break;
    case 'settingsCustomFontSizeEmpty':
      dialog.showErrorBox('无法保存您的偏好设置', '设置 "编辑 > 字体大小" 中的值不应为空。');
      break;
    case 'settingsPicSavePathEmpty':
      dialog.showErrorBox('无法保存您的偏好设置', '设置 "导出 > 图片转存文件夹" 中的值不应为空。');
      break;
    default:
      break;
  }
}));

ipcMain.on('exportContentRes', (event, res) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  switch (res.next) {
    case 'quitAfterSave':
      if (!res.changeSaved) {
        const clickedBtnIndex = dialog.showMessageBoxSync(window, {
          type: 'warning',
          buttons: ['丢弃改动并退出', '保存并退出', '取消退出'],
          title: '警告',
          message: '您尚有未保存的改动',
          detail: '当前操作会丢弃任何未保存的改动且无法恢复，请确认是否继续退出？',
        });
        switch (clickedBtnIndex) {
          case 0:
            window.destroy();
            break;
          case 1:
            saveFile(window, res);
            window.destroy();
            break;
          default:
            break;
        }
      } else {
        window.destroy();
      }
      break;
    case 'save':
      saveFile(window, res);
      break;
    case 'saveAs':
      saveAsFile(window, res);
      break;
    default:
      break;
  }
});

ipcMain.on('destroySettingsWindow', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window.destroy();
});

module.exports = {
  insertMarkdown,
  openFile,
};
