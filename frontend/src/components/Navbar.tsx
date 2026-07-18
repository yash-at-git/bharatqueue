import { Link } from 'react-router-dom';
import { LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const dashboardPath = user?.role === 'INSTITUTION'
    ? '/institution' : '/citizen';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🎫 BharatQueue
      </Link>

      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <span className="navbar-user">
              <User size={14} style={{ display: 'inline', marginRight: 4 }} />
              {user?.name}
            </span>
            <Link to={dashboardPath} className="btn btn-outline">
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <button onClick={logout} className="btn btn-danger">
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;