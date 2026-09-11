/**
 * Script to split composite 360° product images into individual angle images
 * Uses sharp library to crop a grid image into separate views
 * 
 * Usage: node split360Images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function split360Image(inputPath, outputDir, rows = 3, cols = 4) {
  try {
    console.log('🔄 Starting image splitting process...');
    console.log(`Input: ${inputPath}`);
    console.log(`Output: ${outputDir}\n`);

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    const imgWidth = metadata.width;
    const imgHeight = metadata.height;

    console.log(`Image dimensions: ${imgWidth}x${imgHeight}`);

    // Calculate dimensions for each cell
    const cellWidth = Math.floor(imgWidth / cols);
    const cellHeight = Math.floor(imgHeight / rows);

    console.log(`Cell dimensions: ${cellWidth}x${cellHeight}`);
    console.log(`Grid layout: ${rows} rows x ${cols} columns = ${rows * cols} images\n`);

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Extract each view
    let angleNumber = 1;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const left = col * cellWidth;
        const top = row * cellHeight;

        const outputPath = path.join(outputDir, `angle-${angleNumber}.png`);

        await sharp(inputPath)
          .extract({
            left: left,
            top: top,
            width: cellWidth,
            height: cellHeight
          })
          .toFile(outputPath);

        console.log(`✓ Saved angle-${angleNumber}.png`);
        angleNumber++;
      }
    }

    console.log(`\n✅ Successfully split image into ${angleNumber - 1} individual views!`);
    console.log(`📁 Output directory: ${outputDir}`);

  } catch (error) {
    console.error('❌ Error splitting image:', error.message);
    process.exit(1);
  }
}

// Main execution
(async () => {
  const baseDir = path.join(__dirname, '../../frontend/public/assets/products/360view');
  
  const inputImage = path.join(
    baseDir,
    'Alarme autonome avec sirene integree et detecteur',
    'ChatGPT Image 9 sept. 2026, 14_45_25.png'
  );

  const outputDirectory = path.join(
    baseDir,
    'Alarme autonome avec sirene integree et detecteur'
  );

  if (!fs.existsSync(inputImage)) {
    console.error(`❌ Error: Image not found at ${inputImage}`);
    process.exit(1);
  }

  // Split the image (3 rows x 4 columns = 12 views)
  await split360Image(inputImage, outputDirectory, 3, 4);
})();
