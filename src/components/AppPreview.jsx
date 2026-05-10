import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function AppPreview() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const features = [
    t('app_feature_1'),
    t('app_feature_2'),
    t('app_feature_3'),
    t('app_feature_4'),
  ];

  return (
    <section id="app-preview" style={{ backgroundColor: 'var(--brand-primary)', color: 'var(--white)' }}>
      <div className="container">
        <div className="app-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '64px',
          alignItems: 'center',
        }}>
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ order: isRtl ? 2 : 1 }}
          >
            <h2 style={{ color: 'var(--white)', marginBottom: '16px' }}>{t('app_title')}</h2>
            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '1.0625rem',
              lineHeight: 1.65,
              marginBottom: '32px',
              maxWidth: '440px',
            }}>
              {t('app_subtitle')}
            </p>

            {/* Feature checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' }}>
              {features.map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '1rem', fontWeight: 500 }}>{feat}</span>
                </div>
              ))}
            </div>

            {/* Store badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>{t('app_coming_soon')}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--white)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/></svg>
                  iOS
                </span>
                <span style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--white)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/></svg>
                  Android
                </span>
              </div>
            </div>
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              order: isRtl ? 1 : 2,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div style={{
              width: '280px',
              borderRadius: '32px',
              overflow: 'hidden',
              boxShadow: '0 32px 64px rgba(0,0,0,0.25)',
              border: '8px solid #222',
              backgroundColor: '#111',
            }}>
              <img
                src="/assets/mockup-history.png"
                alt="Auto Wise App"
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .app-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .app-grid > div:first-child { order: 1 !important; }
          .app-grid > div:last-child { order: 2 !important; }
        }
      `}</style>
    </section>
  );
}
