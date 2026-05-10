require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { createMailTransport } = require('../lib/mailTransport');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ─── Startup Diagnostics ─────────────────────────────────
console.log('[AutoWise] Environment Check:');
console.log(`  SMTP_HOST  = ${process.env.SMTP_HOST || '⚠️  NOT SET'}`);
console.log(`  SMTP_PORT  = ${process.env.SMTP_PORT || '⚠️  NOT SET'}`);
console.log(`  SMTP_USER  = ${process.env.SMTP_USER || '⚠️  NOT SET'}`);
console.log(`  SMTP_PASS  = ${process.env.SMTP_PASS ? '✅ SET (' + process.env.SMTP_PASS.length + ' chars)' : '⚠️  NOT SET'}`);
console.log(`  SUPABASE   = ${(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL) ? '✅ SET' : '⚠️  NOT SET'}`);

// ─── Initialize Supabase ─────────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[AutoWise] FATAL: Supabase URL or Key is missing. DB operations will fail.');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// ─── Initialize SMTP & Verify on Startup ─────────────────
let transporter = null;
let smtpStatus = 'not_configured';

const initSMTP = async () => {
  transporter = createMailTransport();
  if (!transporter) {
    smtpStatus = 'no_credentials';
    console.warn('[AutoWise] SMTP: No credentials provided. Emails will NOT be sent.');
    return;
  }

  try {
    await transporter.verify();
    smtpStatus = 'connected';
    console.log('[AutoWise] SMTP: ✅ Connection verified. Emails are ready.');
  } catch (err) {
    smtpStatus = 'auth_failed';
    console.error(`[AutoWise] SMTP: ❌ Verification FAILED: ${err.message}`);
    console.error('[AutoWise] SMTP: Leads will still be saved to DB, but emails will fail.');
    console.error('[AutoWise] SMTP: Check your SMTP_USER / SMTP_PASS / SMTP_HOST / SMTP_PORT.');
  }
};

initSMTP();

// ─── Health Check Endpoint ───────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'running',
    smtp: smtpStatus,
    supabase: supabaseUrl ? 'configured' : 'missing',
    env: {
      SMTP_HOST: process.env.SMTP_HOST || null,
      SMTP_PORT: process.env.SMTP_PORT || null,
      SMTP_USER: process.env.SMTP_USER || null,
      SMTP_PASS_SET: !!process.env.SMTP_PASS,
      SMTP_PASS_LENGTH: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0,
    },
  });
});

