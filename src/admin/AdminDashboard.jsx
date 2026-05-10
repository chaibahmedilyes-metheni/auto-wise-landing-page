import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './pages/Overview';
import Users from './pages/Users';
import Garages from './pages/Garages';
import Bookings from './pages/Bookings';
import Settings from './pages/Settings';
import './Admin.css';

export default function AdminDashboard() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header />
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/users" element={<Users />} />
            <Route path="/garages" element={<Garages />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
