import express from 'express';
import {
  obtenerTodasLasCategorias,
  obtenerCategoriaPorId,
  obtenerResumenEstadisticasCategorias
} from '../controllers/categoria.controller.js';

const router = express.Router();

// ===== RUTAS DE CATEGORÍAS =====

// 1. GET /api/categorias - Obtener todas las categorías
// Soporta query params: ?incluirProductos=true, ?incluirEstadisticas=true
router.get('/', obtenerTodasLasCategorias);

// 2. GET /api/categorias/estadisticas/resumen - Estadísticas generales (debe ir antes que /:id)
router.get('/estadisticas/resumen', obtenerResumenEstadisticasCategorias);

// 3. GET /api/categorias/:id - Obtener categoría específica
// Soporta query params: ?incluirProductos=true, ?incluirEstadisticas=true
router.get('/:id', obtenerCategoriaPorId);

export default router;