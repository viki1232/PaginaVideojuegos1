import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Trophy, Star, X } from 'lucide-react';

const Profile = ({ onNavigate }) => {
    const { user, profile } = useAuth();
    const [userGames, setUserGames] = useState([]);
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
            const completados = userGames.filter(game => game.completado).length;
            const totalHoras = userGames.reduce((sum, game) => sum + (game.horas_jugadas || 0), 0);

            setStats({
                total_games: userGames.length,
                completed_games: completados,
                total_hours: totalHoras
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

    // ✅ Marcar como completado
    const toggleCompletado = async (gameId, currentStatus) => {
        console.log('🔄 toggleCompletado llamado');
        console.log('📝 Datos:', {
            gameId,
            tipo: typeof gameId,
            currentStatus,
            userId: user.id
        });

        try {
            const url = `http://localhost:2000/api/perfil/juego/${user.id}/${gameId}/completado`;
            console.log('📍 URL completa:', url);

            const body = { completado: !currentStatus };
            console.log('📦 Body a enviar:', body);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            console.log('📨 Response status:', response.status);
            console.log('📨 Response ok:', response.ok);

            const data = await response.json();
            console.log('📨 Data recibida:', data);

            if (response.ok) {
                console.log('✅ Respuesta OK, actualizando estado...');

                // Actualizar el juego en el estado local
                setUserGames(prevGames => {
                    const updated = prevGames.map(game =>
                        game.game_id === gameId
                            ? { ...game, completado: data.game.completado }
                            : game
                    );
                    console.log('✅ Estado actualizado:', updated);
                    return updated;
                });
            } else {
                console.error('❌ Error del servidor:', data);
                alert('Error al actualizar: ' + data.error);
            }
        } catch (error) {
            console.error('❌ Error completo:', error);
            alert('Error al actualizar el juego: ' + error.message);
        }
    };

    // ✅ Agregar horas - VERSIÓN CON LOGS DETALLADOS
    const agregarHoras = async (gameId, horas) => {
        console.log('⏰ agregarHoras llamado');
        console.log('📝 Datos:', { gameId, horas, userId: user.id });

        const horasNum = parseFloat(horas);

        if (isNaN(horasNum) || horasNum <= 0) {
            alert('Ingresa un número válido');
            return false;
        }

        try {
            const url = `http://localhost:2000/api/perfil/juego/${user.id}/${gameId}/horas`;
            console.log('📍 URL completa:', url);

            const body = { horas: horasNum };
            console.log('📦 Body a enviar:', body);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            console.log('📨 Response status:', response.status);

            const data = await response.json();
            console.log('📨 Data recibida:', data);

            if (response.ok) {
                console.log('✅ Horas agregadas correctamente');

                // Actualizar el juego en el estado local
                setUserGames(prevGames => {
                    const updated = prevGames.map(game =>
                        game.game_id === gameId
                            ? { ...game, horas_jugadas: data.game.horas_jugadas }
                            : game
                    );
                    console.log('✅ Estado actualizado con nuevas horas');
                    return updated;
                });
                return true;
            } else {
                console.error('❌ Error del servidor:', data);
                alert('Error: ' + data.error);
                return false;
            }
        } catch (error) {
            console.error('❌ Error completo:', error);
            alert('Error al agregar horas: ' + error.message);
            return false;
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
                                    <GameCard
                                        key={game.game_id}
                                        game={game}
                                        userId={user.id}
                                        onRemove={removeGame}
                                        onToggleCompletado={toggleCompletado}
                                        onAgregarHoras={agregarHoras}
                                        onNavigate={onNavigate}
                                    />
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

// ✅ Componente separado para cada tarjeta de juego
const GameCard = ({ game, userId, onRemove, onToggleCompletado, onAgregarHoras, onNavigate }) => {
    const [mostrarInput, setMostrarInput] = useState(false);
    const [horasInput, setHorasInput] = useState('');

    console.log('🎮 GameCard renderizado para:', game.game_title, {
        game_id: game.game_id,
        completado: game.completado,
        horas_jugadas: game.horas_jugadas
    });

    const handleAgregarHoras = async () => {
        console.log('➕ handleAgregarHoras llamado');
        const success = await onAgregarHoras(game.game_id, horasInput);
        if (success) {
            setHorasInput('');
            setMostrarInput(false);
        }
    };

    const handleCheckboxChange = () => {
        console.log('☑️ Checkbox clickeado para:', game.game_title);
        console.log('📝 Estado actual completado:', game.completado);
        onToggleCompletado(game.game_id, game.completado);
    };

    return (
        <div className={`game-card ${game.completado ? 'completado' : ''}`}>
            <button
                className="remove-game-btn"
                onClick={() => onRemove(game.game_id)}
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

            <div className="game-info">
                <h3>{game.game_title}</h3>
                <p className="game-price">${game.game_price}</p>
            </div>

            {/* ✅ Estado de completado */}
            <div className="game-status">
                <label className="checkbox-completado">
                    <input
                        type="checkbox"
                        checked={game.completado || false}
                        onChange={handleCheckboxChange}
                    />
                    <span>Completado {game.completado && '✓'}</span>
                </label>
            </div>

            {/* ✅ Horas jugadas */}
            <div className="horas-section">
                <p className="horas-total">
                    {(game.horas_jugadas || 0).toFixed(1)} horas jugadas
                </p>

                {!mostrarInput ? (
                    <button
                        className="btn-add-horas"
                        onClick={() => setMostrarInput(true)}
                    >
                        + Agregar horas
                    </button>
                ) : (
                    <div className="input-horas">
                        <input
                            type="number"
                            step="0.5"
                            min="0"
                            placeholder="Ej: 2.5"
                            value={horasInput}
                            onChange={(e) => setHorasInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAgregarHoras()}
                        />
                        <button onClick={handleAgregarHoras}>✓</button>
                        <button onClick={() => {
                            setMostrarInput(false);
                            setHorasInput('');
                        }}>✕</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;