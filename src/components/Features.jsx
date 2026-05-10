import { useTranslation } from 'react-i18next';
import { ShieldCheck, Camera, CalendarCheck, History, DollarSign, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Features() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const features = [
    { icon: <ShieldCheck size={24} />, title: t('feature_1_title'), desc: t('feature_1_desc') },
    { icon: <Camera size={24} />, title: t('feature_2_title'), desc: t('feature_2_desc') },
    { icon: <CalendarCheck size={24} />, title: t('feature_3_title'), desc: t('feature_3_desc') },
    { icon: <History size={24} />, title: t('feature_4_title'), desc: t('feature_4_desc') },
  ];

  return (
    <section id="features" style={{ backgroundColor: 'var(--chip-bg)', overflow: 'hidden' }}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '48px', textAlign: 'center' }}
        >
          <h2 style={{ marginBottom: '12px' }}>{t('features_title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
            {t('features_subtitle')}
          </p>
        </motion.div>

        <div className="features-layout" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '48px',
          alignItems: 'center',
        }}>
          {/* Features Grid */}
          <div className="features-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            order: isRtl ? 2 : 1
          }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="card"
                initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                {/* Icon in pill-shaped container */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-card-lg)',
                  backgroundColor: 'rgba(250, 75, 28, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--brand-primary)',
                }}>
                  {feature.icon}
                </div>

                <div>
                  <h3 style={{ marginBottom: '8px', fontSize: '1.125rem', fontWeight: 700 }}>{feature.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.55, fontSize: '0.9375rem' }}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mockup Image */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ order: isRtl ? 1 : 2, display: 'flex', justifyContent: 'center' }}
          >
            <img 
              src="/assets/mockup-dashboard.png" 
              alt="Auto Wise Dashboard" 
              style={{
                width: '100%',
                maxWidth: '500px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-elevated)',
                transform: 'rotate(-2deg)'
              }}
            />
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .features-layout {
            grid-template-columns: 1fr !important;
          }
          .features-layout > div:last-child {
            order: -1 !important;
            margin-bottom: 32px;
          }
        }
        @media (max-width: 600px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
