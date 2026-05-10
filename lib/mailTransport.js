/**
 * Shared Nodemailer transport for cPanel / Exim.
 * 535 often = wrong password, wrong SSL mode, or server wants LOGIN instead of PLAIN.
 */
const nodemailer = require('nodemailer');

function createMailTransport() {
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();
  if (!user || !pass) {
    return null;
  }

  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const explicit = (process.env.SMTP_SECURE || '').toLowerCase();
  let secure;
  if (explicit === 'false' || explicit === '0') {
    secure = false;
  } else if (explicit === 'true' || explicit === '1') {
    secure = true;
  } else {
    secure = port === 465;
  }

  const host = (process.env.SMTP_HOST || 'localhost').trim();

  const cfg = {
    host,
    port,
    secure,
    auth: { user, pass },
    tls: {
      minVersion: 'TLSv1.2',
      servername: (process.env.SMTP_TLS_SERVERNAME || host).trim(),
    },
  };

  const authMethod = (process.env.SMTP_AUTH_METHOD || '').trim().toUpperCase();
  if (authMethod === 'LOGIN' || authMethod === 'PLAIN') {
    cfg.authMethod = authMethod;
  } else if (process.env.SMTP_PREFER_LOGIN === '1' || process.env.SMTP_PREFER_LOGIN === 'true') {
    cfg.authMethod = 'LOGIN';
  }

  if (port === 587 && !secure) {
    cfg.requireTLS = true;
  }

  if (process.env.SMTP_DEBUG === '1') {
    cfg.logger = true;
    cfg.debug = true;
  }

  return nodemailer.createTransport(cfg);
}

module.exports = { createMailTransport };
