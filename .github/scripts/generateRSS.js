const fs = require('fs');
const metadata = require('../../metadata.json'); // adjust as needed

const BASE_URL = 'https://barryllium.github.io/music/';

function formatDateRFC822(dateStr) {
  return new Date(dateStr).toUTCString();
}

const items = metadata.map(post => {
  const pubDate = post.date ? formatDateRFC822(post.date) : new Date().toUTCString();
  return `
    <item>
      <title>${post.title}</title>
      <link>${BASE_URL}post.html?file=${encodeURIComponent(post.file)}</link>
      <guid>${BASE_URL}post.html?file=${encodeURIComponent(post.file)}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>`;
}).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>52 Weeks of Music</title>
    <link>${BASE_URL}</link>
    <description>A weekly journey through influential music</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

fs.writeFileSync('rss.xml', rss);
console.log('rss.xml generated!');

