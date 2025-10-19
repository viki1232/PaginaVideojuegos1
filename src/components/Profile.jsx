import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Trophy, Star } from 'lucide-react';



const Profile = ({ onNavigate }) => {
    const { user, profile } = useAuth();
    const [library, setLibrary] = useState([]);
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        if (user) {
            fetchLibrary();
            fetchStats();
            fetchRecentActivity();
        }
    }, [user]);

    const fetchLibrary = async () => {
        const { data } = await supabase
            .from('user_library')
            .select('*, games(*)')
            .eq('user_id', user.id)
            .order('added_at', { ascending: false })
            .limit(3);

        if (data) setLibrary(data);
    };

    const fetchStats = async () => {
        const { data } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (data) {
            setStats(data);
        } else {
            const { data: libraryData } = await supabase
                .from('user_library')
                .select('*')
                .eq('user_id', user.id);

            const totalGames = libraryData?.length || 0;
            const completedGames = libraryData?.filter(g => g.is_completed).length || 0;
            const totalHours = libraryData?.reduce((acc, g) => acc + (g.hours_played || 0), 0) || 0;

            setStats({ total_games: totalGames, completed_games: completedGames, total_hours: totalHours });
        }
    };

    const fetchRecentActivity = async () => {
        const { data: reviewsData } = await supabase
            .from('reviews')
            .select('*, games(title)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(3);

        const activities = (reviewsData || []).map(review => ({
            type: 'review',
            game: review.games?.title,
            time: review.created_at,
            game_id: review.game_id
        }));

        setRecentActivity(activities);
    };

    if (!user) {
        return (
            <div className="profile-page">
                <div className="empty-state">
                    <p>Please log in to view your profile</p>
                    <button className="btn-primary" onClick={() => onNavigate('login')}>Log In</button>
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
                    <h1>{profile?.username || 'User'}</h1>
                    <p>{profile?.bio || 'Gaming enthusiast'}</p>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-sidebar">
                    <div className="stats-card">
                        <h3>Statistics</h3>
                        <div className="stat-item">
                            <Trophy size={24} />
                            <div>
                                <div className="stat-value">{stats?.total_games || 0}</div>
                                <div className="stat-label">Games</div>
                            </div>
                        </div>
                        <div className="stat-item">
                            <Star size={24} />
                            <div>
                                <div className="stat-value">{stats?.completed_games || 0}</div>
                                <div className="stat-label">Completed</div>
                            </div>
                        </div>
                        <div className="stat-item">
                            <Clock size={24} />
                            <div>
                                <div className="stat-value">{stats?.total_hours?.toFixed(1) || 0}h</div>
                                <div className="stat-label">Played</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-main">
                    <div className="library-section">
                        <h2>My Library</h2>
                        <div className="library-grid">
                            {library.map(item => (
                                <div key={item.id} className="library-item" onClick={() => onNavigate('game', item.game_id)}>
                                    <div className="library-cover">
                                        {item.games?.cover_image ? (
                                            <img src={item.games.cover_image} alt={item.games.title} />
                                        ) : (
                                            <div className="game-placeholder"></div>
                                        )}
                                    </div>
                                    <div className="library-info">
                                        <h4>{item.games?.title}</h4>
                                        <p>{item.hours_played || 0}h played</p>
                                        {item.is_completed && <span className="completed-badge">Completed</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {library.length === 0 && (
                            <div className="empty-state-small">
                                <p>Your library is empty</p>
                                <button className="btn-secondary" onClick={() => onNavigate('store')}>Browse Store</button>
                            </div>
                        )}
                    </div>

                    <div className="activity-section">
                        <h2>Recent Activity</h2>
                        <div className="activity-list">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="activity-item">
                                    <div className="activity-content">
                                        <p className="activity-text">
                                            Reviewed <span onClick={() => onNavigate('game', activity.game_id)}>{activity.game}</span>
                                        </p>
                                        <p className="activity-time">
                                            {new Date(activity.time).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {recentActivity.length === 0 && (
                                <div className="empty-state-small">
                                    <p>No recent activity</p>
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