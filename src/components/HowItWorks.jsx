import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, CalendarCheck, Eye } from 'lucide-react';

export default function HowItWorks() {
  const { t, i18n } = useTranslation();

  const steps = [
    { num: '1', icon: <Search size={28} />, title: t('how_step_1_title'), desc: t('how_step_1_desc') },
    { num: '2', icon: <CalendarCheck size={28} />, title: t('how_step_2_title'), desc: t('how_step_2_desc') },
    { num: '3', icon: <Eye size={28} />, title: t('how_step_3_title'), desc: t('how_step_3_desc') },
  ];

  return (
    <section id="how-it-works" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '48px' }}
        >
          <h2 style={{ marginBottom: '12px' }}>{t('how_title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', lineHeight: 1.6, maxWidth: '480px' }}>
            {t('how_subtitle')}
          </p>
        </motion.div>

        <div className="how-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
        }}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              {/* Number circle */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 700,
              }}>
                {step.num}
              </div>

              <div>
                <h3 style={{ marginBottom: '8px', fontWeight: 700 }}>{step.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9375rem' }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .how-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
