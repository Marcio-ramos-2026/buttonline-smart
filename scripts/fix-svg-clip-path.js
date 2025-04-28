const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { JSDOM } = require('jsdom');

const inputFolder = path.join(__dirname, '../public/conversion/old-svg');
const outputFolder = path.join(__dirname, '../public/conversion/new-svg');

// Ensure output folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

fs.readdirSync(inputFolder).forEach((file) => {
  if (path.extname(file) === '.svg') {
    const inputPath = path.join(inputFolder, file);
    const outputPath = path.join(outputFolder, file);

    // Step 1: Inkscape processing
    const inkscapeCommand = `inkscape "${inputPath}" --actions="select-all;object-to-path;stroke-to-path;export-filename:${outputPath};export-do"`;

    console.log(`✅ Processing with Inkscape: ${file}`);
    try {
      execSync(inkscapeCommand, { stdio: 'inherit' });
    } catch (err) {
      console.error(`❌ Error processing with Inkscape ${file}:`, err.message);
    }

    // Step 2: Clean up with SVGO
    const svgoCommand = `svgo "${outputPath}"`;

    console.log(`✅ Cleaning up with SVGO: ${file}`);
    try {
      execSync(svgoCommand, { stdio: 'inherit' });
    } catch (err) {
      console.error(`❌ Error cleaning up with SVGO ${file}:`, err.message);
    }

    // Step 3: Merge all <path> into a single <path>
    console.log(`✅ Merging all paths into one: ${file}`);
    try {
      const svgContent = fs.readFileSync(outputPath, 'utf8');
      const dom = new JSDOM(svgContent, { contentType: "image/svg+xml" });
      const document = dom.window.document;

      const paths = Array.from(document.querySelectorAll('path'));

      if (paths.length > 1) {
        const mergedD = paths.map(p => p.getAttribute('d')).join(' ');
        
        // Remove all original paths
        paths.forEach(p => p.parentNode.removeChild(p));
        
        // Create a single merged path
        const mergedPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        mergedPath.setAttribute('d', mergedD);
        document.querySelector('svg').appendChild(mergedPath);

        // Save the modified SVG
        const finalSvg = document.documentElement.outerHTML;
        fs.writeFileSync(outputPath, finalSvg, 'utf8');
      }
    } catch (err) {
      console.error(`❌ Error merging paths ${file}:`, err.message);
    }
  }
});
