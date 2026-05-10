import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', bookings: 400, revenue: 2400 },
  { name: 'Feb', bookings: 300, revenue: 1398 },
  { name: 'Mar', bookings: 200, revenue: 9800 },
  { name: 'Apr', bookings: 278, revenue: 3908 },
  { name: 'May', bookings: 189, revenue: 4800 },
  { name: 'Jun', bookings: 239, revenue: 3800 },
  { name: 'Jul', bookings: 349, revenue: 4300 },
];

export default function Overview() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back, here's what's happening today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value">1,248</div>
          <div className="stat-trend positive">+12% from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Garages</div>
          <div className="stat-value">84</div>
          <div className="stat-trend positive">+3 new this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">3,492</div>
          <div className="stat-trend positive">+18% from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Monthly Revenue</div>
          <div className="stat-value">$42,500</div>
          <div className="stat-trend negative">-2% from last month</div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h2>Booking Trends</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="bookings" stroke="#FA4B1C" strokeWidth={3} dot={{ r: 4, fill: '#FA4B1C' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
