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
  { id: "assigned-secret",     re: /\b(?:password|passwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token)\s*[:=]\s*["'][^"'\s]{12,}["']/i, why: "secret literal assigned in code" },
];
module.exports.SECRET_PATHS = /(^|\/)(\.env(?!\.(?:example|sample|template|dist)$)(\..*)?|[^/]*service[-_]?account[^/]*\.json|[^/]*ee[-_]?key[^/]*\.json|gee\.json|id_(rsa|ed25519|ecdsa)|[^/]*\.(pem|pfx|p12|key))$/i;
module.exports.PLACEHOLDER = /(^|[^A-Za-z0-9])(x{6,}|\*{4,}|your[-_ ]?(token|key|secret)|<[^>]+>|\$\{[^}]+\}|process\.env|os\.environ|Environment\.GetEnvironmentVariable)/i;
