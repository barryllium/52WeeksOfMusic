const fs = require('fs');
const path = require('path');

const WEEKS_DIR = path.join(__dirname, '../../weeks');
const METADATA_FILE = path.join(__dirname, '../../metadata.json');

// Helper to parse front-matter
function parseFrontMatter(content) {
  const match = content.match(/^---\s*([\s\S]*?)\s*---/);
  if (!match) return {};

  const frontMatter = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (!key || !rest.length) return;
    frontMatter[key.trim()] = rest.join(':').trim();
  });

  return frontMatter;
}

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
    order: parseInt(frontMatter.order, 10)
  });
});

// Sort by order (ascending)
metadata.sort((a, b) => a.order - b.order);

// Write metadata.json
fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));

console.log(`✅ metadata.json generated with ${metadata.length} posts.`);

