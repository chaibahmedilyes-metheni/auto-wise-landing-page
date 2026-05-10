require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const distPath = path.join(__dirname, 'dist');

// Middleware
app.use(cors());
app.use(express.json());

// Plain response for uptime / cPanel post-install checks (avoid HTML-only probes failing)
function sendPlainOk(req, res) {
  res.status(200).type('text/plain; charset=utf-8').send('ok\n');
}
app.get('/health', sendPlainOk);
app.head('/health', (req, res) => {
  res.status(200).type('text/plain; charset=utf-8').end();
});

function getSupabaseEnv() {
  const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
  const anonKey = (
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    ''
  ).trim();
  return { url, anonKey };
}

function buildSpaHtml() {
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return '<!DOCTYPE html><html><body><h1>Missing dist/index.html — run <code>npm run build</code> in the app root.</h1></body></html>';
  }
  const raw = fs.readFileSync(indexPath, 'utf8');
  const { url, anonKey } = getSupabaseEnv();
  const payload = JSON.stringify({ url, anonKey });
  const script = `    <script>window.__AUTOWISE_SUPABASE__=${payload};</script>`;
  if (raw.includes('__AUTOWISE_SUPABASE__')) {
    return raw;
  }
  return raw.replace('<head>', `<head>\n${script}`);
}

/** cPanel: use full mailbox email as SMTP_USER; 535 = wrong user/pass or wrong SSL mode. */
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
  const cfg = {
    host: (process.env.SMTP_HOST || 'localhost').trim(),
    port,
    secure,
    auth: { user, pass },
  };
  if (port === 587 && !secure) {
    cfg.requireTLS = true;
  }
  return nodemailer.createTransport(cfg);
}

let serverSupabase = null;
function getServerSupabase() {
  if (serverSupabase) {
    return serverSupabase;
  }
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    return null;
  }
  serverSupabase = createClient(url, anonKey);
  return serverSupabase;
}

// ─── API Routes ────────────────────────────────────────────────

