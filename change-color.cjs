const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

const replacements = [
  { pattern: /#0d9f6e/gi, replacement: '#2563eb' },
  { pattern: /#046c4e/gi, replacement: '#1d4ed8' },
  { pattern: /#34d399/gi, replacement: '#60a5fa' },
  { pattern: /#059669/gi, replacement: '#2563eb' },
  { pattern: /13,\s*159,\s*110/g, replacement: '37, 99, 235' },
  { pattern: /#10b981/gi, replacement: '#3b82f6' },
  { pattern: /16,\s*185,\s*129/g, replacement: '59, 130, 246' },
  // specific to app-f
  { pattern: /var\(--app-green\)/g, replacement: 'var(--app-blue)' },
  { pattern: /var\(--app-green-light\)/g, replacement: 'var(--app-blue-light)' },
];

replacements.forEach(r => {
  css = css.replace(r.pattern, r.replacement);
});

// Also fix variables names if any exist explicitly
css = css.replace(/--app-green:/g, '--app-blue:');
css = css.replace(/--app-green-light:/g, '--app-blue-light:');

fs.writeFileSync(cssPath, css);
console.log('Colors replaced successfully!');
