const marked = require('marked');
const hljs = require('highlight.js');
const mermaid = require('../node_modules/mermaid/dist/mermaid.js');
require('./mathjax-config.js');
require('../node_modules/mathjax/es5/tex-svg.js');

const mdSourceEl = document.getElementById('mdSource');
const mdOutputEl = document.getElementById('mdOutput');

const renderer = new marked.Renderer();
renderer.code = function (code, language) {
  if ((code.match(/^sequenceDiagram/) || code.match(/^graph/)) && language.match(/mermaid/)) {
    return `<div class="mermaid">${code}</div>`;
  }

  return `<pre><code>${code}</code></pre>`;
};

mermaid.initialize({ startOnLoad: false, theme: 'forest' });
mdSourceEl.addEventListener('keyup', () => {
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
});
