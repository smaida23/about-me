const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const images = [
  'MacBook-Pro-16.png',
  'Frame 36.png',
  'Screen@2x.png',
  'HANNAMI.png',
  'mzikr35.jpg',
  'Frame 1.png',
  'rose glow sreum.png',
  'Smart spend background.png',
  'CookMate.png',
  'Money manager 1.png',
  'Money manager 2 app.png',
  'Shop helper1.png',
  'Shop helper2.png'
];

(async () => {
  for (const file of images) {
    try {
      const inputPath = path.join(__dirname, file);
      if (!fs.existsSync(inputPath)) {
        console.warn(`Skipping missing file: ${file}`);
        continue;
      }
      const outputPath = path.join(__dirname, `${path.parse(file).name}.webp`);
      const ext = path.extname(file).toLowerCase();
      const image = sharp(inputPath).rotate();
      if (ext === '.jpg' || ext === '.jpeg') {
        await image.webp({ quality: 75, effort: 6 }).toFile(outputPath);
      } else {
        await image.webp({ quality: 80, alphaQuality: 90, effort: 6 }).toFile(outputPath);
      }
      const originalSize = fs.statSync(inputPath).size;
      const optimizedSize = fs.statSync(outputPath).size;
      const saving = (((originalSize - optimizedSize) / originalSize) * 100).toFixed(1);
      console.log(`${file} -> ${path.basename(outputPath)} (${originalSize} -> ${optimizedSize} bytes, ${saving}% smaller)`);
    } catch (error) {
      console.error(`Failed: ${file}`, error.message);
    }
  }
})();
