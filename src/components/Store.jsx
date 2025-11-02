import { useEffect, useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { gamesData } from '../data/gamesData';  // ← IMPORTAR


function Store({ onNavigate }) {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        loadGames();
    }, [selectedCategory]);

    const loadGames = () => {
        setLoading(true);

        // ELIMINAR el try-catch con fetch, usar datos locales directamente
        const filteredGames = selectedCategory === 'All'
            ? gamesData
            : gamesData.filter(game => game.category === selectedCategory);

        setTimeout(() => {
            setGames(filteredGames);
            setLoading(false);
        }, 300);
    };

    const categories = ['All', 'Action', 'Adventure', 'RPG', 'Racing', 'Strategy', 'Puzzle', 'Platform'];

    return (
        <div className="store-container">
            <div className="store-header">
                <div className="store-header-content">
                    <h1 className="store-title">Game Store</h1>
                    <p className="store-subtitle">Browse and purchase your next favorite game</p>
                </div>
            </div>

            <div className="store-content">
                <div className="categories-section">
                    <div className="categories-container">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`category-button ${selectedCategory === category ? 'active' : 'inactive'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="games-grid">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="skeleton-card" />
                        ))}
                    </div>
                ) : (
                    <div className="games-grid">
                        {games.map((game) => (
                            <div key={game.id} className="game-card">
                                <button
                                    onClick={() => onNavigate('game', game.id)}
                                    className="game-image-button"
                                >
                                    <div className="game-image-container">
                                        <img
                                            src={game.image_url}
                                            alt={game.title}
                                            className="game-image"
                                        />
                                    </div>
                                </button>
                                <div className="game-details">
                                    <button
                                        onClick={() => onNavigate('game', game.id)}
                                        className="game-title-button"
                                    >
                                        <h3 className="game-title">
                                            {game.title}
                                        </h3>
                                    </button>
                                    <p className="game-description">{game.description}</p>
                                    <div className="game-meta">
                                        <div className="game-rating">
                                            <Star className="star-icon" />
                                            <span className="rating-text">{game.rating}/5</span>
                                        </div>
                                        <span className="game-category">{game.category}</span>
                                    </div>
                                    <div className="game-footer">
                                        <span className="game-price">${game.price}</span>
                                        <button className="add-to-library-button">
                                            <ShoppingCart className="cart-icon" />
                                            Add to Library
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && games.length === 0 && (
                    <div className="empty-state">
                        <p className="empty-state-text">No games found in this category</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Store;