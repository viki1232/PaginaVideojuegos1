import { useEffect, useState } from 'react';
import { ArrowRight, Star } from 'lucide-react';

function Home({ onNavigate }) {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGames();
    }, []);

    const loadGames = async () => {
        try {
            // Simular datos de juegos para el ejemplo
            const mockGames = [
                { id: 1, title: 'Epic Adventure', rating: 4.8, category: 'Action', image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400' },
                { id: 2, title: 'Space Warriors', rating: 4.5, category: 'Shooter', image_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400' },
                { id: 3, title: 'Dragon Quest', rating: 4.9, category: 'RPG', image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400' },
                { id: 4, title: 'Racing Legends', rating: 4.6, category: 'Racing', image_url: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400' },
                { id: 5, title: 'Mystery Manor', rating: 4.7, category: 'Puzzle', image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400' }
            ];

            setTimeout(() => {
                setGames(mockGames);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error loading games:', error);
            setLoading(false);
        }
    };

    const categories = [
        'Action', 'Adventure', 'RPG', 'Simulation', 'Strategy',
        'Sports', 'Puzzle', 'Casual', 'Multiplayer', 'Racing',
        'Horror', 'Indie', 'Fantasy', 'Platformer', 'Fighting'
    ];

    return (
        <div className="home-page">
            <div className="hero-section">
                <div className="hero-overlay">
                    <div className="hero-content">
                        <h1 className="title">
                            ¡Explora los últimos juegos y sumérgete en aventuras épicas!
                        </h1>
                        <p className="pd">Únete a nosotros para juegos épicos.</p>
                        <button
                            onClick={() => onNavigate('store')}
                            className="cta-button"
                        >
                            Start playing
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="content-container">
                <div className="section-margin">
                    <h2 className="section-title">Discover Trending Games</h2>
                    <p className="section-subtitle">Top picks of the month</p>

                    {loading ? (
                        <div className="loading-grid">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="loading-skeleton" />
                            ))}
                        </div>
                    ) : (
                        <div className="games-grid">
                            {games.map((game) => (
                                <button
                                    key={game.id}
                                    onClick={() => onNavigate('game', game.id)}
                                    className="game-button"
                                >
                                    <div className="game-image-container">
                                        <img
                                            src={game.image_url}
                                            alt={game.title}
                                        />
                                    </div>
                                    <div className="game-info">
                                        <h3 className="game-title">{game.title}</h3>
                                        <div className="game-meta">
                                            <div className="game-rating-display">
                                                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                                <span className="rating-text">{game.rating}</span>
                                            </div>
                                            <span className="category-text">{game.category}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="categories-section">
                    <h2 className="section-title">Game Categories</h2>
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => onNavigate('store')}
                                className="category-btn"
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="subscription-section">
                    <h2 className="section-title">Choose Your Subscription</h2>
                    <div className="subscription-grid">
                        <div className="subscription-card">
                            <h3>Basic</h3>
                            <div className="subscription-price">FREE</div>
                            <ul className="subscription-features">
                                <li>Access to basic games</li>
                                <li>5 download monthly</li>
                                <li>7 days trial</li>
                            </ul>
                            <button className="subscription-btn">
                                Start Free
                            </button>
                        </div>

                        <div className="subscription-card featured">
                            <h3>Pro</h3>
                            <div className="subscription-price">$50</div>
                            <ul className="subscription-features">
                                <li>Unlimited access</li>
                                <li>Exclusive titles</li>
                                <li>7 days trial</li>
                            </ul>
                            <button className="subscription-btn">
                                Start Pro
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;