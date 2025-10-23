import express from 'express';
import {
  obtenerTodosLosIngredientes,
  obtenerIngredientePorId,
  obtenerEstadisticasIngredientes,
  buscarIngredientesPorTermino
} from '../controllers/ingrediente.controller.js';

const router = express.Router();

// ===== RUTAS DE INGREDIENTES =====

// 1. GET /api/ingredientes - Obtener todos los ingredientes
// Soporta query params: ?buscar=termino, ?precioMin=X&precioMax=Y, ?masUsados=true&limite=N
router.get('/', obtenerTodosLosIngredientes);

// 2. GET /api/ingredientes/estadisticas/resumen - Estadísticas generales (debe ir antes que /:id)
router.get('/estadisticas/resumen', obtenerEstadisticasIngredientes);

// 3. GET /api/ingredientes/buscar/:termino - Buscar ingredientes por término (debe ir antes que /:id)
router.get('/buscar/:termino', buscarIngredientesPorTermino);

// 4. GET /api/ingredientes/:id - Obtener ingrediente específico
// Soporta query param: ?incluirEstadisticas=true
router.get('/:id', obtenerIngredientePorId);

export default router;