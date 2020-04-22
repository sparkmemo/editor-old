// eslint-disable-next-line import/no-extraneous-dependencies
const { shell } = require('electron');
const { insertMarkdown, openFile } = require('./ipc.js');

module.exports = [
  {
    label: '文件',
    submenu: [
      {
        label: '打开',
        accelerator: 'CmdOrCtrl+o',
        click(menuItem, window) {
          openFile(window);
        },
      },
      {
        label: '保存',
        accelerator: 'CmdOrCtrl+s',
        click(menuItem, window) {
          window.webContents.send('exportContentReq', 'save');
        },
      },
      {
        label: '另存为',
        accelerator: 'CmdOrCtrl+shift+s',
        click(menuItem, window) {
          window.webContents.send('exportContentReq', 'saveAs');
        },
      },
      {
        type: 'separator',
      },
      {
        label: '导出',
        submenu: [
          {
            label: '导出至 HTML',
          },
          {
            label: '导出至 PDF',
          },
        ],
      },
      {
        type: 'separator',
      },
      {
        label: '设置',
        accelerator: 'CmdOrCtrl+,',
        click(menuIte, parentWindow) {
          // eslint-disable-next-line global-require
          require('./window.js').createSettingsWindow(parentWindow);
        },
      },
      {
        type: 'separator',
      },
      {
        role: 'quit',
        label: '退出',
        accelerator: 'CmdOrCtrl+q',
      },
    ],
  },
  {
    label: '编辑',
    submenu: [
      {
        label: '撤销',
        role: 'undo',
      },
      {
        label: '重做',
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        label: '剪切',
        role: 'cut',
      },
      {
        label: '复制',
        role: 'copy',
      },
      {
        label: '粘贴',
        role: 'paste',
      },
      {
        label: '删除',
        role: 'delete',
      },
      {
        type: 'separator',
      },
      {
        label: '全选',
        role: 'selectAll',
      },
    ],
  },
  {
    label: '插入',
    submenu: [
      {
        label: '标题',
        submenu: [
          {
            label: '一级标题',
            accelerator: 'Alt+1',
            click(menuItem, parentWindow) {
              insertMarkdown(parentWindow, 'h1');
            },
          },
          {
            label: '二级标题',
            accelerator: 'Alt+2',
            click(menuItem, parentWindow) {
              insertMarkdown(parentWindow, 'h2');
            },
          },
          {
            label: '三级标题',
            accelerator: 'Alt+3',
            click(menuItem, parentWindow) {
              insertMarkdown(parentWindow, 'h3');
            },
          },
          {
            label: '四级标题',
            accelerator: 'Alt+4',
            click(menuItem, parentWindow) {
              insertMarkdown(parentWindow, 'h4');
            },
          },
          {
            label: '五级标题',
            accelerator: 'Alt+5',
            click(menuItem, parentWindow) {
              insertMarkdown(parentWindow, 'h5');
            },
          },
          {
            label: '六级标题',
            accelerator: 'Alt+6',
            click(menuItem, parentWindow) {
              insertMarkdown(parentWindow, 'h6');
            },
          },
        ],
      },
      {
        label: '格式',
        submenu: [
          {
            label: '加粗',
            accelerator: 'Alt+b',
            click(menuItem, parentWindow) {
              insertMarkdown(parentWindow, 'bold');
            },
          },
          {
            label: '斜体',
            accelerator: 'Alt+i',
            click(menuItem, parentWindow) {
              insertMarkdown(parentWindow, 'italic');
            },
          },
          {
            label: '删除线',
            accelerator: 'Alt+d',
            click(menuItem, parentWindow) {
              insertMarkdown(parentWindow, 'strikethrough');
            },
          },
        ],
      },
      {
        type: 'separator',
      },
      {
        label: '行内代码',
        accelerator: 'Alt+c',
        click(menuItem, parentWindow) {
          insertMarkdown(parentWindow, 'inline-code');
        },
      },
      {
        label: '行内公式',
        accelerator: 'Alt+m',
        click(menuItem, parentWindow) {
          insertMarkdown(parentWindow, 'inline-math');
        },
      },
      {
        type: 'separator',
      },
      {
        label: '代码块',
        accelerator: 'CmdOrCtrl+Alt+c',
        click(menuItem, parentWindow) {
          insertMarkdown(parentWindow, 'block-code');
        },
      },
      {
        label: '公式块',
        accelerator: 'CmdOrCtrl+Alt+m',
        click(menuItem, parentWindow) {
          insertMarkdown(parentWindow, 'block-math');
        },
      },
      {
        type: 'separator',
      },
      {
        label: '超链接',
        accelerator: 'Alt+l',
        click(menuItem, parentWindow) {
          insertMarkdown(parentWindow, 'link');
        },
      },
      {
        label: '图片',
        accelerator: 'Alt+p',
        click(menuItem, parentWindow) {
          insertMarkdown(parentWindow, 'img');
        },
      },
      {
        label: '引用',
        accelerator: 'Alt+q',
        click(menuItem, parentWindow) {
          insertMarkdown(parentWindow, 'quote');
        },
      },
      {
        type: 'separator',
      },
      {
        label: '有序列表',
        accelerator: 'Alt+o',
        click(menuItem, parentWindow) {
          insertMarkdown(parentWindow, 'ol');
        },
      },
      {
        label: '无序列表',
        accelerator: 'Alt+u',
        click(menuItem, parentWindow) {
          insertMarkdown(parentWindow, 'ul');
        },
      },
      {
        type: 'separator',
      },
      {
        label: '水平分割线',
        accelerator: 'Alt+h',
        click(menuItem, parentWindow) {
          insertMarkdown(parentWindow, 'hr');
        },
      },
    ],
  },
  {
    label: '查看',
    submenu: [
      {
        label: '重新加载',
        role: 'reload',
      },
      {
        label: '开发者工具',
        role: 'toggleDevTools',
      },
      {
        type: 'separator',
      },
      {
        label: '重置缩放',
        role: 'resetZoom',
      },
      {
        label: '放大',
        role: 'zoomIn',
        accelerator: 'CmdOrCtrl+=',
      },
      {
        label: '缩小',
        role: 'zoomOut',
        accelerator: 'CmdOrCtrl+-',
      },
    ],
  },
  {
    label: '窗口',
    submenu: [
      {
        label: '最小化',
        role: 'minimize',
      },
      {
        label: '切换全屏',
        role: 'togglefullscreen',
      },
    ],
  },
  {
    label: '帮助',
    submenu: [
      {
        label: '关于',
        click() {
          shell.openExternal('https://sparkmemo.com/editor');
        },
      },
      {
        label: '检查更新',
        click() {
          shell.openExternal('https://github.com/sparkmemo/editor');
        },
      },
    ],
  },
];
