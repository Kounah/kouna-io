const hljs              = require('highlightjs');
const markdownIt        = require('markdown-it');
const {markdownItTable} = require('markdown-it-table');
const markdownItKatex   = require('markdown-it-katex');

const md = markdownIt({
  html: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) { console.log(err) }
    }
    return '';
  }
});

md.use(markdownItTable);
// md.use(markdownItKatex);

module.exports = md;
