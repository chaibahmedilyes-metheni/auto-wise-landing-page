import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Wrench, Calendar, Settings, LogOut, HelpCircle } from 'lucide-react';

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <Calendar size={20} /> },
    { name: 'Garages', path: '/admin/garages', icon: <Wrench size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'FAQ Manager', path: '/admin/faq', icon: <HelpCircle size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <img src="/assets/Auto wise logo.png" alt="Auto Wise" className="admin-logo" style={{ filter: 'invert(1)' }} />
      </div>
      
      <nav className="admin-sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button className="admin-nav-item logout-btn" onClick={onLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
