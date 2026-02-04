import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NotificationBell from './NotificationBell'
import '../styles/header.css'

const Header = ({ title = 'FoodLoop', showBack = false, showNotifications = true }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setIsLoggedIn(true);
            try {
                setUser(JSON.parse(userData));
            } catch (e) {
                console.error('Error parsing user data');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        setShowDropdown(false);
        navigate('/');
        window.location.reload();
    };

    return (
        <header className="app-header">
            <div className="header-left">
                {showBack ? (
                    <Link to="/" className="header-back">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </Link>
                ) : (
                    <Link to="/" className="header-logo">
                        <span className="logo-icon">🍕</span>
                        <span className="logo-text">{title}</span>
                    </Link>
                )}
            </div>
            
            <div className="header-right">
                {!isLoggedIn ? (
                    <div className="auth-buttons">
                        <Link to="/user/login" className="header-btn header-btn-ghost">
                            Log in
                        </Link>
                        <Link to="/register" className="header-btn header-btn-primary">
                            Sign up
                        </Link>
                    </div>
                ) : (
                    <div className="header-user-section">
                        {showNotifications && <NotificationBell />}
                        
                        <div className="user-menu">
                            <button 
                                className="user-menu-trigger"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <div className="user-avatar">
                                    {user?.profilePic ? (
                                        <img src={user.profilePic} alt={user.name} />
                                    ) : (
                                        <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                                    )}
                                </div>
                                <svg className={`dropdown-arrow ${showDropdown ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>

                            {showDropdown && (
                                <>
                                    <div className="dropdown-overlay" onClick={() => setShowDropdown(false)}></div>
                                    <div className="dropdown-menu">
                                        <div className="dropdown-header">
                                            <span className="dropdown-user-name">{user?.name || 'User'}</span>
                                            <span className="dropdown-user-email">{user?.email}</span>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                            <span>👤</span> My Profile
                                        </Link>
                                        <Link to="/saved" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                            <span>🔖</span> Saved
                                        </Link>
                                        <Link to="/notifications" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                            <span>🔔</span> Notifications
                                        </Link>
                                        {user?.role === 'food-partner' && (
                                            <Link to="/create-food" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                                <span>➕</span> Create Post
                                            </Link>
                                        )}
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item dropdown-item-danger" onClick={handleLogout}>
                                            <span>🚪</span> Log out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header
