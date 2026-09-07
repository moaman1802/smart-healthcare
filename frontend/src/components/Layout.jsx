import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';
import Footer from './Footer';  // ✅ Add this import

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('userName') || 'User';
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
    return null;
  }

  // ... rest of your code

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* ... */}
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          {/* ... */}
        </header>

        <div className="content-area">
          <Outlet />
        </div>

        {/* ✅ Footer - Add this at the bottom */}
        <Footer />
      </main>
    </div>
  );
}

export default Layout;