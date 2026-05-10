import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Save, GripVertical, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQManager() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setMessage({ type: 'error', text: 'Could not load FAQs. Make sure the "faqs" table exists in Supabase.' });
    } finally {
      setLoading(false);
    }
  };

  const addFAQ = () => {
    const newFaq = {
      id: `temp-${Date.now()}`,
      question_fr: '',
      answer_fr: '',
      question_ar: '',
      answer_ar: '',
      sort_order: faqs.length + 1,
      is_active: true,
      _isNew: true,
    };
    setFaqs([...faqs, newFaq]);
  };

  const updateFAQ = (index, field, value) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const deleteFAQ = async (index) => {
    const faq = faqs[index];
    if (!window.confirm('Delete this FAQ?')) return;

    if (!faq._isNew) {
      try {
        const { error } = await supabase.from('faqs').delete().eq('id', faq.id);
        if (error) throw error;
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        setMessage({ type: 'error', text: 'Failed to delete FAQ.' });
        return;
      }
    }

    setFaqs(faqs.filter((_, i) => i !== index));
    setMessage({ type: 'success', text: 'FAQ deleted.' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const saveAll = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      for (let i = 0; i < faqs.length; i++) {
        const faq = faqs[i];
        const payload = {
          question_fr: faq.question_fr,
          answer_fr: faq.answer_fr,
          question_ar: faq.question_ar,
          answer_ar: faq.answer_ar,
          sort_order: i + 1,
          is_active: faq.is_active,
        };

        if (faq._isNew) {
          const { data, error } = await supabase.from('faqs').insert([payload]).select();
          if (error) throw error;
          // Update the local ID with the real one
          if (data && data[0]) {
            faqs[i] = { ...data[0] };
          }
        } else {
          const { error } = await supabase.from('faqs').update(payload).eq('id', faq.id);
          if (error) throw error;
        }
      }

      setFaqs([...faqs]); // refresh state
      setMessage({ type: 'success', text: 'All FAQs saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      console.error('Error saving FAQs:', error);
      setMessage({ type: 'error', text: 'Failed to save. Check console for details.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>FAQ Manager</h1>
          <p>Control the questions displayed on the public website.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={addFAQ}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border)',
              background: 'var(--white)', cursor: 'pointer', fontWeight: 500,
            }}
          >
            <Plus size={18} /> Add FAQ
          </button>
          <button
            onClick={saveAll}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '8px', border: 'none',
              background: saving ? '#999' : 'var(--brand-primary)', color: '#fff',
              cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 600,
            }}
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Status Message */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: 500,
              backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: message.type === 'success' ? '#059669' : '#dc2626',
            }}
          >
            <AlertCircle size={16} />
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>Loading FAQs...</div>
      ) : faqs.length === 0 ? (
        <div className="chart-card" style={{ textAlign: 'center', padding: '64px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No FAQs yet. Click "Add FAQ" to create one.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="chart-card"
              style={{ padding: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <GripVertical size={18} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--brand-primary)' }}>
                    FAQ #{index + 1}
                  </span>
                  {faq._isNew && (
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(33,44,250,0.1)', color: 'var(--brand-secondary)', fontWeight: 600 }}>
                      NEW
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={faq.is_active}
                      onChange={(e) => updateFAQ(index, 'is_active', e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Active
                  </label>
                  <button
                    onClick={() => deleteFAQ(index)}
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* French Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    🇫🇷 Question (Français)
                  </label>
                  <input
                    type="text"
                    value={faq.question_fr}
                    onChange={(e) => updateFAQ(index, 'question_fr', e.target.value)}
                    placeholder="Question en français..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    🇫🇷 Answer (Français)
                  </label>
                  <textarea
                    value={faq.answer_fr}
                    onChange={(e) => updateFAQ(index, 'answer_fr', e.target.value)}
                    placeholder="Réponse en français..."
                    rows={3}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Arabic Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    🇩🇿 Question (العربية)
                  </label>
                  <input
                    type="text"
                    value={faq.question_ar}
                    onChange={(e) => updateFAQ(index, 'question_ar', e.target.value)}
                    placeholder="السؤال بالعربية..."
                    dir="rtl"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    🇩🇿 Answer (العربية)
                  </label>
                  <textarea
                    value={faq.answer_ar}
                    onChange={(e) => updateFAQ(index, 'answer_ar', e.target.value)}
                    placeholder="الإجابة بالعربية..."
                    dir="rtl"
                    rows={3}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
