const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const images = ['MacBook-Pro-16.png','Screen@2x.png','HANNAMI.png','Frame 36.png'];
(async () => {
  for (const img of images) {
    const input = path.join(__dirname, img);
    const output = path.join(__dirname, img.replace(/\.png$/, '.opt.png'));
    if (!fs.existsSync(input)) {
      console.warn('missing', img);
      continue;
    }
    try {
      await sharp(input)
        .png({compressionLevel: 9, quality: 80, palette: true})
        .toFile(output);
      const orig = fs.statSync(input).size;
      const opt = fs.statSync(output).size;
      console.log(`${img}: ${orig} -> ${opt}`);
    } catch (err) {
      console.error('error', img, err.message);
    }
  }
})();