app.post('/api/register', async (req, res) => {
  const supabase = getServerSupabase();
  if (!supabase) {
    return res.status(503).json({
      error: 'Server misconfigured',
      message: 'Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or SUPABASE_URL and SUPABASE_KEY) in cPanel Node environment variables or in .env',
    });
  }

  const { email, name, phone, state, workshop_name, role, lang } = req.body;

  if (!email || !name || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { error: dbError } = await supabase
      .from('leads')
      .insert([{ email, name, phone, state, workshop_name, role }]);

    if (dbError) {
      if (dbError.code === '23505') {
        console.log(`Duplicate registration attempt for email: ${email}`);
        return res.status(200).json({
          success: true,
          emailSent: false,
          duplicate: true,
          message: 'Registration complete',
        });
      }
      console.error('Supabase Error:', dbError);
      return res.status(500).json({ error: 'Database error' });
    }
  } catch (dbErr) {
    console.error('Registration DB Error:', dbErr);
    return res.status(500).json({ error: 'Internal server error' });
  }

  if (
    process.env.SKIP_WELCOME_EMAIL === '1' ||
    process.env.AUTOWISE_SKIP_WELCOME_EMAIL === '1'
  ) {
    console.warn('[AutoWise] Welcome email disabled (SKIP_WELCOME_EMAIL / AUTOWISE_SKIP_WELCOME_EMAIL=1)');
    return res.status(200).json({
      success: true,
      emailSent: false,
      message: 'Registration complete',
    });
  }

  try {
    const isFr = lang === 'fr';
    const isGarage = role === 'garage_owner';

    const subject = isFr
      ? `Bienvenue chez Auto Wise, ${name} !`
      : `مرحباً بك في Auto Wise، ${name}!`;

    const bodyText = isFr
      ? `Bonjour ${name},\n\nMerci de vous être inscrit${isGarage ? ' en tant que garage partenaire' : ''}. Nous vous contacterons bientôt dès le lancement officiel !\n\nL'équipe Auto Wise`
      : `مرحباً ${name}،\n\nشكراً لتسجيلك${isGarage ? ' كورشة معتمدة' : ''}. سنتواصل معك قريباً فور إطلاقنا الرسمي!\n\nفريق Auto Wise`;

    const direction = isFr ? 'ltr' : 'rtl';
    const fontFamily = isFr ? 'Arial, sans-serif' : 'Tahoma, Arial, sans-serif';

    const bodyHtml = `
      <!DOCTYPE html>
      <html lang="${lang}" dir="${direction}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; font-family: ${fontFamily}; background-color: #f4f4f5; color: #18181b; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .header { background-color: #050505; padding: 30px 40px; text-align: center; border-bottom: 4px solid #FF4D1C; }
          .header img { max-height: 45px; }
          .content { padding: 40px; line-height: 1.6; font-size: 16px; color: #3f3f46; text-align: ${isFr ? 'left' : 'right'}; }
          .content h2 { color: #18181b; font-size: 24px; margin-top: 0; }
          .btn-container { text-align: center; margin: 30px 0; }
          .btn { display: inline-block; padding: 12px 28px; background-color: #FF4D1C; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; }
          .footer { background-color: #f8fafc; padding: 20px 40px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="cid:autowiselogo" alt="Auto Wise" />
          </div>
          <div class="content">
            <h2>${isFr ? 'Bonjour' : 'مرحباً'} ${name},</h2>
            <p>
              ${isFr
        ? `Merci d'avoir rejoint la liste d'attente exclusive de <strong>Auto Wise</strong>${isGarage ? ' en tant que garage partenaire' : ''}. Nous sommes ravis de vous compter parmi nous.`
        : `شكراً لانضمامك إلى قائمة الانتظار الحصرية لـ <strong>Auto Wise</strong>${isGarage ? ' كورشة معتمدة' : ''}. نحن سعداء بوجودك معنا.`}
            </p>
            <p>
              ${isFr
        ? `Nous finalisons actuellement les derniers détails pour vous offrir la meilleure expérience possible. Vous serez le premier informé dès notre lancement officiel !`
        : `نحن نضع حالياً اللمسات الأخيرة لتقديم أفضل تجربة ممكنة. ستكون أول من يعلم فور إطلاقنا الرسمي!`}
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Auto Wise. ${isFr ? 'Tous droits réservés.' : 'جميع الحقوق محفوظة.'}</p>
            <p>${process.env.SMTP_FROM || process.env.SMTP_USER}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const logoPath = path.join(__dirname, 'public', 'assets', 'Auto wise logo.png');
    const attachments = [];
    if (fs.existsSync(logoPath)) {
      attachments.push({
        filename: 'logo.png',
        path: logoPath,
        cid: 'autowiselogo',
      });
    }

    const mailOptions = {
      from: `"Auto Wise" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject,
      text: bodyText,
      html: bodyHtml,
      attachments,
    };

    const transporter = createMailTransport();
    if (!transporter) {
      console.warn('[AutoWise] SMTP_USER/SMTP_PASS not set — lead saved, welcome email skipped');
      return res.status(200).json({
        success: true,
        emailSent: false,
        message: 'Registration complete',
      });
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email} [ID: ${info.messageId}]`);
    return res.status(200).json({
      success: true,
      emailSent: true,
      message: 'Registration complete',
    });
  } catch (mailErr) {
    console.error('[AutoWise] Welcome email failed (lead saved):', mailErr?.message || mailErr);
    if (mailErr?.responseCode === 535 || mailErr?.code === 'EAUTH') {
      console.error(
        '[AutoWise] SMTP 535: fix SMTP_USER/SMTP_PASS in cPanel, or try SMTP_PORT=587 + SMTP_SECURE=false; bypass email: SKIP_WELCOME_EMAIL=1',
      );
    }
    return res.status(200).json({
      success: true,
      emailSent: false,
      message: 'Registration complete',
    });
  }
});

// ─── Static assets (do not serve dist/index.html here, or injection is skipped) ───

app.use('/assets', express.static(path.join(distPath, 'assets')));

['favicon.svg', 'icons.svg'].forEach((name) => {
  app.get(`/${name}`, (req, res, next) => {
    const fp = path.join(distPath, name);
    if (fs.existsSync(fp)) {
      res.sendFile(fp, next);
    } else {
      next();
    }
  });
});

// ─── SPA: inject Supabase for browser bundle (Vite only inlines env at build time) ───

app.use((req, res, next) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }
    if (req.path.startsWith('/api')) {
      return next();
    }
    if (req.path.startsWith('/assets/')) {
      return next();
    }

    const rel = req.path === '/' ? '' : req.path.replace(/^\//, '');
    if (rel && !rel.includes('..')) {
      const fp = path.join(distPath, rel);
      try {
        if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
          return res.sendFile(path.resolve(fp), (err) => {
            if (err && !res.headersSent) {
              console.error('[AutoWise] sendFile', fp, err);
              res.type('html').send(buildSpaHtml());
            }
          });
        }
      } catch (e) {
        console.error('[AutoWise] static file check', e);
      }
    }

    const html = buildSpaHtml();
    return res.type('html').send(html);
  } catch (err) {
    console.error('[AutoWise] SPA handler', req.method, req.path, err);
    if (!res.headersSent) {
      res.status(500).type('text/plain; charset=utf-8').send('Internal Server Error\n');
    }
  }
});

// Unmatched GET (e.g. /api/foo) after middleware above — return 404 without HTML mismatch noise
app.use((req, res) => {
  if (!res.headersSent) {
    res.status(404).type('text/plain; charset=utf-8').send('Not Found\n');
  }
});

// ─── Start Server ──────────────────────────────────────────────
// Phusion Passenger (cPanel Node.js) must use app.listen('passenger'), not a local TCP port.
// cPanel often does NOT define the PhusionPassenger global before this file runs, but it does set
// PASSENGER_* env vars — so we detect those too. Manual override: AUTOWISE_PASSENGER=1
// https://www.phusionpassenger.com/library/deploy/nodejs/reverse_proxy.html
// https://www.phusionpassenger.com/library/indepth/environment_variables.html

function logStartup(where) {
  const { url, anonKey } = getSupabaseEnv();
  console.log(`🚀 Auto Wise Backend (${where})`);
  if (!url || !anonKey) {
    console.warn(
      '⚠️  Supabase env missing: set VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY in .env or cPanel Node environment (page will error until set).',
    );
  }
}

function isPassengerManaged() {
  if (typeof PhusionPassenger !== 'undefined') {
    return true;
  }
  if (typeof global !== 'undefined' && typeof global.PhusionPassenger !== 'undefined') {
    return true;
  }
  if (process.env.AUTOWISE_PASSENGER === '1' || process.env.AUTOWISE_PASSENGER === 'true') {
    return true;
  }
  if (process.env.PASSENGER_APP_ROOT) {
    return true;
  }
  if (process.env.PASSENGER_INSTANCE_REGISTRY_DIR) {
    return true;
  }
  if (process.env.IN_PASSENGER === '1') {
    return true;
  }
  return false;
}

function startHttpServer() {
  const passengerMode = isPassengerManaged();
  console.log(
    `[AutoWise] HTTP listen: ${passengerMode ? "passenger (Phusion Passenger)" : `tcp port ${Number(process.env.PORT) || 3001}`}`,
  );

  if (passengerMode) {
    if (typeof PhusionPassenger !== 'undefined') {
      PhusionPassenger.configure({ autoInstall: false });
    }
    app.listen('passenger', () => {
      logStartup('Passenger');
    });
    return;
  }

  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => {
    logStartup(`port ${port}`);
  });
}

// Defer one tick: on some hosts Passenger env/global is visible only after the module loads.
setImmediate(startHttpServer);
