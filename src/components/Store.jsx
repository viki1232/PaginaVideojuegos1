import { useEffect, useState } from 'react';
import { Star, ShoppingCart, Search, X, Plus, Edit, Trash2 } from 'lucide-react';
import { gamesData } from '../data/gamesData';  // ✅ IMPORTAR datos locales

function Store({ onNavigate, onAddToLibrary, currentUser }) {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [allStats, setAllStats] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingGame, setEditingGame] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Action',
        image_url: ''
    });

    const API_URL = 'http://localhost:2000/api';
    const categories = ['All', 'Action', 'Adventure', 'RPG', 'Racing', 'Strategy', 'Puzzle', 'Platform'];

    useEffect(() => {
        loadAllGames();
        loadAllStatsOnce();
    }, []);


    const loadAllGames = async () => {
        console.log('🔄 Iniciando carga de juegos...');
        setLoading(true);
        try {
            // Cargar juegos de MongoDB
            const response = await fetch(`${API_URL}/games`);
            console.log('📡 Response status:', response.status);

            let mongoGames = [];

            if (response.ok) {
                mongoGames = await response.json();
                console.log('📦 Juegos de MongoDB:', mongoGames);
                console.log('📦 Cantidad:', mongoGames.length);
            } else {
                console.error('❌ Error en response:', response.status);
            }


            console.log('📚 Juegos locales:', gamesData.length);
            const allGames = [...gamesData, ...mongoGames];
            console.log('🎯 Todos los juegos antes de deduplicar:', allGames.length);


            const uniqueGames = allGames.reduce((acc, game) => {
                if (!acc.find(g => g.id === game.id)) {
                    acc.push(game);
                }
                return acc;
            }, []);

            console.log('🎮 Total de juegos únicos:', uniqueGames.length);
            console.log('🎮 Juegos finales:', uniqueGames);
            setGames(uniqueGames);

        } catch (error) {
            console.error('❌ Error cargando juegos:', error);

            setGames(gamesData);
        } finally {
            setLoading(false);
        }
    };


    const loadAllStatsOnce = async () => {
        try {
            const response = await fetch(`${API_URL}/reviews/stats/bulk`);
            if (response.ok) {
                const stats = await response.json();
                setAllStats(stats);
            }
        } catch (error) {
            console.error('Error cargando stats:', error);
        }
    };

    const filterGames = () => {
        let filtered = selectedCategory === 'All'
            ? games
            : games.filter(game => game.category === selectedCategory);

        if (searchTerm.trim()) {
            filtered = filtered.filter(game =>
                game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                game.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingGame
                ? `${API_URL}/games/${editingGame.id}`
                : `${API_URL}/games`;

            const method = editingGame ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(editingGame ? '✅ Juego actualizado' : '✅ Juego creado');
                handleCancelForm();
                loadAllGames();
            } else {
                alert('❌ Error al guardar');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error de conexión');
        }
    };

    const handleEdit = (game) => {

        if (!game._id) {
            alert('⚠️ Los juegos locales no se pueden editar. Solo los que agregaste.');
            return;
        }

        setEditingGame(game);
        setFormData({
            title: game.title,
            description: game.description,
            price: game.price,
            category: game.category,
            image_url: game.image_url
        });
        setShowForm(true);
    };

    const handleDelete = async (game) => {

        if (!game._id) {
            alert('⚠️ Los juegos locales no se pueden eliminar. Solo los que agregaste.');
            return;
        }

        if (!confirm('¿Eliminar este juego?')) return;

        try {
            const response = await fetch(`${API_URL}/games/${game.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('✅ Juego eliminado');
                loadAllGames();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingGame(null);
        setFormData({
            title: '',
            description: '',
            price: '',
            category: 'Action',
            image_url: ''
        });
    };

    const filteredGames = filterGames();

    return (
        <div className="store-container">
            {/* Header con botón flotante */}
            <div className="store-header">
                <div className="store-header-content">
                    <h1 className="store-title">Game Store</h1>
                    <p className="store-subtitle">Explora y compra tu próximo juego favorito</p>
                </div>
            </div>


            <button
                className="btn-add-game-floating"
                onClick={() => setShowForm(true)}
                title="Agregar nuevo juego"
            >
                <Plus size={24} />
            </button>


            {showForm && (
                <div className="modal-overlay" onClick={handleCancelForm}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingGame ? 'Editar Juego' : 'Nuevo Juego'}</h2>
                            <button onClick={handleCancelForm} className="close-btn">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="game-form">
                            <div className="form-group">
                                <label>Título *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    placeholder="Ej: Cyber Warriors 2077"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Descripción *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    placeholder="Describe el juego..."
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Precio (USD) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleFormChange}
                                        placeholder="59.99"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Categoría *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        {categories.filter(c => c !== 'All').map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>URL de Imagen *</label>
                                <input
                                    type="url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleFormChange}
                                    placeholder="https://images.unsplash.com/..."
                                    required
                                />
                            </div>

                            {formData.image_url && (
                                <div className="image-preview">
                                    <img src={formData.image_url} alt="Preview" />
                                </div>
                            )}

                            <div className="form-actions">
                                <button type="submit" className="btn-submit">
                                    {editingGame ? 'Actualizar' : 'Crear'} Juego
                                </button>
                                <button type="button" onClick={handleCancelForm} className="btn-cancel">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="store-content">

                <div className="search-section">
                    <div className="search-container">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar juegos..."
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
                            {filteredGames.length} juego{filteredGames.length !== 1 ? 's' : ''} encontrado{filteredGames.length !== 1 ? 's' : ''} para "{searchTerm}"
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
                        {filteredGames.map((game) => (
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

                                        {game._id && (
                                            <span className="custom-badge">Personalizado</span>
                                        )}
                                    </div>
                                </button>
                                <div className="game-details">
                                    <button
                                        onClick={() => onNavigate('game', game.id)}
                                        className="game-title-button"
                                    >
                                        <h3 className="game-title">{game.title}</h3>
                                    </button>
                                    <p className="game-description">{game.description}</p>
                                    <div className="game-meta">
                                        <div className="game-rating">
                                            <Star className="star-icon" />
                                            <span className="rating-text">
                                                {allStats[game.id]?.average_rating > 0
                                                    ? allStats[game.id].average_rating
                                                    : 'NA'
                                                }/5
                                            </span>
                                        </div>
                                        <span className="game-category">{game.category}</span>
                                    </div>

                                    <div className="game-footer">
                                        <span className="game-price">${game.price}</span>
                                        <div className="game-actions">
                                            <button
                                                className="add-to-library-button"
                                                onClick={() => onAddToLibrary(game)}
                                            >
                                                <ShoppingCart size={16} />
                                                Agregar
                                            </button>


                                            {game._id && (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(game)}
                                                        className="btn-edit-small"
                                                        title="Editar juego"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(game)}
                                                        className="btn-delete-small"
                                                        title="Eliminar juego"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredGames.length === 0 && (
                    <div className="empty-state">
                        <p className="empty-state-text">No se encontraron juegos en esta categoría</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Store;