const fs = require('fs');
const path = require('path');

const OLD_URL = 'http://localhost:5000';
const NEW_URL = 'https://manav-s-portfolio.onrender.com';

const directories = [
  path.join(__dirname, 'frontend', 'src'),
  path.join(__dirname, 'admin', 'src')
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(OLD_URL)) {
        content = content.replaceAll(OLD_URL, NEW_URL);
        fs.writeFileSync(fullPath, content);
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

directories.forEach(processDirectory);
console.log('Done replacing URLs!');
