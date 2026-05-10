import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Search, User, Wrench, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Overview() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, customer, garage_owner

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to remove this registration?")) return;
    
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      setLeads(leads.filter(lead => lead.id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete registration. Please check console.');
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.phone.includes(searchTerm);
    const matchesFilter = filter === 'all' || lead.role === filter;
    return matchesSearch && matchesFilter;
  });

  const totalCustomers = leads.filter(l => l.role === 'customer').length;
  const totalGarages = leads.filter(l => l.role === 'garage_owner').length;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Waitlist Management</h1>
        <p>Manage all users who registered for the upcoming launch.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Registrations</div>
          <div className="stat-value">{leads.length}</div>
          <div className="stat-trend positive">Live from Supabase</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Interested Customers</div>
          <div className="stat-value">{totalCustomers}</div>
          <div className="stat-trend positive">Drivers</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Interested Garages</div>
          <div className="stat-value">{totalGarages}</div>
          <div className="stat-trend positive">Workshops</div>
        </div>
      </div>

      <div className="dashboard-charts" style={{ marginTop: '32px' }}>
        <div className="chart-card" style={{ padding: '0', overflow: 'hidden' }}>
          
          {/* Table Header Controls */}
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search by name, email, or phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-page)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <button 
                onClick={() => setFilter('all')}
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: filter === 'all' ? 'var(--white)' : 'transparent', boxShadow: filter === 'all' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('customer')}
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: filter === 'customer' ? 'var(--white)' : 'transparent', boxShadow: filter === 'customer' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                Customers
              </button>
              <button 
                onClick={() => setFilter('garage_owner')}
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: filter === 'garage_owner' ? 'var(--white)' : 'transparent', boxShadow: filter === 'garage_owner' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                Garages
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-page)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>User</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Role & Details</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Location</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Registered</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {loading ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid #eee', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <p style={{ marginTop: '12px' }}>Loading registrations...</p>
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No registrations found.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <motion.tr 
                        key={lead.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, backgroundColor: '#fee2e2' }}
                        style={{ borderBottom: '1px solid var(--border)' }}
                      >
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lead.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{lead.email}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lead.phone}</div>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: '6px', 
                            padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                            backgroundColor: lead.role === 'customer' ? 'rgba(33, 44, 250, 0.1)' : 'rgba(250, 75, 28, 0.1)',
                            color: lead.role === 'customer' ? 'var(--brand-secondary)' : 'var(--brand-primary)'
                          }}>
                            {lead.role === 'customer' ? <User size={12} /> : <Wrench size={12} />}
                            {lead.role === 'customer' ? 'Customer' : 'Garage Owner'}
                          </span>
                          {lead.workshop_name && (
                            <div style={{ fontSize: '0.85rem', fontWeight: 500, marginTop: '8px' }}>
                              {lead.workshop_name}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          {lead.state}
                        </td>
                        <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={14} />
                            {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <button 
                            onClick={() => deleteLead(lead.id)}
                            style={{ 
                              background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', 
                              border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            title="Delete registration"
                          >
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
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
