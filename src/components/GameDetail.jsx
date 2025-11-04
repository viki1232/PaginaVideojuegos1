import { useEffect, useState } from 'react';
import { Star, ShoppingCart, ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { gamesData } from '../data/gamesData';


function GameDetail({ gameId, onNavigate, onAddToLibrary }) {
    const [game, setGame] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [likeProcessing, setLikeProcessing] = useState(false);
    const [currentGame, setCurrentGame] = useState(null);
    const [stats, setStats] = useState({ average_rating: 0, total_reviews: 0 });

    const { user } = useAuth();

    // 🔹 URL de tu backend
    const API_URL = 'http://localhost:2000/api/reviews';

    useEffect(() => {
        if (gameId !== null && gameId !== undefined) {
            loadGame();
            loadReviews();
        }
    }, [gameId]);

    useEffect(() => {
        if (gameId) {
            const foundGame = gamesData.find(g => g.id === parseInt(gameId));
            setCurrentGame(foundGame);
        } else if (game) {
            setCurrentGame(game);
        }
    }, [gameId, game]);

    const loadGame = () => {
        setLoading(true);
        const gameData = gamesData.find(g => g.id === gameId);
        setTimeout(() => {
            setGame(gameData || null);
            setLoading(false);
        }, 300);
    };

    // 🔹 Cargar reviews desde MongoDB
    const loadReviews = async () => {
        try {
            console.log('📥 Cargando reviews del juego:', gameId);
            const response = await fetch(`${API_URL}/${gameId}`);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Reviews cargados:', data.length);
                setReviews(data);
                setReviews(data.reviews);  // El array de reviews
                setStats(data.stats);
            } else {
                console.error('❌ Error al cargar reviews:', response.status);
                setReviews([]);
            }
        } catch (error) {
            console.error('❌ Error conectando con el servidor:', error);
            setReviews([]);
        }
    };

    // 🔹 Crear nuevo review
    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('⚠️ Debes iniciar sesión para dejar un review');
            onNavigate('login');
            return;
        }

        setSubmitting(true);

        try {
            const reviewData = {
                game_id: gameId,
                user_id: user.id || user.email || 'guest',
                username: user.username || user.email?.split('@')[0] || 'Anonymous',
                rating: newRating,
                comment: newComment
            };

            console.log('📤 Enviando review:', reviewData);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Review creado:', data);
                alert('✅ Review guardado exitosamente!');
                setNewComment('');
                setNewRating(5);
                loadReviews(); // Recargar reviews
            } else {
                const error = await response.json();
                console.error('❌ Error del servidor:', error);
                alert('❌ Error al guardar review: ' + error.error);
            }
        } catch (error) {
            console.error('❌ Error de conexión:', error);
            alert('❌ Error conectando con el servidor');
        } finally {
            setSubmitting(false);
        }
    };



    // 🔹 Editar review existente
    const handleEditReview = async (reviewId) => {
        if (!editingReview) return;

        try {
            console.log('📝 Actualizando review:', reviewId);

            const response = await fetch(`${API_URL}/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating: editingReview.rating,
                    comment: editingReview.comment
                })
            });

            if (response.ok) {
                console.log('✅ Review actualizado');
                alert('✅ Review actualizado exitosamente!');
                setEditingReview(null);
                loadReviews();
            } else {
                const error = await response.json();
                alert('❌ Error al actualizar: ' + error.error);
            }
        } catch (error) {
            console.error('❌ Error actualizando review:', error);
            alert('❌ Error conectando con el servidor');
        }
    };

    // 🔹 Eliminar review
    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('¿Estás seguro de eliminar este review?')) {
            return;
        }

        try {
            console.log('🗑️ Eliminando review:', reviewId);

            const response = await fetch(`${API_URL}/${reviewId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log('✅ Review eliminado');
                alert('✅ Review eliminado exitosamente!');
                loadReviews();
            } else {
                const error = await response.json();
                alert('❌ Error al eliminar: ' + error.error);
            }
        } catch (error) {
            console.error('❌ Error eliminando review:', error);
            alert('❌ Error conectando con el servidor');
        }
    };
    const handlelikes = async (reviewId) => {
        if (likeProcessing) return;
        setLikeProcessing(true);

        try {
            const response = await fetch(`${API_URL}/${reviewId}/likes`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id // ← AGREGA ESTO (temporalmente hardcodeado)
                })


            });
            if (response.ok) {
                console.log('✅ Review liked');
                loadReviews(); // Recargar reviews para actualizar conteo de likes
            } else {
                const error = await response.json();
                console.error('❌ Error al dar like:', error);
                alert('❌ Error al dar like: ' + error.error);
            }
        } catch (error) {
            console.error('❌ Error conectando con el servidor:', error);
            alert('❌ Error conectando con el servidor');
        } finally {
            setLikeProcessing(false);
        }
    };



    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-text">Loading...</div>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="loading-container">
                <div className="loading-text">Game not found</div>
            </div>
        );
    }

    return (
        <div className="game-detail-container">
            <div className="game-detail-wrapper">
                <button onClick={() => onNavigate('store')} className="back-button">
                    <ArrowLeft size={20} />
                    Back to Store
                </button>

                <div className="game-detail-grid">
                    <div className="main-content">
                        <div className="image-card">
                            <div className="image-wrapper">
                                <img src={game.image_url} alt={game.title} className="game-image" />
                            </div>
                        </div>

                        <div className="info-card">
                            <h1 className="game-title">{game.title}</h1>
                            <div className="game-meta">
                                <div className="rating-container">
                                    <Star size={24} className="star-filled" />
                                    <span className="rating-text">{stats.average_rating > 0 ? stats.average_rating : 'Sin ratings'}/5</span>
                                </div>
                                <span className="category-badge">{game.category}</span>
                            </div>
                            <p className="game-description">{game.description}</p>
                        </div>

                        <div className="reviews-card">
                            <h2 className="reviews-title">Community Reviews ({reviews.length})</h2>

                            {user && (
                                <form onSubmit={handleSubmitReview} className="review-form">
                                    <h3 className="form-title">Write a Review</h3>
                                    <div className="form-group">
                                        <label className="form-label">Rating</label>
                                        <div className="star-rating">
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <button
                                                    key={rating}
                                                    type="button"
                                                    onClick={() => setNewRating(rating)}
                                                    className="star-button"
                                                >
                                                    <Star
                                                        size={32}
                                                        className={rating <= newRating ? 'star-active' : 'star-inactive'}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Comment</label>
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            className="comment-textarea"
                                            rows={4}
                                            placeholder="Share your thoughts about this game..."
                                            required
                                            minLength={10}
                                        />
                                    </div>
                                    <button type="submit" disabled={submitting} className="submit-button">
                                        {submitting ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            )}

                            {!user && (
                                <div className="login-prompt">
                                    <p>Inicia sesión para dejar un review</p>
                                    <button onClick={() => onNavigate('login')} className="login-button">
                                        Iniciar Sesión
                                    </button>
                                </div>
                            )}

                            <div className="reviews-list">
                                {reviews.map((review) => (
                                    <div key={review._id} className="review-item">
                                        {editingReview && editingReview._id === review._id ? (
                                            // 🔹 Modo edición
                                            <div className="review-edit-mode">
                                                <div className="form-group">
                                                    <label className="form-label">Rating</label>
                                                    <div className="star-rating">
                                                        {[1, 2, 3, 4, 5].map((rating) => (
                                                            <button
                                                                key={rating}
                                                                type="button"
                                                                onClick={() => setEditingReview({
                                                                    ...editingReview,
                                                                    rating
                                                                })}
                                                                className="star-button"
                                                            >
                                                                <Star
                                                                    size={24}
                                                                    className={rating <= editingReview.rating ? 'star-active' : 'star-inactive'}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <textarea
                                                    value={editingReview.comment}
                                                    onChange={(e) => setEditingReview({
                                                        ...editingReview,
                                                        comment: e.target.value
                                                    })}
                                                    className="comment-textarea"
                                                    rows={3}
                                                />
                                                <div className="edit-actions">
                                                    <button
                                                        onClick={() => handleEditReview(review._id)}
                                                        className="save-button"
                                                    >
                                                        Guardar
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingReview(null)}
                                                        className="cancel-button"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // 🔹 Modo visualización
                                            <>
                                                <div className="review-header">
                                                    <div className="user-avatar">
                                                        {review.username?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div className="review-user-info">
                                                        <p className="username">{review.username || 'User'}</p>
                                                        <div className="review-stars">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={14}
                                                                    className={i < review.rating ? 'star-filled-small' : 'star-empty-small'}
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className="review-date">
                                                            {new Date(review.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    {user && user.id === review.user_id && (
                                                        <div className="review-actions">
                                                            <button
                                                                onClick={() => setEditingReview(review)}
                                                                className="action-button edit-btn"
                                                                title="Editar"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteReview(review._id)}
                                                                className="action-button delete-btn"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handlelikes(review._id)}
                                                                className='Buttonlike'
                                                                title='like'>
                                                                👍 {review.likes || 0}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="review-comment">{review.comment}</p>
                                            </>
                                        )}
                                    </div>
                                ))}

                                {reviews.length === 0 && (
                                    <p className="no-reviews">
                                        No reviews yet. Be the first to review this game!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="sidebar">
                        <div className="purchase-card">
                            <div className="price">${game.price}</div>
                            <button className="purchase-button">
                                <ShoppingCart size={20} />
                                Purchase
                            </button>
                            <button
                                className="add-to-library-button1"
                                onClick={() => onAddToLibrary(currentGame)}
                            >
                                <ShoppingCart className="wishlist-button" />
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameDetail;