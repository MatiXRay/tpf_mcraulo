import express from 'express';
import {
  obtenerTodosLosProductos,
  obtenerProductoPorId,
  obtenerProductosPorCategoria,
  calcularPrecioPersonalizado,
  crearProducto // Importamos la nueva función del controlador
} from '../controllers/producto.controller.js';
import upload from '../utils/multer.js'; // Importamos multer

const router = express.Router();

// ===== RUTAS DE PRODUCTOS =====

// 1. GET /api/productos - Obtener todos los productos
router.get('/', obtenerTodosLosProductos);

// 2. POST /api/productos - Crear un nuevo producto (NUEVA RUTA)
// Usamos el middleware para indicar que subiremos un solo archivo llamado 'imagen'
router.post('/', upload.single('imagen'), crearProducto);

// 3. GET /api/productos/categoria/:categoria - Productos por categoría
router.get('/categoria/:categoria', obtenerProductosPorCategoria);

// 4. GET /api/productos/:id - Producto específico
router.get('/:id', obtenerProductoPorId);

// 5. POST /api/productos/:id/calcular-precio - Calcular precio personalizado
router.post('/:id/calcular-precio', calcularPrecioPersonalizado);

export default router;