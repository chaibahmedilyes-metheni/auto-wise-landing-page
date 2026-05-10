import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TrendingUp, Settings, Award, ArrowRight } from 'lucide-react';

export default function GarageBenefits() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const benefits = [
    { icon: <TrendingUp size={24} />, title: t('garage_benefit_1_title'), desc: t('garage_benefit_1_desc') },
    { icon: <Settings size={24} />, title: t('garage_benefit_2_title'), desc: t('garage_benefit_2_desc') },
    { icon: <Award size={24} />, title: t('garage_benefit_3_title'), desc: t('garage_benefit_3_desc') },
  ];

  const handleJoinClick = () => {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('setRole', { detail: 'garage_owner' }));
  };

  return (
    <section id="garage-benefits" style={{ backgroundColor: 'var(--bg-page)', overflow: 'hidden' }}>
      <div className="container">
        <div className="garage-layout" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '64px',
          alignItems: 'center',
        }}>
          {/* Left Side: Benefits Text & Grid */}
          <div style={{ order: isRtl ? 2 : 1 }}>
            <motion.div
              initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: '48px' }}
            >
              <h2 style={{ marginBottom: '12px' }}>{t('garage_title')}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', lineHeight: 1.6, maxWidth: '520px' }}>
                {t('garage_subtitle')}
              </p>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  style={{
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '20px',
                    borderLeft: isRtl ? 'none' : '4px solid var(--brand-secondary)',
                    borderRight: isRtl ? '4px solid var(--brand-secondary)' : 'none',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-card-lg)',
                    backgroundColor: 'rgba(33, 44, 250, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-secondary)',
                    flexShrink: 0,
                  }}>
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '6px', fontSize: '1.125rem', fontWeight: 700 }}>{benefit.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.55, fontSize: '0.9375rem' }}>{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <button
                onClick={handleJoinClick}
                className="btn btn-primary"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
              >
                {t('garage_cta')}
                <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none', marginLeft: isRtl ? 0 : '8px', marginRight: isRtl ? '8px' : 0 }} />
              </button>
            </motion.div>
          </div>

          {/* Right Side: Mockup Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: isRtl ? -50 : 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              order: isRtl ? 1 : 2,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div style={{
              width: '100%',
              maxWidth: '380px',
              borderRadius: '32px',
              overflow: 'hidden',
              boxShadow: '0 32px 64px rgba(0,0,0,0.15)',
              border: '6px solid var(--white)',
              transform: isRtl ? 'rotate(-2deg)' : 'rotate(2deg)',
            }}>
              <img
                src="/assets/mockup-booking.png"
                alt="Garage Dashboard Mockup"
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .garage-layout { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}
