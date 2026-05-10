import { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch initial latest 5 leads as recent notifications
    const fetchRecentLeads = async () => {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (data) {
        setNotifications(data);
      }
    };

    fetchRecentLeads();

    // Subscribe to real-time inserts on the leads table
    const subscription = supabase
      .channel('leads_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'leads' }, 
        (payload) => {
          console.log('New lead received!', payload);
          setNotifications(prev => [payload.new, ...prev].slice(0, 10)); // Keep last 10
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    // Close dropdown on outside click
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      supabase.removeChannel(subscription);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      setUnreadCount(0); // clear unread when opened
    }
  };

  return (
    <header className="admin-header" style={{ position: 'relative' }}>
      <div className="admin-header-search">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search bookings, users, garages..." />
      </div>
      
      <div className="admin-header-actions">
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={handleNotificationClick}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="badge"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  marginTop: '12px',
                  width: '320px',
                  backgroundColor: 'var(--white)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-elevated)',
                  border: '1px solid var(--border)',
                  zIndex: 50,
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Recent Registrations</h3>
                </div>
                
                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No new registrations yet.
                    </div>
                  ) : (
                    notifications.map((notif, index) => (
                      <div 
                        key={notif.id || index}
                        style={{
                          padding: '16px',
                          borderBottom: '1px solid var(--border)',
                          backgroundColor: index < unreadCount ? 'rgba(33, 44, 250, 0.04)' : 'transparent',
                          transition: 'background-color 0.2s ease',
                          cursor: 'default'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            {notif.name}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                            {notif.role === 'customer' ? 'Driver' : 'Garage'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                          Registered from {notif.state}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <Clock size={12} />
                          {new Date(notif.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="admin-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="profile-info">
            <span className="name">Admin User</span>
            <span className="role">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
