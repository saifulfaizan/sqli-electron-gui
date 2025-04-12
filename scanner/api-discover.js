// scanner/api-discover.js (updated pattern detection)

const axios = require('axios');
const cheerio = require('cheerio');

async function discoverApis(targetUrl) {
  const result = [];
  if (!targetUrl.startsWith('http')) {
    console.log('❌ URL tidak sah');
    return [];
  }

  try {
    const res = await axios.get(targetUrl);
    const $ = cheerio.load(res.data);

    // Cari <form> action
    $('form').each((i, el) => {
      const action = $(el).attr('action');
      if (action && isApiLike(action)) result.push(action);
    });

    // Cari JS inline dalam <script>
    const scripts = $('script').map((i, el) => $(el).html()).get();
    scripts.forEach(script => {
      const matches = script.match(/['"`]\/[^'"`\s]+['"`]/g);
      if (matches) {
        matches.forEach(api => {
          const clean = api.replace(/['"`]/g, '');
          if (isApiLike(clean)) result.push(clean);
        });
      }
    });

    return [...new Set(result)];
  } catch (e) {
    console.log('❌ Gagal fetch HTML:', e.message);
    return [];
  }
}

function isApiLike(str) {
  const apiKeywords = [
    '/api', '/v1', '/v2', '/auth', '/login', '/search', '/submit', '/form', '/user', '/token'
  ];
  return apiKeywords.some(keyword => str.toLowerCase().includes(keyword));
}

module.exports = discoverApis;
