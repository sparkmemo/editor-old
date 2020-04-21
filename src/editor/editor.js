const marked = require('marked');
const hljs = require('highlight.js');
const mermaid = require('mermaid/dist/mermaid.js');
require('./mathjax-config.js');
require('mathjax/es5/tex-svg.js');
// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');

const mdSourceEl = document.getElementById('mdSource');
const mdOutputEl = document.getElementById('mdOutput');

let title = 'Untitled.md';
let path = '';
let changeSaved = true;

const renderer = new marked.Renderer();
renderer.code = (code, language) => {
  if ((code.match(/^sequenceDiagram/) || code.match(/^graph/)) && language.match(/mermaid/)) {
    return `<div class="mermaid">${code}</div>`;
  }

  return `<pre><code>${code}</code></pre>`;
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
  if (e === null || !(e.key === 'Control' || e.key === 'Shift' || e.ctrlKey === true || e.shiftKey === true)) {
    changeSaved = false;
  }
  updateTitle();
}

updateTitle();

mdSourceEl.addEventListener('keypress', (event) => {
  renderMarkdown(event);
});

ipcRenderer.on('insertMarkdown', ((event, insertContent) => {
  mdSourceEl.focus();
  const prevSelectStart = mdSourceEl.selectionStart;
  mdSourceEl.value = `${mdSourceEl.value.substring(0, prevSelectStart)}${insertContent}${mdSourceEl.value.substring(prevSelectStart)}`;
  mdSourceEl.selectionStart = prevSelectStart + insertContent.length;
  mdSourceEl.selectionEnd = prevSelectStart + insertContent.length;
}));

ipcRenderer.on('shiftCursor', ((event, indexDelta) => {
  mdSourceEl.focus();
  const prevSelectStart = mdSourceEl.selectionStart;
  const prevSelectEnd = mdSourceEl.selectionEnd;
  mdSourceEl.setSelectionRange(prevSelectStart + indexDelta, prevSelectEnd + indexDelta);
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
  renderMarkdown(null);
});
