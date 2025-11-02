import perfil from '../models/perfil.js';

export const createJuego = async (req, res) => {
    try {
        const { game_id, user_id, username, game_title, game_price, game_image } = req.body;

        console.log('📝 Datos recibidos:', { game_id, user_id, username });

        // Validar campos requeridos
        if (!game_id || !user_id) {
            return res.status(400).json({
                error: 'Faltan campos requeridos',
                required: ['game_id', 'user_id']
            });
        }

        // ✅ Verificar si el juego ya existe en el perfil del usuario
        const existingGame = await perfil.findOne({
            game_id: parseInt(game_id),
            user_id: user_id
        });

        if (existingGame) {
            return res.status(409).json({
                error: 'El juego ya está en tu biblioteca',
                game: existingGame
            });
        }

        // Crear el nuevo juego en el perfil
        const newGame = new perfil({
            game_id: parseInt(game_id),
            user_id,
            username: username || 'Anonymous',
            game_title: game_title || 'Unknown Game',
            game_price: game_price || 0,
            game_image: game_image || '',
            added_at: new Date()
        });

        // Guardar en MongoDB
        await newGame.save();
        console.log('✅ Juego guardado en perfil:', newGame._id);

        res.status(201).json({
            message: 'Juego agregado a tu biblioteca',
            game: newGame
        });

    } catch (error) {
        console.error('❌ Error al agregar juego:', error);
        res.status(500).json({
            error: 'Error al agregar juego al perfil',
            details: error.message
        });
    }
};

// ✅ Obtener todos los juegos del perfil de un usuario
export const getUserGames = async (req, res) => {
    try {
        const { user_id } = req.params;

        const games = await perfil.find({ user_id }).sort({ added_at: -1 });

        res.status(200).json({
            message: 'Juegos obtenidos exitosamente',
            games: games
        });

    } catch (error) {
        console.error('❌ Error al obtener juegos:', error);
        res.status(500).json({
            error: 'Error al obtener juegos',
            details: error.message
        });
    }
};

// ✅ Eliminar un juego del perfil
export const deleteUserGame = async (req, res) => {
    try {
        const { user_id, game_id } = req.params;

        const deletedGame = await perfil.findOneAndDelete({
            user_id,
            game_id: parseInt(game_id)
        });

        if (!deletedGame) {
            return res.status(404).json({
                error: 'Juego no encontrado en tu biblioteca'
            });
        }

        res.status(200).json({
            message: 'Juego eliminado de tu biblioteca',
            game: deletedGame
        });

    } catch (error) {
        console.error('❌ Error al eliminar juego:', error);
        res.status(500).json({
            error: 'Error al eliminar juego',
            details: error.message
        });
    }
};