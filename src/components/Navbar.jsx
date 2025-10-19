import { useState } from 'react';
import { Home, Compass, Store, User, Menu, X, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';


function Navbar({ currentView, onNavigate }) {
    const { user, signOut } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'discover', label: 'Discover', icon: Compass },
        { id: 'store', label: 'Store', icon: Store },
        { id: 'community', label: 'Community', icon: MessageSquare }
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-content">
                    <div className="navbar-left">
                        <button
                            onClick={() => onNavigate('home')}
                            className="logo-button"
                        >
                            EpicGameHub
                        </button>

                        <div className="nav-items-desktop">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => onNavigate(item.id)}
                                        className={`nav-item-button ${currentView === item.id ? 'active' : 'inactive'}`}
                                    >
                                        <Icon size={18} />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="auth-buttons-desktop">
                        {user ? (
                            <>
                                <button
                                    onClick={() => onNavigate('profile')}
                                    className="profile-button"
                                >
                                    <User size={18} />
                                    <span>Profile</span>
                                </button>
                                <button
                                    onClick={() => signOut()}
                                    className="signout-button"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => onNavigate('login')}
                                    className="login-button"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => onNavigate('signup')}
                                    className="signup-button"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        className="mobile-menu-button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="mobile-menu">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onNavigate(item.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`mobile-nav-button ${currentView === item.id ? 'active' : 'inactive'}`}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                        <div className="mobile-auth-section">
                            {user ? (
                                <>
                                    <button
                                        onClick={() => {
                                            onNavigate('profile');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="mobile-profile-button"
                                    >
                                        <User size={18} />
                                        <span>Profile</span>
                                    </button>
                                    <button
                                        onClick={() => signOut()}
                                        className="mobile-auth-button"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            onNavigate('login');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="mobile-auth-button"
                                    >
                                        Log In
                                    </button>
                                    <button
                                        onClick={() => {
                                            onNavigate('signup');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="mobile-auth-button"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;