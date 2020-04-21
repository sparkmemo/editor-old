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

function renderMarkdown() {
  mdOutputEl.innerHTML = marked(mdSourceEl.value, { renderer });
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block);
  });
  // eslint-disable-next-line no-undef
  MathJax.typeset();
  try {
    mermaid.init(undefined, '.mermaid');
  } catch (e) {
    // handling mermaid error
  }
  changeSaved = false;
}

mdSourceEl.addEventListener('keyup', () => {
  renderMarkdown();
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

ipcRenderer.on('openFile', ((event, openInfo) => {
  if (mdSourceEl.value && !changeSaved) {
    ipcRenderer.send('openFileError', 'unsavedChange');
  } else {
    title = openInfo.title;
    path = openInfo.path;
    mdSourceEl.value = openInfo.content;
    changeSaved = true;
    renderMarkdown();
  }
}));
