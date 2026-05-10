import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './pages/Overview';
import Users from './pages/Users';
import Garages from './pages/Garages';
import Bookings from './pages/Bookings';
import Settings from './pages/Settings';
import FAQManager from './pages/FAQManager';
import Login from './pages/Login';
import './Admin.css';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always require fresh login — sign out any cached session on mount
    const enforceLogin = async () => {
      await supabase.auth.signOut();
      setUser(null);
      setLoading(false);
    };
    enforceLogin();

    // Listen for auth state changes (new login)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
      }}>
        <div style={{
          width: '32px', height: '32px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#FA4B1C',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not authenticated → show login
  if (!user) {
    return <Login onLogin={(u) => setUser(u)} />;
  }

  // Authenticated → show dashboard
  return (
    <div className="admin-layout">
      <Sidebar onLogout={handleLogout} />
      <div className="admin-main">
        <Header />
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/users" element={<Users />} />
            <Route path="/garages" element={<Garages />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/faq" element={<FAQManager />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
