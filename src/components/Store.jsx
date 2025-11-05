import { useEffect, useState } from 'react';
import { Star, ShoppingCart, Search, X } from 'lucide-react';
import { gamesData } from '../data/gamesData';


function Store({ onNavigate, onAddToLibrary, gameId }) {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [allStats, setAllStats] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [game, setGame] = useState(null);

    const API_URL = 'http://localhost:2000/api/reviews';
    useEffect(() => {
        loadAllStatsOnce();
    }, []);
    useEffect(() => {
        filterGames();

    }, [selectedCategory, searchTerm]);


    const loadAllStatsOnce = async () => {
        try {
            const response = await fetch(`${API_URL}/stats/bulk`);
            if (response.ok) {
                const stats = await response.json();
                console.log('📊 Stats cargados:', stats);
                setAllStats(stats);
            }
        } catch (error) {
            console.error('Error cargando stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterGames = () => {
        let filteredGames = selectedCategory === 'All'
            ? gamesData
            : gamesData.filter(game => game.category === selectedCategory);

        if (searchTerm.trim()) {
            filteredGames = filteredGames.filter(game =>
                game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                game.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setGames(filteredGames);
    };
    const clearSearch = () => {
        setSearchTerm('');
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
                <div className="search-section">
                    <div className="search-container">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search games..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button onClick={clearSearch} className="clear-search-btn">
                                <X size={18} />
                            </button>
                        )}
                    </div>
                    {searchTerm && (
                        <p className="search-results-text">
                            Found {games.length} game{games.length !== 1 ? 's' : ''} for "{searchTerm}"
                        </p>
                    )}
                </div>
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
                                            <span className="rating-text">{allStats[game.id]?.average_rating > 0
                                                ? allStats[game.id].average_rating
                                                : 'NA'
                                            }/5</span>
                                        </div>
                                        <span className="game-category">{game.category}</span>
                                    </div>
                                    <div className="game-footer">
                                        <span className="game-price">${game.price}</span>
                                        <button
                                            className="add-to-library-button"
                                            onClick={() => onAddToLibrary(game)}
                                        >
                                            <ShoppingCart className="wishlist-button" />
                                            Add to Wishlist
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