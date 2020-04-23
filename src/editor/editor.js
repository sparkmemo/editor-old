const marked = require('marked');
const hljs = require('highlight.js');
const mermaid = require('mermaid/dist/mermaid.js');
require('../mathjax-config.js');
require('mathjax/es5/tex-svg.js');
// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const url = require('url');
const os = require('os');
const { store } = require('../userSettings.js');

const mdSourceEl = document.getElementById('mdSource');
const mdOutputEl = document.getElementById('mdOutput');
const codeThemeEl = document.getElementById('codeTheme');
const customCSSEL = document.getElementById('customCSS');

let title = 'Untitled.md';
let path = '';
let changeSaved = true;

let userSettings = store.get('userSettings');

function escapeHTML(raw) {
  const safe = raw.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  return safe;
}

const renderer = new marked.Renderer();
renderer.code = (code, language) => {
  if ((code.match(/^sequenceDiagram/) || code.match(/^graph/)) && language.match(/mermaid/)) {
    return `<div class="mermaid">${code}</div>`;
  }
  return `<pre><code class="language-${language}">${escapeHTML(code)}</code></pre>`;
};

mermaid.initialize({ startOnLoad: false, theme: 'forest' });

function updateTitle() {
  document.title = `SparkMEMO Editor - ${title}${changeSaved ? '' : '*'}`;
}

function renderMarkdown(e) {
  mdOutputEl.innerHTML = marked(mdSourceEl.value, { renderer });
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block);
  });
  // eslint-disable-next-line no-undef
  MathJax.typeset();
  try {
    mermaid.init(undefined, '.mermaid');
  } catch (err) {
    // handling mermaid error
  }
  if (e === undefined || !(e.key === 'Control' || e.key === 'Shift' || e.ctrlKey === true || e.shiftKey === true)) {
    changeSaved = false;
  }
  updateTitle();
}

updateTitle();

// mdSourceEl.addEventListener('keydown', (event) => {
//   renderMarkdown(event);
// });

function insertMarkdown(insertContent) {
  mdSourceEl.focus();
  const prevSelectStart = mdSourceEl.selectionStart;
  mdSourceEl.value = `${mdSourceEl.value.substring(0, prevSelectStart)}${insertContent}${mdSourceEl.value.substring(prevSelectStart)}`;
  mdSourceEl.selectionStart = prevSelectStart + insertContent.length;
  mdSourceEl.selectionEnd = prevSelectStart + insertContent.length;
}

function shiftCursor(indexDelta) {
  mdSourceEl.focus();
  const prevSelectStart = mdSourceEl.selectionStart;
  const prevSelectEnd = mdSourceEl.selectionEnd;
  mdSourceEl.setSelectionRange(prevSelectStart + indexDelta, prevSelectEnd + indexDelta);
}

mdSourceEl.addEventListener('keyup', (event) => {
  if (event.key === 'Tab') {
    for (let i = 0; i < parseInt(userSettings.edit.tabSize, 10); i += 1) {
      insertMarkdown(' ');
    }
  }
  renderMarkdown(event);
});

mdSourceEl.addEventListener('drop', (event) => {
  event.preventDefault();
  // eslint-disable-next-line
  for (let file of event.dataTransfer.files) {
    const fileURL = url.pathToFileURL(file.path).href;
    insertMarkdown(`${os.EOL}![](${fileURL})${os.EOL}`);
    renderMarkdown();
  }
});

function loadUserSettings() {
  const codeThemeURL = `../../node_modules/highlight.js/styles/${userSettings.render.codeHighlightTheme}.css`;
  codeThemeEl.setAttribute('href', codeThemeURL);
  if (userSettings.edit.customFontFamily) {
    mdSourceEl.style.fontFamily = userSettings.edit.customFontFamily;
  } else {
    mdSourceEl.style.fontFamily = '';
  }
  if (userSettings.edit.customFontSize) {
    mdSourceEl.style.fontSize = `${userSettings.edit.customFontSize}px`;
  } else {
    mdSourceEl.style.fontSize = '';
  }
  if (userSettings.render.customCSS) {
    customCSSEL.setAttribute('href', userSettings.render.customCSS);
  } else {
    customCSSEL.setAttribute('href', '');
  }
}

loadUserSettings();

ipcRenderer.on('insertMarkdown', ((event, insertContent) => {
  insertMarkdown(insertContent);
}));

ipcRenderer.on('shiftCursor', ((event, indexDelta) => {
  shiftCursor(indexDelta);
}));

ipcRenderer.on('openFile', ((event, openInfo, override) => {
  if (!changeSaved && override === false) {
    ipcRenderer.send('operationError', {
      error: 'unsavedChangeWhenOpenNewDoc',
      openInfo,
    });
  } else {
    title = openInfo.title;
    path = openInfo.path;
    mdSourceEl.value = openInfo.content;
    renderMarkdown();
    changeSaved = true;
    updateTitle();
  }
}));

ipcRenderer.on('exportContentReq', (event, next) => {
  ipcRenderer.send('exportContentRes', {
    title,
    path,
    changeSaved,
    mdSource: mdSourceEl.value,
    mdOutput: marked(mdSourceEl.value, { renderer }),
    settings: {
      codeThemeLink: codeThemeEl.getAttribute('href'),
      customCSSLink: customCSSEL.getAttribute('href'),
    },
    next,
  });
});

ipcRenderer.on('updateFile', (event, updatedFileInfo) => {
  title = updatedFileInfo.title;
  path = updatedFileInfo.path;
});

ipcRenderer.on('updateTitle', (e) => {
  changeSaved = true;
  console.log(e, changeSaved);
  updateTitle();
});

ipcRenderer.on('renderMarkdown', () => {
  renderMarkdown();
});

ipcRenderer.on('updateSettings', ()=> {
  userSettings = store.get('userSettings');
  loadUserSettings();
});
