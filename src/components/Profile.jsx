import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Trophy, Star, X } from 'lucide-react';

const Profile = ({ onNavigate }) => {
    const { user, profile } = useAuth();
    const [userGames, setUserGames] = useState([]); // ✅ Estado local para juegos
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(false);

    // ✅ Cargar juegos cuando el usuario inicia sesión
    useEffect(() => {
        if (user) {
            loadUserGames();
        }
    }, [user]);

    // ✅ Actualizar stats cuando cambien los juegos
    useEffect(() => {
        if (userGames.length > 0) {
            setStats({
                total_games: userGames.length,
                completed_games: stats?.completed_games || 0,
                total_hours: stats?.total_hours || 0
            });
        }
    }, [userGames]);

    // ✅ Cargar juegos desde el backend
    const loadUserGames = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:2000/api/perfil/games/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setUserGames(data.games || []);
                console.log('✅ Juegos cargados:', data.games?.length || 0);
            }
        } catch (error) {
            console.error('❌ Error cargando juegos:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Eliminar juego de la biblioteca
    const removeGame = async (gameId) => {
        try {
            const response = await fetch(`http://localhost:2000/api/perfil/games/${user.id}/${gameId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setUserGames(userGames.filter(game => game.game_id !== gameId));
                console.log('✅ Juego eliminado');
                alert('Juego eliminado de tu biblioteca');
            }
        } catch (error) {
            console.error('❌ Error eliminando juego:', error);
            alert('Error al eliminar juego');
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
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="profile-info">
                    <h1 className="profile-username">{user.username || 'User'}</h1>
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
                                <div className="stat-value">{userGames?.length || 0}</div>
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

                        {loading ? (
                            <p>Loading games...</p>
                        ) : userGames && userGames.length > 0 ? (
                            <div className="library-grid">
                                {userGames.map((game) => (
                                    <div key={game.game_id} className="game-card">
                                        <button
                                            className="remove-game-btn"
                                            onClick={() => removeGame(game.game_id)}
                                            title="Remove from library"
                                        >
                                            <X size={16} />
                                        </button>
                                        <img
                                            src={game.game_image}
                                            alt={game.game_title}
                                            onClick={() => onNavigate('game', game.game_id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <h3>{game.game_title}</h3>
                                        <p>${game.game_price}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
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