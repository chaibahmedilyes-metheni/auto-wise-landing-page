import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import './Hero.css';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const handleRegisterClick = (role) => {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('setRole', { detail: role }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="uber-hero" id="home">
      {/* Fluent Breathing Background Image */}
      <motion.div 
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: "linear" }}
        className="uber-hero-bg"
      >
        <img src="/assets/hero-car.png" alt="Auto Wise Experience" />
        <div className="uber-hero-overlay"></div>
      </motion.div>

      <div className="container uber-hero-container">
        {/* White floating card typical of Uber's desktop UI */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="uber-hero-card" 
          style={{ [isRtl ? 'marginRight' : 'marginLeft']: 0 }}
        >
          <motion.h1 variants={itemVariants} className="uber-headline">
            {t('hero_title')}
          </motion.h1>
          <motion.p variants={itemVariants} className="uber-subtitle">
            {t('hero_subtitle')}
          </motion.p>

          <motion.div variants={itemVariants} className="uber-cta-group">
            <button 
              className="uber-btn uber-btn-primary"
              onClick={() => handleRegisterClick('customer')}
            >
              {t('hero_cta_primary')}
              <ArrowRight size={20} style={{ transform: isRtl ? 'scaleX(-1)' : 'none', marginLeft: isRtl ? 0 : '8px', marginRight: isRtl ? '8px' : 0 }} />
            </button>
            
            <button 
              className="uber-btn uber-btn-secondary"
              onClick={() => handleRegisterClick('garage_owner')}
            >
              {t('hero_cta_secondary')}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
