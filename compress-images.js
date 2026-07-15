const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const images = [
  {src: 'Frame 36.png', description: 'Luxury Jewelry website thumbnail'},
  {src: 'MacBook-Pro-16.png', description: 'Luxury Jewelry website hero screen'},
  {src: 'Screen@2x.png', description: 'Hannami Ryokan website card image'},
  {src: 'HANNAMI.png', description: 'Hannami Ryokan phone mockup'},
];

(async () => {
  for (const image of images) {
    const inputPath = path.resolve(__dirname, image.src);
    if (!fs.existsSync(inputPath)) {
      console.error(`Missing file: ${image.src}`);
      continue;
    }

    const tempPath = path.resolve(__dirname, image.src.replace(/\.png$/i, '.opt.png'));
    try {
      await sharp(inputPath)
        .png({ compressionLevel: 9, adaptiveFiltering: true, palette: true, quality: 80 })
        .toFile(tempPath);

      const origSize = fs.statSync(inputPath).size;
      const optSize = fs.statSync(tempPath).size;
      const savings = origSize - optSize;
      const pct = ((savings / origSize) * 100).toFixed(1);
      console.log(`${image.src}: ${origSize} -> ${optSize} bytes (${pct}% savings)`);

      if (optSize < origSize) {
        fs.renameSync(tempPath, inputPath);
        console.log(`Replaced original ${image.src} with optimized version.`);
      } else {
        fs.unlinkSync(tempPath);
        console.log(`Optimized ${image.src} was not smaller; original file preserved.`);
      }
    } catch (error) {
      console.error(`Failed to optimize ${image.src}:`, error.message || error);
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }
})();
