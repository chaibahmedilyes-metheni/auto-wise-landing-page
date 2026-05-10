import { Search, Bell, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="admin-header">
      <div className="admin-header-search">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search bookings, users, garages..." />
      </div>
      
      <div className="admin-header-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
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
