import { readFileSync } from 'node:fs';

const zipPath = process.argv[2] || 'release/netlify-dist.zip';
const siteId = JSON.parse(readFileSync('.netlify/state.json', 'utf8')).siteId;
const tokenLine = readFileSync('.env.netlify', 'utf8')
  .split(/\r?\n/)
  .find(line => line.trim().startsWith('NETLIFY_AUTH_TOKEN='));

if (!tokenLine) {
  throw new Error('Missing NETLIFY_AUTH_TOKEN in .env.netlify');
}

const token = tokenLine
  .split('=')
  .slice(1)
  .join('=')
  .trim()
  .replace(/^['"]|['"]$/g, '');

const zip = readFileSync(zipPath);

const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/zip'
  },
  body: zip
});

const text = await response.text();
let deploy;
try {
  deploy = text ? JSON.parse(text) : null;
} catch {
  deploy = { raw: text };
}

console.log('create deploy status', response.status);
console.log(JSON.stringify({
  id: deploy?.id,
  state: deploy?.state,
  deploy_ssl_url: deploy?.deploy_ssl_url,
  ssl_url: deploy?.ssl_url,
  url: deploy?.url,
  error: deploy?.message || deploy?.error
}, null, 2));

if (!response.ok || !deploy?.id) {
  process.exit(1);
}

for (let attempt = 0; attempt < 60; attempt += 1) {
  const pollResponse = await fetch(`https://api.netlify.com/api/v1/deploys/${deploy.id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const latest = await pollResponse.json();
  console.log('Deploy status', latest.state, latest.deploy_ssl_url || latest.ssl_url || latest.url || '');

  if (['ready', 'uploaded'].includes(latest.state)) {
    process.exit(0);
  }

  if (latest.state === 'error') {
    process.exit(1);
  }

  await new Promise(resolve => setTimeout(resolve, 5000));
}

process.exit(1);
