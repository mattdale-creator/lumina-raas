import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple markdown to HTML converter
function mdToHtml(md) {
  let html = md;
  
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  
  // Horizontal rules / slide breaks
  html = html.replace(/^---$/gm, '<hr>');
  
  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="inline">$1</code>');
  
  // Tables
  html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)*)/gm, (match, header, sep, body) => {
    const headers = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map(row => {
      const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  });
  
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  
  // Checkboxes
  html = html.replace(/- \[x\] (.+)/g, '<div class="checkbox checked">☑ $1</div>');
  html = html.replace(/- \[ \] (.+)/g, '<div class="checkbox">☐ $1</div>');
  
  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  
  // Paragraphs (lines that aren't already wrapped)
  html = html.replace(/^(?!<[huoltbdp]|<\/|<pre|<code|<hr|<li|<div|<ul)(.+)$/gm, '<p>$1</p>');
  
  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  return html;
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #e4e4e7;
    background: #09090b;
    line-height: 1.7;
    font-size: 11pt;
    padding: 48px 56px;
  }
  
  h1 {
    font-size: 28pt;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #ffffff;
    margin: 32px 0 8px 0;
    background: linear-gradient(90deg, #8B5CF6, #C4B5FD);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  h2 {
    font-size: 18pt;
    font-weight: 700;
    color: #ffffff;
    margin: 28px 0 12px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid #27272a;
    letter-spacing: -0.02em;
  }
  
  h3 {
    font-size: 13pt;
    font-weight: 600;
    color: #a78bfa;
    margin: 20px 0 8px 0;
  }
  
  p {
    margin: 8px 0;
    color: #a1a1aa;
  }
  
  strong { color: #e4e4e7; }
  
  hr {
    border: none;
    border-top: 1px solid #27272a;
    margin: 24px 0;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 9.5pt;
  }
  
  th {
    background: #18181b;
    color: #a78bfa;
    font-weight: 600;
    text-align: left;
    padding: 10px 12px;
    border: 1px solid #27272a;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  td {
    padding: 8px 12px;
    border: 1px solid #27272a;
    color: #a1a1aa;
  }
  
  tr:nth-child(even) { background: #0f0f12; }
  
  ul, ol {
    margin: 8px 0 8px 20px;
    color: #a1a1aa;
  }
  
  li {
    margin: 4px 0;
    padding-left: 4px;
  }
  
  li::marker { color: #8B5CF6; }
  
  blockquote {
    border-left: 3px solid #8B5CF6;
    padding: 12px 20px;
    margin: 16px 0;
    background: #18181b;
    border-radius: 0 8px 8px 0;
    color: #d4d4d8;
    font-style: italic;
  }
  
  pre {
    background: #18181b;
    border: 1px solid #27272a;
    border-radius: 8px;
    padding: 16px;
    margin: 12px 0;
    overflow-x: auto;
    font-size: 9pt;
  }
  
  code {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    color: #a78bfa;
  }
  
  code.inline {
    background: #18181b;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 9.5pt;
    border: 1px solid #27272a;
  }
  
  .checkbox {
    padding: 4px 0;
    color: #a1a1aa;
  }
  
  .checkbox.checked { color: #10b981; }
  
  /* Page header */
  .page-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 2px solid #8B5CF6;
  }
  
  .logo {
    width: 36px;
    height: 36px;
    background: #8B5CF6;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
    font-size: 18pt;
  }
  
  .brand {
    font-size: 14pt;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.02em;
  }
  
  .brand-sub {
    font-size: 9pt;
    color: #71717a;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  
  /* Footer */
  .page-footer {
    margin-top: 40px;
    padding-top: 16px;
    border-top: 1px solid #27272a;
    display: flex;
    justify-content: space-between;
    font-size: 8pt;
    color: #52525b;
  }
  
  @media print {
    body { padding: 0; }
    @page { margin: 48px 56px; size: A4; }
  }
`;

function wrapInHtml(title, content, subtitle) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>${css}</style>
</head>
<body>
  <div class="page-header">
    <div class="logo">L</div>
    <div>
      <div class="brand">Lumina RaaS</div>
      <div class="brand-sub">Results-as-a-Service</div>
    </div>
  </div>
  ${content}
  <div class="page-footer">
    <span>© 2026 Lumina RaaS — Confidential</span>
    <span>Perth, Australia</span>
  </div>
</body>
</html>`;
}

// Process each file
const docs = [
  'PITCH_DECK.md',
  'CUSTOMER_VALIDATION_SURVEY.md',
  'SALES_PLAYBOOK.md',
  'COMPETITOR_ANALYSIS.md',
  'GTM_EXECUTION_PLAN.md',
  'PRD_KNOWLEDGE_BASE.md'
];

for (const doc of docs) {
  const mdPath = path.join(__dirname, doc);
  const htmlPath = path.join(__dirname, doc.replace('.md', '.html'));
  
  if (!fs.existsSync(mdPath)) {
    console.log(`Skipping ${doc} - not found`);
    continue;
  }
  
  const md = fs.readFileSync(mdPath, 'utf-8');
  const htmlContent = mdToHtml(md);
  const fullHtml = wrapInHtml(doc, htmlContent);
  
  fs.writeFileSync(htmlPath, fullHtml);
  console.log(`Created: ${htmlPath}`);
}

console.log('\\nAll HTML files generated! Open each in browser to print as PDF.');
