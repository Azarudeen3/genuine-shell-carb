const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

const replacements = [
  { pattern: /#2563eb/gi, replacement: '#0d9f6e' },
  { pattern: /#1d4ed8/gi, replacement: '#046c4e' },
  { pattern: /#60a5fa/gi, replacement: '#34d399' },
  { pattern: /37,\s*99,\s*235/g, replacement: '13, 159, 110' },
  { pattern: /#3b82f6/gi, replacement: '#10b981' },
  { pattern: /59,\s*130,\s*246/g, replacement: '16, 185, 129' },
  { pattern: /var\(--app-blue\)/g, replacement: 'var(--app-green)' },
  { pattern: /var\(--app-blue-light\)/g, replacement: 'var(--app-green-light)' },
];

replacements.forEach(r => {
  css = css.replace(r.pattern, r.replacement);
});

css = css.replace(/--app-blue:/g, '--app-green:');
css = css.replace(/--app-blue-light:/g, '--app-green-light:');

fs.writeFileSync(cssPath, css);
console.log('Colors reverted successfully!');
