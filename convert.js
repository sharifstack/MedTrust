const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'screens');

function convertHtmlToJsx(html) {
  const mainTagMatch = html.match(/(<main[^>]*>)/);
  const mainTag = mainTagMatch ? mainTagMatch[1] : '<main className="pt-24 pb-20 px-md md:px-lg max-w-container-max mx-auto">';
  const match = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (!match) return '';
  let content = mainTag + match[1] + '</main>';
  
  content = content.replace(/class=/g, 'className=');
  content = content.replace(/for=/g, 'htmlFor=');
  content = content.replace(/tabindex=/g, 'tabIndex=');
  content = content.replace(/checked=""/g, 'defaultChecked');
  content = content.replace(/selected=""/g, 'defaultValue');
  
  content = content.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
  content = content.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
  content = content.replace(/<hr([^>]*[^\/])>/g, '<hr$1 />');
  content = content.replace(/<br([^>]*[^\/])>/g, '<br$1 />');
  
  content = content.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
  
  content = content.replace(/style="([^"]*)"/g, (match, styleString) => {
    const rules = styleString.split(';').filter(Boolean);
    const obj = {};
    for (const rule of rules) {
      const parts = rule.split(':');
      if (parts.length < 2) continue;
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim();
      if (!key || !val) continue;
      const camelKey = key.startsWith('--') ? key : key.replace(/-([a-z])/g, g => g[1].toUpperCase());
      obj[camelKey] = val;
    }
    return `style={${JSON.stringify(obj)}}`;
  });
  
  content = content.replace(/stroke-width/g, 'strokeWidth');
  content = content.replace(/stroke-linecap/g, 'strokeLinecap');
  content = content.replace(/stroke-linejoin/g, 'strokeLinejoin');
  content = content.replace(/fill-rule/g, 'fillRule');
  content = content.replace(/clip-rule/g, 'clipRule');
  
  content = content.replace(/&(?!(amp|lt|gt|quot|#39|#x27|nbsp);)/g, '&amp;');

  return content;
}

const pages = {
  'dashboard.html': 'app/page.tsx',
  'search.html': 'app/search/page.tsx',
  'profile.html': 'app/profile/page.tsx',
  'confirmation.html': 'app/confirmation/page.tsx'
};

for (const [htmlFile, destFile] of Object.entries(pages)) {
  const htmlPath = path.join(screensDir, htmlFile);
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const jsx = convertHtmlToJsx(html);
    const pageComponent = `export default function Page() {\n  return (\n${jsx}\n  );\n}\n`;
    const destPath = path.join(__dirname, destFile);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, pageComponent);
    console.log(`Converted ${htmlFile} to ${destFile}`);
  }
}
