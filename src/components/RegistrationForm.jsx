import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm as useHookForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Lock, CheckCircle2, ArrowRight, User, Wrench } from 'lucide-react';
import { supabase } from '../lib/supabase';

const wilayas = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna",
  "06 - Béjaïa", "07 - Biskra", "08 - Béchar", "09 - Blida", "10 - Bouira",
  "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou",
  "16 - Alger", "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda",
  "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine",
  "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla",
  "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arréridj", "35 - Boumerdès",
  "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela",
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma",
  "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane", "49 - Timimoun", "50 - Bordj Badji Mokhtar",
  "51 - Ouled Djellal", "52 - Béni Abbès", "53 - In Salah", "54 - In Guezzam", "55 - Touggourt",
  "56 - Djanet", "57 - El M'Ghair", "58 - El Meniaa"
];

export default function RegistrationForm() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [role, setRole] = useState('customer');
  const [status, setStatus] = useState('idle');
  const [liveStats, setLiveStats] = useState({ garages: '50+', users: '500+' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: garagesCount } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('role', 'garage_owner');
        const { count: usersCount } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('role', 'customer');
        
        setLiveStats({
          garages: garagesCount ? `${garagesCount}+` : '50+',
          users: usersCount ? `${usersCount}+` : '500+'
        });
      } catch (error) {
        console.error('Failed to fetch real stats:', error);
      }
    };
    fetchStats();

    const handleSetRole = (e) => {
      if (e.detail && (e.detail === 'customer' || e.detail === 'garage_owner')) {
        setRole(e.detail);
      }
    };
    window.addEventListener('setRole', handleSetRole);
    return () => window.removeEventListener('setRole', handleSetRole);
  }, []);

  const schema = yup.object({
    name: yup.string().required(t('validation_required')),
    phone: yup.string().required(t('validation_required')),
    email: yup.string().email(t('validation_email')).required(t('validation_required')),
    state: yup.string().required(t('validation_required')),
    workshop_name: role === 'garage_owner' ? yup.string().required(t('validation_required')) : yup.string().optional()
  });

  const { register, handleSubmit, formState: { errors }, reset } = useHookForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setStatus('submitting');
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role, lang: i18n.language }),
      });
      if (!response.ok) throw new Error('Backend registration failed');
      setStatus('success');
      reset();
    } catch (error) {
      console.error('Registration error:', error);
      setStatus('error');
    }
  };

  return (
    <section id="register" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="container">
        <div className="register-layout" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: '64px',
          alignItems: 'start',
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ order: isRtl ? 2 : 1, paddingTop: '16px' }}
          >
            <h2 style={{ marginBottom: '12px' }}>{t('form_title')}</h2>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1.0625rem',
              lineHeight: 1.65,
              marginBottom: '40px',
            }}>
              {t('form_subtitle')}
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              {[
                { num: liveStats.garages, label: t('stat_garages') },
                { num: '16', label: t('stat_cities') },
                { num: liveStats.users, label: t('stat_waitlist') },
                { num: '99%', label: t('stat_satisfaction') },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  style={{
                    padding: '20px',
                    backgroundColor: 'var(--chip-bg)',
                    borderRadius: 'var(--radius-card-lg)',
                    boxShadow: 'var(--shadow-float)'
                  }}
                >
                  <div style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--brand-primary)',
                    lineHeight: 1,
                    marginBottom: '4px',
                  }}>{stat.num}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Security */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 16px',
              backgroundColor: 'rgba(22, 163, 74, 0.06)',
              borderRadius: 'var(--radius-card)',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
            }}>
              <Lock size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
              {t('form_secure')}
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              order: isRtl ? 1 : 2,
              backgroundColor: 'var(--white)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-card-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-elevated)',
            }}
          >
            {/* Role Tabs — pill chips */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '28px',
            }}>
              <button
                id="tab-customer"
                onClick={() => setRole('customer')}
                className={`btn-chip ${role === 'customer' ? 'active' : ''}`}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                <User size={15} />
                {t('tab_customer')}
              </button>
              <button
                id="tab-garage"
                onClick={() => setRole('garage_owner')}
                className={`btn-chip ${role === 'garage_owner' ? 'active' : ''}`}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                <Wrench size={15} />
                {t('tab_garage')}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', padding: '40px 16px' }}
                >
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}>
                    <CheckCircle2 size={32} color="white" />
                  </div>
                  <h3 style={{ marginBottom: '8px' }}>{t('success_title')}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>{t('success_msg')}</p>
                  <button onClick={() => setStatus('idle')} className="btn btn-outline">
                    {t('success_back')}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="form-group">
                    <label className="form-label">{t('label_name')}</label>
                    <input {...register('name')} className="form-input" placeholder={t('placeholder_name')} />
                    {errors.name && <span className="form-error">{errors.name.message}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('label_phone')}</label>
                    <input {...register('phone')} className="form-input" placeholder={t('placeholder_phone')} dir="ltr" style={{ textAlign: isRtl ? 'right' : 'left' }} />
                    {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('label_email')}</label>
                    <input {...register('email')} type="email" className="form-input" placeholder={t('placeholder_email')} dir="ltr" style={{ textAlign: isRtl ? 'right' : 'left' }} />
                    {errors.email && <span className="form-error">{errors.email.message}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('label_state')}</label>
                    <select {...register('state')} className="form-input" style={{ appearance: 'none', cursor: 'pointer' }}>
                      <option value="" disabled hidden>{t('placeholder_state')}</option>
                      {wilayas.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                    {errors.state && <span className="form-error">{errors.state.message}</span>}
                  </div>

                  <AnimatePresence>
                    {role === 'garage_owner' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="form-group"
                      >
                        <label className="form-label">{t('label_workshop')}</label>
                        <input {...register('workshop_name')} className="form-input" placeholder={t('placeholder_workshop')} />
                        {errors.workshop_name && <span className="form-error">{errors.workshop_name.message}</span>}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {status === 'error' && (
                    <div style={{
                      color: 'var(--error)',
                      padding: '12px 16px',
                      backgroundColor: 'rgba(220, 38, 38, 0.06)',
                      borderRadius: 'var(--radius-card)',
                      marginBottom: '16px',
                      textAlign: 'center',
                      fontSize: '0.875rem',
                    }}>
                      {t('error_msg')}
                    </div>
                  )}

                  <button
                    id="submit-registration"
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '8px', padding: '14px', fontSize: '1rem' }}
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          style={{
                            width: '18px', height: '18px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTopColor: 'white',
                            borderRadius: '50%',
                          }}
                        />
                        {t('btn_submitting')}
                      </>
                    ) : (
                      <>
                        {t('btn_submit')}
                        <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .register-layout {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .register-layout > div:first-child { order: 1 !important; }
          .register-layout > div:last-child { order: 2 !important; }
        }
      `}</style>
    </section>
  );
}
