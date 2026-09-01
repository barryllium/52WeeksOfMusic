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

module.exports = { parseFrontMatter };
