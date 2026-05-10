import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShieldCheck, Camera, Star, FileText, Headphones, Lock, CheckCircle2 } from 'lucide-react';

export default function TrustSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const trustItems = [
    { icon: <ShieldCheck size={20} />, text: t('trust_item_1') },
    { icon: <Camera size={20} />, text: t('trust_item_2') },
    { icon: <Star size={20} />, text: t('trust_item_3') },
    { icon: <FileText size={20} />, text: t('trust_item_4') },
    { icon: <Headphones size={20} />, text: t('trust_item_5') },
    { icon: <Lock size={20} />, text: t('trust_item_6') },
  ];

  return (
    <section id="trust" style={{ backgroundColor: 'var(--chip-bg)' }}>
      <div className="container">
        <div className="trust-layout" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '64px',
          alignItems: 'center',
        }}>
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{ order: isRtl ? 2 : 1 }}
          >
            <h2 style={{ marginBottom: '12px' }}>{t('trust_title')}</h2>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1.0625rem',
              lineHeight: 1.65,
              maxWidth: '440px',
            }}>
              {t('trust_subtitle')}
            </p>
          </motion.div>

          {/* Checklist side */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              order: isRtl ? 1 : 2,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
            className="trust-items-grid"
          >
            {trustItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: 'var(--white)',
                  borderRadius: 'var(--radius-card-lg)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(22, 163, 74, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--success)',
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <span style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.35 }}>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .trust-layout {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .trust-layout > div:first-child { order: 1 !important; }
          .trust-layout > div:last-child { order: 2 !important; }
        }
        @media (max-width: 500px) {
          .trust-items-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
