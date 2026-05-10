import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

export default function Settings() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Settings</h1>
        <p>Manage your admin account and platform preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginTop: '24px' }}>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="chart-card" 
          style={{ padding: '32px' }}
        >
          <h2 style={{ marginBottom: '24px', fontSize: '1.2rem', fontWeight: 600 }}>Profile Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
              <input type="text" defaultValue="Admin User" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
              <input type="email" defaultValue="admin@autowise-dz.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }} />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="chart-card" 
          style={{ padding: '32px' }}
        >
          <h2 style={{ marginBottom: '24px', fontSize: '1.2rem', fontWeight: 600 }}>Platform Settings</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
              <span>Enable Waitlist Registrations</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
              <span>Send Email Notifications for New Leads</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '18px', height: '18px' }} />
              <span>Maintenance Mode</span>
            </label>
          </div>
        </motion.div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button style={{ 
            background: 'var(--brand-primary)', color: 'white', padding: '12px 24px', 
            borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <Save size={18} /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
