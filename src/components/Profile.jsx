import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Trophy, Star } from 'lucide-react';

const Profile = ({ onNavigate }) => {
    const { user, profile } = useAuth();
    const [library, setLibrary] = useState([]);
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);

    // Datos de ejemplo para desarrollo
    const mockLibrary = [
        {
            id: 1,
            game_id: 0,
            hours_played: 45.5,
            is_completed: true,
            added_at: '2025-01-15',
            games: {
                title: 'Cyber Warriors 2077',
                cover_image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400'
            }
        },
        {
            id: 2,
            game_id: 1,
            hours_played: 23.2,
            is_completed: false,
            added_at: '2025-01-10',
            games: {
                title: 'Fantasy Quest',
                cover_image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400'
            }
        },
        {
            id: 3,
            game_id: 2,
            hours_played: 67.8,
            is_completed: true,
            added_at: '2025-01-05',
            games: {
                title: 'Dragon\'s Legacy',
                cover_image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400'
            }
        }
    ];

    const mockActivity = [
        {
            type: 'review',
            game: 'Cyber Warriors 2077',
            game_id: 0,
            time: '2025-01-20T10:30:00Z'
        },
        {
            type: 'review',
            game: 'Fantasy Quest',
            game_id: 1,
            time: '2025-01-18T15:45:00Z'
        },
        {
            type: 'review',
            game: 'Dragon\'s Legacy',
            game_id: 2,
            time: '2025-01-15T09:20:00Z'
        }
    ];

    useEffect(() => {
        if (user) {
            fetchLibrary();
            fetchStats();
            fetchRecentActivity();
        }
    }, [user]);

    const fetchLibrary = async () => {
        try {
            // Intentar cargar desde API/MongoDB
            const response = await fetch(`/api/library?userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setLibrary(data);
            } else {
                // Usar datos mock si falla
                setLibrary(mockLibrary);
            }
        } catch (error) {
            console.error('Error loading library:', error);
            // Usar datos mock en caso de error
            setLibrary(mockLibrary);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`/api/stats?userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            } else {
                // Calcular stats desde mockLibrary
                const totalGames = mockLibrary.length;
                const completedGames = mockLibrary.filter(g => g.is_completed).length;
                const totalHours = mockLibrary.reduce((acc, g) => acc + (g.hours_played || 0), 0);

                setStats({
                    total_games: totalGames,
                    completed_games: completedGames,
                    total_hours: totalHours
                });
            }
        } catch (error) {
            console.error('Error loading stats:', error);
            // Calcular stats desde mockLibrary
            const totalGames = mockLibrary.length;
            const completedGames = mockLibrary.filter(g => g.is_completed).length;
            const totalHours = mockLibrary.reduce((acc, g) => acc + (g.hours_played || 0), 0);

            setStats({
                total_games: totalGames,
                completed_games: completedGames,
                total_hours: totalHours
            });
        }
    };

    const fetchRecentActivity = async () => {
        try {
            const response = await fetch(`/api/activity?userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setRecentActivity(data);
            } else {
                // Usar datos mock
                setRecentActivity(mockActivity);
            }
        } catch (error) {
            console.error('Error loading activity:', error);
            // Usar datos mock
            setRecentActivity(mockActivity);
        }
    };

    if (!user) {
        return (
            <div className="profile-page">
                <div className="empty-state">
                    <p className="empty-message">Please log in to view your profile</p>
                    <button className="btn-primary" onClick={() => onNavigate('login')}>
                        Log In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-avatar">
                    {profile?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="profile-info">
                    <h1 className="profile-username">{profile?.username || 'User'}</h1>
                    <p className="profile-bio">{profile?.bio || 'Gaming enthusiast'}</p>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-sidebar">
                    <div className="stats-card">
                        <h3 className="stats-title">Statistics</h3>
                        <div className="stat-item">
                            <Trophy size={24} className="stat-icon trophy-icon" />
                            <div className="stat-details">
                                <div className="stat-value">{stats?.total_games || 0}</div>
                                <div className="stat-label">Games</div>
                            </div>
                        </div>
                        <div className="stat-item">
                            <Star size={24} className="stat-icon star-icon" />
                            <div className="stat-details">
                                <div className="stat-value">{stats?.completed_games || 0}</div>
                                <div className="stat-label">Completed</div>
                            </div>
                        </div>
                        <div className="stat-item">
                            <Clock size={24} className="stat-icon clock-icon" />
                            <div className="stat-details">
                                <div className="stat-value">{stats?.total_hours?.toFixed(1) || 0}h</div>
                                <div className="stat-label">Played</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-main">
                    <div className="library-section">
                        <h2 className="section-title">My Library</h2>
                        <div className="library-grid">
                            {library.map(item => (
                                <div
                                    key={item.id}
                                    className="library-item"
                                    onClick={() => onNavigate('game', item.game_id)}
                                >
                                    <div className="library-cover">
                                        {item.games?.cover_image ? (
                                            <img src={item.games.cover_image} alt={item.games.title} />
                                        ) : (
                                            <div className="game-placeholder"></div>
                                        )}
                                    </div>
                                    <div className="library-info">
                                        <h4 className="library-game-title">{item.games?.title}</h4>
                                        <p className="library-hours">{item.hours_played || 0}h played</p>
                                        {item.is_completed && (
                                            <span className="completed-badge">✓ Completed</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {library.length === 0 && (
                            <div className="empty-state-small">
                                <p className="empty-message-small">Your library is empty</p>
                                <button
                                    className="btn-secondary"
                                    onClick={() => onNavigate('store')}
                                >
                                    Browse Store
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="activity-section">
                        <h2 className="section-title">Recent Activity</h2>
                        <div className="activity-list">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="activity-item">
                                    <div className="activity-content">
                                        <p className="activity-text">
                                            Reviewed{' '}
                                            <span
                                                className="activity-game-link"
                                                onClick={() => onNavigate('game', activity.game_id)}
                                            >
                                                {activity.game}
                                            </span>
                                        </p>
                                        <p className="activity-time">
                                            {new Date(activity.time).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {recentActivity.length === 0 && (
                                <div className="empty-state-small">
                                    <p className="empty-message-small">No recent activity</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;