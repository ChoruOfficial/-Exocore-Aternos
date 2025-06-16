const fs = require("fs");
const path = require("path");
const distDir = path.join(process.cwd(), 'dist');
const filesToProcess = [
  path.join(distDir, 'index.js'),
  path.join(distDir, 'index.mjs')
];

console.log('Running post-build script to replace "var" with "const"...');

try {
  filesToProcess.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      const replacedContent = content.replace(/(^|[\s{;])var\s/g, '$1const ');
      fs.writeFileSync(filePath, replacedContent, 'utf8');
      console.log(`Processed: ${path.basename(filePath)}`);
    } else {
      console.log(`⚠️ Skipped: ${path.basename(filePath)} (not found)`);
    }
  });
  console.log('✅ Replacement complete for all files.');
} catch (error) {
  console.error('❌ Error during post-build script:', error);
  process.exit(1);
}