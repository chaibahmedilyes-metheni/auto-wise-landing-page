import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Search, Wrench, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Garages() {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGarages();
  }, []);

  const fetchGarages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('role', 'garage_owner')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setGarages(data || []);
    } catch (error) {
      console.error('Error fetching garages:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteGarage = async (id) => {
    if (!window.confirm("Are you sure you want to remove this garage?")) return;
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      setGarages(garages.filter(g => g.id !== id));
    } catch (error) {
      console.error('Error deleting garage:', error);
      alert('Failed to delete garage.');
    }
  };

  const filteredGarages = garages.filter(garage => 
    garage.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (garage.workshop_name && garage.workshop_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    garage.phone.includes(searchTerm)
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Garages</h1>
        <p>Manage registered workshop partners.</p>
      </div>

      <div className="dashboard-charts" style={{ marginTop: '24px' }}>
        <div className="chart-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '16px' }}>
            <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search garages by owner or workshop name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
              />
            </div>
            <div style={{ padding: '12px 24px', background: 'rgba(250, 75, 28, 0.08)', color: 'var(--brand-primary)', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wrench size={18} /> Total: {garages.length}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-page)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Workshop</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Owner Details</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Location</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Joined</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {loading ? (
                    <tr><td colSpan="5" style={{ padding: '48px', textAlign: 'center' }}>Loading...</td></tr>
                  ) : filteredGarages.length === 0 ? (
                    <tr><td colSpan="5" style={{ padding: '48px', textAlign: 'center' }}>No garages found.</td></tr>
                  ) : (
                    filteredGarages.map((garage) => (
                      <motion.tr key={garage.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {garage.workshop_name || 'N/A'}
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontWeight: 500 }}>{garage.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{garage.email} • {garage.phone}</div>
                        </td>
                        <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{garage.state}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {new Date(garage.created_at).toLocaleDateString()}</div>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <button onClick={() => deleteGarage(garage.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
