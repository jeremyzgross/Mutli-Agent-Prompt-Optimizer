const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const sizes = [16, 48, 128]
const svgPath = path.join(__dirname, '../src/assets/icon.svg')
const outputDir = path.join(__dirname, '../src/assets')

async function generateIcons() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgPath)

    // Generate each size
    for (const size of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, `icon${size}.png`))

      console.log(`Generated ${size}x${size} icon`)
    }

    console.log('Icon generation complete!')
  } catch (error) {
    console.error('Error generating icons:', error)
  }
}

generateIcons()