// ─── Registration Endpoint ───────────────────────────────
app.post('/api/register', async (req, res) => {
  const { email, name, phone, state, workshop_name, role, lang } = req.body;

  // Validate input
  if (!email || !name || !role) {
    return res.status(400).json({ error: 'Missing required fields: email, name, role' });
  }

  // ── Step 1: Save to Database (MUST succeed) ──
  let isNewLead = true;
  try {
    const { error: dbError } = await supabase
      .from('leads')
      .insert([{ email, name, phone, state, workshop_name, role }]);

    if (dbError) {
      if (dbError.code === '23505') {
        console.log(`[DB] Duplicate email: ${email} — skipping insert.`);
        isNewLead = false;
      } else {
        console.error('[DB] Insert failed:', dbError.message);
        return res.status(500).json({ error: 'Failed to save registration.' });
      }
    } else {
      console.log(`[DB] ✅ New lead saved: ${name} (${role}) from ${state}`);
    }
  } catch (err) {
    console.error('[DB] Unexpected error:', err.message);
    return res.status(500).json({ error: 'Database connection failed.' });
  }

  // ── Step 2: Send Welcome Email (best-effort, never blocks registration) ──
  if (!transporter) {
    console.warn('[EMAIL] Skipped — SMTP not configured.');
    return res.status(200).json({ success: true, emailSent: false, isNewLead });
  }

  try {
    const isFr = lang === 'fr';
    const isGarage = role === 'garage_owner';

    const subject = isFr
      ? `Bienvenue chez Auto Wise, ${name} !`
      : `\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u0641\u064A Auto Wise\u060C ${name}!`;

    const bodyText = isFr
      ? `Bonjour ${name},\n\nMerci de vous \u00EAtre inscrit${isGarage ? ' en tant que garage partenaire' : ''}. Nous vous contacterons bient\u00F4t d\u00E8s le lancement officiel !\n\nL'\u00E9quipe Auto Wise`
      : `\u0645\u0631\u062D\u0628\u0627\u064B ${name}\u060C\n\n\u0634\u0643\u0631\u0627\u064B \u0644\u062A\u0633\u062C\u064A\u0644\u0643${isGarage ? ' \u0643\u0648\u0631\u0634\u0629 \u0645\u0639\u062A\u0645\u062F\u0629' : ''}. \u0633\u0646\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0642\u0631\u064A\u0628\u0627\u064B \u0641\u0648\u0631 \u0625\u0637\u0644\u0627\u0642\u0646\u0627 \u0627\u0644\u0631\u0633\u0645\u064A!\n\n\u0641\u0631\u064A\u0642 Auto Wise`;

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
          .footer { background-color: #f8fafc; padding: 20px 40px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="cid:autowiselogo" alt="Auto Wise" />
          </div>
          <div class="content">
            <h2>${isFr ? 'Bonjour' : '\u0645\u0631\u062D\u0628\u0627\u064B'} ${name},</h2>
            <p>
              ${isFr
                ? `Merci d'avoir rejoint la liste d'attente exclusive de <strong>Auto Wise</strong>${isGarage ? ' en tant que garage partenaire' : ''}. Nous sommes ravis de vous compter parmi nous.`
                : `\u0634\u0643\u0631\u0627\u064B \u0644\u0627\u0646\u0636\u0645\u0627\u0645\u0643 \u0625\u0644\u0649 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u062D\u0635\u0631\u064A\u0629 \u0644\u0640 <strong>Auto Wise</strong>${isGarage ? ' \u0643\u0648\u0631\u0634\u0629 \u0645\u0639\u062A\u0645\u062F\u0629' : ''}. \u0646\u062D\u0646 \u0633\u0639\u062F\u0627\u0621 \u0628\u0648\u062C\u0648\u062F\u0643 \u0645\u0639\u0646\u0627.`}
            </p>
            <p>
              ${isFr
                ? `Nous finalisons actuellement les derniers d\u00E9tails pour vous offrir la meilleure exp\u00E9rience possible. Vous serez le premier inform\u00E9 d\u00E8s notre lancement officiel !`
                : `\u0646\u062D\u0646 \u0646\u0636\u0639 \u062D\u0627\u0644\u064A\u0627\u064B \u0627\u0644\u0644\u0645\u0633\u0627\u062A \u0627\u0644\u0623\u062E\u064A\u0631\u0629 \u0644\u062A\u0642\u062F\u064A\u0645 \u0623\u0641\u0636\u0644 \u062A\u062C\u0631\u0628\u0629 \u0645\u0645\u0643\u0646\u0629. \u0633\u062A\u0643\u0648\u0646 \u0623\u0648\u0644 \u0645\u0646 \u064A\u0639\u0644\u0645 \u0641\u0648\u0631 \u0625\u0637\u0644\u0627\u0642\u0646\u0627 \u0627\u0644\u0631\u0633\u0645\u064A!`}
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Auto Wise. ${isFr ? 'Tous droits r\u00E9serv\u00E9s.' : '\u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629.'}</p>
            <p>${process.env.SMTP_FROM || process.env.SMTP_USER}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Auto Wise" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject,
      text: bodyText,
      html: bodyHtml,
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(__dirname, '../public/assets/Auto wise logo.png'),
          cid: 'autowiselogo',
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] ✅ Sent to ${email} [ID: ${info.messageId}]`);
    return res.status(200).json({ success: true, emailSent: true, isNewLead });

  } catch (mailErr) {
    console.error(`[EMAIL] ❌ Failed for ${email}: ${mailErr.message}`);
    // Lead is already saved — registration still succeeds
    return res.status(200).json({ success: true, emailSent: false, isNewLead });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Auto Wise Backend running on port ${PORT}`);
});
