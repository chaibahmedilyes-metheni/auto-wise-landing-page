import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Search, User, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user.');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Customers</h1>
        <p>Manage all registered drivers.</p>
      </div>

      <div className="dashboard-charts" style={{ marginTop: '24px' }}>
        <div className="chart-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '16px' }}>
            <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search customers..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
              />
            </div>
            <div style={{ padding: '12px 24px', background: 'rgba(33, 44, 250, 0.08)', color: 'var(--brand-secondary)', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} /> Total: {users.length}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-page)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Customer Info</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Location</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Joined</th>
                  <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {loading ? (
                    <tr><td colSpan="4" style={{ padding: '48px', textAlign: 'center' }}>Loading...</td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan="4" style={{ padding: '48px', textAlign: 'center' }}>No customers found.</td></tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontWeight: 600 }}>{user.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user.email} • {user.phone}</div>
                        </td>
                        <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{user.state}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {new Date(user.created_at).toLocaleDateString()}</div>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <button onClick={() => deleteUser(user.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
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
