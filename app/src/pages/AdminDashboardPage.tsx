import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="admin-dashboard-page">
      <Header />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, {user?.username}!</h1>
          <p>Admin Dashboard</p>
        </div>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Movie Management</h3>
            <p>Manage movies in the system</p>
            <a href="/manage-movies" className="card-link">Go to Manage Movies</a>
          </div>
          <div className="dashboard-card">
            <h3>User Management</h3>
            <p>Manage users (Coming Soon)</p>
          </div>
          <div className="dashboard-card">
            <h3>Reports</h3>
            <p>View system reports (Coming Soon)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;