// Correcciones para pedidos.routes.js

import express from 'express';
import {
  obtenerTodosLosPedidos,
  obtenerPedidoPorId,
  crearPedidoCompleto,
  actualizarEstadoPedido,
  eliminarPedido,
  obtenerPedidosPorEstado,
  agregarProductosAlPedido,
  obtenerProductoDePedido,
  obtenerEstadisticasPedidos,
  pedidosPorFecha,
  obtenerResumenPedido,
  eliminarProductoDePedido
} from '../controllers/pedido.controller.js';

const router = express.Router();

// IMPORTANTE: El orden de las rutas importa. Las rutas más específicas deben ir ANTES que las genéricas

// Rutas de estadísticas (deben ir antes que /:id)
router.get('/estadisticas/resumen', obtenerEstadisticasPedidos);
router.get('/filtro/fecha', pedidosPorFecha);

// Rutas por estado (debe ir antes que /:id)
router.get('/estado/:estado', obtenerPedidosPorEstado);

// Rutas básicas de CRUD
router.get('/', obtenerTodosLosPedidos);
router.post('/', crearPedidoCompleto);

// Rutas específicas de pedido (van después de las rutas especiales)
router.get('/:id', obtenerPedidoPorId);
router.get('/:id/resumen', obtenerResumenPedido);
router.patch('/:id/estado', actualizarEstadoPedido);
router.delete('/:id', eliminarPedido);

// Rutas de productos dentro de pedidos
router.post('/:id/productos', agregarProductosAlPedido);

// CORREGIDO: Nombre de parámetro consistente con el controlador
router.get('/:idPedido/productos/:idDetallePedido', obtenerProductoDePedido);

//CORREGIDO: Esta ruta debe usar idDetallePedido, no idProducto
router.delete('/:id/productos/:idDetallePedido', eliminarProductoDePedido);

export default router;