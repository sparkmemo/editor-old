const os = require('os');
const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { dialog, ipcMain } = require('electron');

function notifyInsertMarkdown(window, contentDelta, indexDelta) {
  window.webContents.send('insertMarkdown', contentDelta);
  window.webContents.send('shiftCursor', indexDelta);
}

function insertMarkdown(window, shortcode) {
  // eslint-disable-next-line default-case
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
  }
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
    });
  }
}

ipcMain.on('openFileError', ((event, errorType) => {
  switch (errorType) {
    case 'unsavedChange':
      dialog.showErrorBox('警告', '您有未保存的变动。');
      break;
    default:
      break;
  }
}));

module.exports = {
  insertMarkdown,
  openFile,
};
