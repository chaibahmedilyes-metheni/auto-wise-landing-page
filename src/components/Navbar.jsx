import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const isRtl = i18n.dir() === 'rtl';

  const toggleLang = () => {
    const newLang = i18n.language === 'ar' ? 'fr' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const navLinks = [
    { id: 'features', label: t('nav_features') },
    { id: 'how-it-works', label: t('nav_how') },
    { id: 'faq', label: t('nav_faq') },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="uber-navbar" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border)' }}>
      <div className="container uber-navbar-container">
        
        {/* Logo */}
        <button onClick={() => scrollToSection('home')} className="uber-logo-btn">
          <img
            src="/assets/Auto wise logo.png"
            alt="Auto Wise"
            style={{ height: '32px', objectFit: 'contain' }}
          />
        </button>

        {/* Desktop Links */}
        <div className="uber-nav-links hidden-mobile">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="uber-nav-link"
              style={{ color: 'var(--text-primary)' }}
            >
              {link.label}
            </button>
          ))}
          
          <button onClick={toggleLang} className="uber-lang-btn" style={{ color: 'var(--text-primary)', background: 'var(--chip-bg)' }}>
            <Globe size={16} />
            <span>{i18n.language === 'ar' ? 'Français' : 'العربية'}</span>
          </button>
          
          <button 
            onClick={() => scrollToSection('register')} 
            className="btn btn-primary"
            style={{ padding: '8px 16px', borderRadius: '4px', fontWeight: '500' }}
          >
            {t('nav_register')}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="hidden-desktop">
          <button onClick={() => setIsOpen(!isOpen)} className="uber-menu-btn">
            {isOpen ? <X size={24} color="#000" /> : <Menu size={24} color="#000" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="uber-mobile-menu"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="uber-mobile-link"
              >
                {link.label}
              </button>
            ))}
            <button onClick={toggleLang} className="uber-mobile-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} />
              {i18n.language === 'ar' ? 'Français' : 'العربية'}
            </button>
            <button 
              onClick={() => scrollToSection('register')} 
              className="uber-mobile-link"
              style={{ backgroundColor: '#fff', color: '#000', textAlign: 'center', marginTop: '16px' }}
            >
              {t('nav_register')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
