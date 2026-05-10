import { Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Bookings() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Active Bookings</h1>
        <p>Monitor real-time service appointments.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-charts" 
        style={{ marginTop: '24px' }}
      >
        <div className="chart-card" style={{ padding: '64px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(250, 75, 28, 0.1)',
            color: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={32} />
          </div>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Waitlist Mode Active</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.6 }}>
            The booking engine is currently disabled while Auto Wise is in the pre-launch waitlist phase. Once the platform officially launches, active appointments will appear here.
          </p>

          <div style={{ 
            marginTop: '16px', 
            padding: '12px 16px', 
            backgroundColor: 'rgba(245, 158, 11, 0.1)', 
            color: '#d97706', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            <AlertCircle size={16} />
            Data collection mode is active. Check "Overview" for registered leads.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
