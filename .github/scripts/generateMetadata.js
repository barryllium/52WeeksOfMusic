const fs = require('fs');
const path = require('path');
const { parseFrontMatter } = require('./frontMatter');

const WEEKS_DIR = path.join(__dirname, '../../weeks');
const METADATA_FILE = path.join(__dirname, '../../metadata.json');
const FIFTY_TWO_WEEKS_METADATA_FILE = path.join(__dirname, '../../fifty-two-weeks-metadata.json');

// Process all .md files in /weeks
const files = fs.readdirSync(WEEKS_DIR).filter(f => f.endsWith('.md'));

const metadata = [];

files.forEach(file => {
  const filePath = path.join(WEEKS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const frontMatter = parseFrontMatter(content);

  if (!frontMatter.title || !frontMatter.order) {
    console.warn(`⚠️ Skipping "${file}" → missing required front-matter (title or order).`);
    return;
  }

  metadata.push({
    file,
    title: frontMatter.title,
    date: frontMatter.date || null,
    order: parseFloat(frontMatter.order)
  });
});

// Sort by order (ascending)
metadata.sort((a, b) => a.order - b.order);

// Write metadata.json and fifty-two-weeks-metadata.json (kept in sync during migration)
const output = JSON.stringify(metadata, null, 2);
fs.writeFileSync(METADATA_FILE, output);
fs.writeFileSync(FIFTY_TWO_WEEKS_METADATA_FILE, output);

console.log(`✅ metadata.json and fifty-two-weeks-metadata.json generated with ${metadata.length} posts.`);
