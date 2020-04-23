const hljs = require('highlight.js');
const mermaid = require('mermaid/dist/mermaid.js');
require('../mathjax-config.js');
require('mathjax/es5/tex-svg.js');

hljs.initHighlightingOnLoad();
mermaid.initialize({ startOnLoad: false, theme: 'forest' });
