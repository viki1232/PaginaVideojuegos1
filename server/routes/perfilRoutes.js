import express from 'express';
import { createJuego, getUserGames, deleteUserGame } from '../controllers/juegosController.js';

const router = express.Router();

// ✅ Agregar juego al perfil
router.post('/perfil/games', createJuego);

// ✅ Obtener juegos del usuario
router.get('/perfil/games/:user_id', getUserGames);

// ✅ Eliminar juego del perfil
router.delete('/perfil/games/:user_id/:game_id', deleteUserGame);

export default router;