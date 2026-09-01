const fs = require('fs');
const path = require('path');
const { parseFrontMatter } = require('./frontMatter');

const POSTS_DIR = path.join(__dirname, '../../posts');
const POSTS_METADATA_FILE = path.join(__dirname, '../../posts-metadata.json');

// Process all .md files in /posts
const files = fs.existsSync(POSTS_DIR)
  ? fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'))
  : [];

const metadata = [];

files.forEach(file => {
  const filePath = path.join(POSTS_DIR, file);
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

// Write posts-metadata.json
fs.writeFileSync(POSTS_METADATA_FILE, JSON.stringify(metadata, null, 2));

console.log(`✅ posts-metadata.json generated with ${metadata.length} posts.`);
