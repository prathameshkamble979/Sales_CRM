import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/dashboard">Sales CRM</Link>
            </div>
            <div className="navbar-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/leads">Leads</Link>
                {user && user.role === 'admin' && (
                    <Link to="/users">Users</Link>
                )}
            </div>
            <div className="navbar-user">
                <span>{user?.name} ({user?.role})</span>
                <button onClick={handleLogout} className="btn btn-sm btn-logout">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
