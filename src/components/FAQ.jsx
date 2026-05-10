import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { supabase } from '../lib/supabase';

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        borderBottom: '1px solid var(--border)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 0',
        gap: '16px',
      }}>
        <h3 style={{
          fontSize: '1.0625rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.4,
        }}>
          {question}
        </h3>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'var(--chip-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background-color 0.15s',
        }}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              paddingBottom: '20px',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              fontSize: '0.9375rem',
              maxWidth: '640px',
            }}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const { t, i18n } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);
  const [faqs, setFaqs] = useState([]);

  // Hardcoded fallback FAQs from translations
  const fallbackFaqs = [
    { q: t('faq_1_q'), a: t('faq_1_a') },
    { q: t('faq_2_q'), a: t('faq_2_a') },
    { q: t('faq_3_q'), a: t('faq_3_a') },
    { q: t('faq_4_q'), a: t('faq_4_a') },
    { q: t('faq_5_q'), a: t('faq_5_a') },
  ];

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error || !data || data.length === 0) {
          setFaqs(fallbackFaqs);
          return;
        }

        const isAr = i18n.language === 'ar';
        setFaqs(data.map(f => ({
          q: isAr ? f.question_ar : f.question_fr,
          a: isAr ? f.answer_ar : f.answer_fr,
        })));
      } catch {
        setFaqs(fallbackFaqs);
      }
    };

    fetchFAQs();
  }, [i18n.language]);

  return (
    <section id="faq" style={{ backgroundColor: 'var(--chip-bg)' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '32px' }}
        >
          <h2>{t('faq_title')}</h2>
        </motion.div>

        <div style={{ borderTop: '1px solid var(--border)' }}>
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

