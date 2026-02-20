// generate-icons.js — Run once: node generate-icons.js
// Requires: npm install sharp

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const outDir = path.join(__dirname, 'src', 'assets', 'icons')

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

// Generate SVG icon
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#6C63FF"/>
      <stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#g)"/>
  <text x="256" y="340" font-family="Arial Black" font-weight="900"
        font-size="280" fill="white" text-anchor="middle">S</text>
</svg>
`

async function generate() {
  const svgBuffer = Buffer.from(svgIcon)
  for (const size of sizes) {
    const outPath = path.join(outDir, `icon-${size}.png`)
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outPath)
    console.log(`✅ Generated icon-${size}.png`)
  }
  console.log('\n✅ All icons generated in', outDir)
}

generate().catch(console.error)