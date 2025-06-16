// @ts-check
const extract = require('extract-zip');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Avoid unused import: execSync removed
const config = /** @type {{ Chrome_URL?: string; DOWNLOAD_PATH?: string; EXTRACT_PATH: string }} */ (
  require('./config.json')
);

let chromeURL = config.Chrome_URL || '';
const fallbackURL = 'https://storage.googleapis.com/chrome-for-testing-public/126.0.6478.57/linux64/chrome-linux64.zip';

const DOWNLOAD_PATH = path.resolve(config.DOWNLOAD_PATH || './chromium.zip');
const EXTRACT_PATH = path.resolve(config.EXTRACT_PATH || './stable-chromium/chrome-linux');

/**
 * Ensure directory exists
 * @param {string} dir
 */
function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created: ${dir}`);
  }
}

/**
 * Download fallback Chromium
 */
async function autoDownloadChromium() {
  console.log('⬇️ Downloading Chromium...');
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(DOWNLOAD_PATH);
    https.get(fallbackURL, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`Download failed: ${res.statusCode}`));
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

/**
 * Download ZIP from local UNC or fallback
 */
async function downloadChrome() {
  if (chromeURL && fs.existsSync(chromeURL)) {
    console.log(`🔗 Using local Chromium ZIP: ${chromeURL}`);
    ensureDirExists(path.dirname(DOWNLOAD_PATH));

    return new Promise((resolve, reject) => {
      fs.createReadStream(chromeURL)
        .pipe(fs.createWriteStream(DOWNLOAD_PATH))
        .on('error', reject)
        .on('finish', () => {
          console.log('✅ Local ZIP copied.');
          resolve();
        });
    });
  }

  console.warn('⚠️ Local Chrome_URL not found. Using fallback...');
  return autoDownloadChromium();
}

/**
 * Extract ZIP to target folder
 */
async function extractChrome() {
  if (!fs.existsSync(DOWNLOAD_PATH)) throw new Error('ZIP file missing.');
  ensureDirExists(EXTRACT_PATH);

  try {
    await extract(DOWNLOAD_PATH, { dir: EXTRACT_PATH });
    console.log('📦 Extracted successfully.');
    fs.unlinkSync(DOWNLOAD_PATH);
  } catch (err) {
    throw new Error('❌ Extraction failed: ' + (err?.message || err));
  }
}

/**
 * Recommend apt-get libs
 */
function suggestInstallLibs() {
  const isReplit = !!process.env.REPL_ID;
  const isTermux = fs.existsSync('/data/data/com.termux/files/usr/bin/termux-info');
  const installCmd = 'apt install -y libglib2.0-0 libgobject-2.0-0 libnss3 libx11-xcb1 libatk1.0-0 libatk-bridge2.0-0 libdrm2';

  if (isReplit) {
    console.warn('\n⚠️ Replit detected. Use pre-installed Chromium or system puppeteer.\n');
  } else if (isTermux) {
    console.log(`📦 Termux detected:\napt update && ${installCmd}`);
  } else {
    console.log(`📦 Run this:\nsudo apt update && sudo ${installCmd}`);
  }
}

/**
 * Main installer
 */
async function installChrome() {
  try {
    await downloadChrome();
    await extractChrome();
    console.log('✅ Chromium ready to use.');
  } catch (err) {
    console.error('❌ Setup failed:', err?.message || err);
    suggestInstallLibs();
  }
}

// CLI entry
if (require.main === module) {
  installChrome();
}

// Export
module.exports = {
  install: installChrome
};
