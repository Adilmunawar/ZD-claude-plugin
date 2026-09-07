// Shared credential patterns. Used by guard-write.js (block on write) and secrets-audit.js (scan repo + history).
// Each pattern is conservative: it should fire on real secrets and stay quiet on placeholders and variable names.
"use strict";
module.exports = [
  { id: "private-key-block",   re: /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/,                      why: "PEM private key" },
  { id: "gcp-service-account", re: /"private_key"\s*:\s*"-----BEGIN/,                                              why: "Google service-account JSON with embedded key" },
  { id: "huggingface-token",   re: /\bhf_[A-Za-z0-9]{30,}\b/,                                                     why: "Hugging Face access token" },
  { id: "github-token",        re: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}\b|\bgithub_pat_[A-Za-z0-9_]{60,}\b/, why: "GitHub token" },
  { id: "aws-access-key",      re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/,                                                why: "AWS access key id" },
  { id: "google-api-key",      re: /\bAIza[0-9A-Za-z_-]{35}\b/,                                                    why: "Google API key" },
  { id: "slack-token",         re: /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/,                                              why: "Slack token" },
  { id: "openai-anthropic-key",re: /\b(?:sk-ant-|sk-)[A-Za-z0-9_-]{32,}\b/,                                        why: "OpenAI/Anthropic-style API key" },
  { id: "connection-string",   re: /(?:Password|Pwd)=[^;\s'"]{8,};/i,                                              why: "database connection string with password" },
  { id: "url-basic-auth",      re: /[a-z][a-z0-9+.-]*:\/\/[^\s/:@]+:[^\s/@]{6,}@[^\s/]+/i,                          why: "URL with embedded credentials" },
  { id: "assigned-secret",     re: /\b(?:password|passwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token)\s*[:=]\s*["']([^"'\s]{12,})["']/i, why: "secret literal assigned in code", entropy: 2.5 },
  { id: "slack-webhook",       re: /https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]+\/B[A-Z0-9]+\/[A-Za-z0-9]{20,}/,       why: "Slack incoming webhook" },
  { id: "discord-webhook",     re: /https:\/\/discord(app)?\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]{60,}/,               why: "Discord webhook" },
  { id: "google-oauth-secret", re: /\bGOCSPX-[A-Za-z0-9_-]{28}\b/,                                                        why: "Google OAuth client secret" },
  { id: "firebase-server-key", re: /\bAAAA[A-Za-z0-9_-]{7}:APA91b[A-Za-z0-9_-]{100,}/,                                      why: "Firebase Cloud Messaging server key" },
  { id: "jwt-token",           re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/,                 why: "signed JWT" },
  { id: "azure-storage-key",   re: /AccountKey=[A-Za-z0-9+\/]{86}==/,                                                        why: "Azure storage account key" },
  { id: "sendgrid-key",        re: /\bSG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}\b/,                                            why: "SendGrid API key" },
  { id: "twilio-key",          re: /\bSK[0-9a-fA-F]{32}\b/,                                                                 why: "Twilio API key" },
  { id: "mapbox-token",        re: /\b[sp]k\.eyJ[A-Za-z0-9_-]{60,}\b/,                                                      why: "Mapbox secret/public token" },
  { id: "high-entropy-secret", re: /\b(?:secret|token|api[_-]?key|private[_-]?key|passwd|password)[A-Za-z0-9_]*\s*[:=]\s*["']([A-Za-z0-9+\/_=-]{32,})["']/i, why: "high-entropy value assigned to a secret-like name", entropy: 4.0 },
];
// Shannon entropy in bits per character; a random 32+ char token scores > 4, English or repeated chars far less.
module.exports.entropy = (s) => { const f = {}; for (const ch of s) f[ch] = (f[ch] || 0) + 1; return -Object.values(f).reduce((a, n) => { const p = n / s.length; return a + p * Math.log2(p); }, 0); };
module.exports.SECRET_PATHS = /(^|\/)(\.env(?!\.(?:example|sample|template|dist)$)(\..*)?|[^/]*service[-_]?account[^/]*\.json|[^/]*ee[-_]?key[^/]*\.json|gee\.json|id_(rsa|ed25519|ecdsa)|[^/]*\.(pem|pfx|p12|key))$/i;
// Paths the assistant must never modify: doing so would weaken the guardrails or persist across sessions.
module.exports.PROTECTED_PATHS = /(^|\/)(\.claude\/(settings|settings\.local|managed-settings)\.json|\.claude\/plugins\/.*|hooks\/hooks\.json|managed-settings\.json|\.bashrc|\.bash_profile|\.profile|\.zshrc|\.zprofile|\.ssh\/(authorized_keys|config|id_[a-z0-9]+)|\.git\/hooks\/[^/]+|\.gitconfig|\.npmrc|\.pypirc|\.netrc|etc\/(sudoers|crontab|hosts|profile))$/i;
module.exports.PLACEHOLDER = /(^|[^A-Za-z0-9])(x{6,}|\*{4,}|your[-_ ]?[a-z-]*(token|key|secret|password)|goes[-_ ]?here|replace[-_ ]?me|change[-_ ]?me|placeholder|example|dummy|sample|<[^>]+>|\$\{[^}]+\}|process\.env|os\.environ|Environment\.GetEnvironmentVariable)/i;
