import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export const Navbar = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          📊 Survey App
        </Link>

        <div className="navbar-menu">
          {token ? (
            <>
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/surveys" className="nav-link">
                Take Survey
              </Link>
              <Link to="/my-surveys" className="nav-link">
                My Surveys
              </Link>
              <Link to="/create-survey" className="nav-link">
                Create Survey
              </Link>
              <div className="user-info">
                <span className="username">{user?.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
