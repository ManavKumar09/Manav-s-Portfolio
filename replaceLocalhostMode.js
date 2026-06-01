const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'frontend', 'src'),
  path.join(__dirname, 'admin', 'src')
];

const regex = /(['"`])https:\/\/manav-s-portfolio\.onrender\.com(.*?)\1/g;
const replacement = "`${import.meta.env.DEV ? 'http://localhost:5000' : 'https://manav-s-portfolio.onrender.com'}$2`";

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (regex.test(content)) {
        content = content.replace(regex, replacement);
        fs.writeFileSync(fullPath, content);
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

directories.forEach(processDirectory);
console.log('Done upgrading URLs for automatic dev mode!');
