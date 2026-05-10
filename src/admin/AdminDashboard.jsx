import { Routes, Route, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './pages/Overview';
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
            {/* Additional routes will go here (Garages, Users, Settings, etc.) */}
          </Routes>
        </div>
      </div>
    </div>
  );
}
