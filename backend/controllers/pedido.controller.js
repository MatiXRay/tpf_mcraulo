// Correcciones para pedido.controller.js

import {
  getAllPedidos,
  getPedidoById,
  insertPedido,
  createPedidoCompleto,
  updateEstadoPedido,
  deletePedido,
  getPedidosByEstado,
  getDetalleProducto,
  getEstadisticasPedidos,
  getPedidosPorFecha,
  getResumenPedido,
  deleteProductoDePedido,
  insertarDetallePedido, 
  insertarAdicional,
  getPedidoConDetalles  // ← AGREGAR ESTE IMPORT QUE FALTABA
} from '../models/pedido.model.js';

import { validarEstado, estadosValidos } from '../utils/validateEstados.js';

// 1. Obtener todos los pedidos
export const obtenerTodosLosPedidos = async (req, res) => {
  try {
    const pedidos = await getAllPedidos();
    res.json(pedidos);
  } catch (err) {
    console.error('Error en obtenerTodosLosPedidos:', err);
    res.status(500).json({ error: 'Error al obtener pedidos', detalle: err.message });
  }
};

// 2. obtenerPedidoPorId
export const obtenerPedidoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const pedido = await getPedidoById(id);
    if (pedido.length === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
};

// 3. Crear nuevo pedido completo (CORREGIDO)
export const crearPedidoCompleto = async (req, res) => {
  try {
    const { fechaHora, idTipoContribuyente, idCliente, idCupon = null, productos } = req.body;

    // Validación básica
    if (!idTipoContribuyente || !idCliente || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        error: 'Debes enviar idTipoContribuyente, idCliente y productos (array con al menos un producto)'
      });
    }

    // Llamamos al modelo que maneja la transacción
    const nuevoPedido = await createPedidoCompleto({
      fechaHora,
      idTipoContribuyente,
      idCliente,
      idCupon,
      productos
    });

    // Consultamos el pedido con sus detalles para la respuesta
    const pedidoConDetalles = await getPedidoConDetalles(nuevoPedido.idpedido);

    return res.status(201).json(pedidoConDetalles);
  } catch (err) {
    console.error('Error en crearPedidoCompleto:', err);

    // Errores de validación controlada
    if (['INVALID_BODY', 'PRODUCTO_NOT_FOUND', 'INGREDIENTE_NOT_FOUND'].includes(err.code)) {
      return res.status(400).json({ error: err.message });
    }

    // Errores de Postgres comunes
    if (err.code === '23503') {
      return res.status(400).json({ error: 'Clave foránea inválida', detalle: err.detail });
    }
    if (err.code === '22P02') {
      return res.status(400).json({ error: 'Tipo de dato inválido', detalle: err.message });
    }

    // Otros
    return res.status(500).json({ error: 'Error interno al crear pedido', detalle: err.message });
  }
};

// 4. Actualizar estado de un pedido
export const actualizarEstadoPedido = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const actualizado = await updateEstadoPedido(id, estado);

    if (!actualizado) {
      return res.status(400).json({
        error: `Estado inválido. Usa: ${estadosValidos.join(', ')}`
      });
    }

    res.json({
      mensaje: 'Estado actualizado correctamente',
      pedido: actualizado
    });
  } catch (err) {
    console.error("Error en actualizarEstadoPedido:", err);
    res.status(500).json({
      error: 'Error al actualizar el estado del pedido',
      detalle: err.message
    });
  }
};

// 8. obtenerProductoDePedido (CORREGIDO)
export const obtenerProductoDePedido = async (req, res) => {
  const { idPedido, idDetallePedido } = req.params;

  // Validación de IDs
  if (isNaN(Number(idPedido)) || isNaN(Number(idDetallePedido))) {
    return res.status(400).json({ error: 'Los IDs deben ser números válidos' });
  }

  try {
    const detalle = await getDetalleProducto(idPedido, idDetallePedido);

    if (detalle.length === 0) {
      return res.status(404).json({ error: 'Detalle no encontrado en este pedido' });
    }

    res.json(detalle[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener detalle del producto', detalle: err.message });
  }
};

// Resto de funciones del controlador original...

// 5. Eliminar pedido
export const eliminarPedido = async (req, res) => {
  const { id } = req.params;

  try {
    const eliminado = await deletePedido(id);

    if (!eliminado) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json({ mensaje: 'Pedido eliminado', pedido: eliminado });
  } catch (err) {
    console.error("Error en eliminarPedido:", err);
    res.status(500).json({ error: 'Error al eliminar el pedido', detalle: err.message });
  }
};

// 6. Filtrar pedidos por estado
export const obtenerPedidosPorEstado = async (req, res) => {
  const { estado } = req.params;

  try {
    const pedidos = await getPedidosByEstado(estado);

    if (pedidos.length === 0) {
      return res.status(404).json({ mensaje: `No se encontraron pedidos con estado: ${estado}` });
    }

    res.json(pedidos);
  } catch (err) {
    console.error("Error en filtrarPorEstado:", err);
    res.status(500).json({ error: 'Error al filtrar por estado', detalle: err.message });
  }
};

// 7. Agregar productos a un pedido
export const agregarProductosAlPedido = async (req, res) => {
  const { id } = req.params;
  const { productos } = req.body;

  if (!Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: 'Se requiere al menos un producto para agregar' });
  }

  try {
    const resultados = [];

    for (const producto of productos) {
      const { idProducto, cantidad, adicionales } = producto;
      const cant = cantidad && !isNaN(Number(cantidad)) ? Number(cantidad) : 1;

      // Insertar detalle
      const detalleRow = await insertarDetallePedido(id, idProducto, cant);
      if (!detalleRow || detalleRow.length === 0) {
        return res.status(500).json({
          error: 'No se pudo insertar el detalle del pedido',
          detalle: `Pedido:${id}, Producto:${idProducto}`
        });
      }

      const detalle = detalleRow[0];
      const detallesExtras = [];

      // Insertar adicionales si existen
      if (Array.isArray(adicionales)) {
        for (const [aIndex, adicional] of adicionales.entries()) {
          const { idIngrediente, cantidad: cantAd, extra } = adicional;

          if (!idIngrediente || isNaN(Number(idIngrediente))) {
            return res.status(400).json({
              error: `Adicional inválido en producto, posición ${aIndex + 1}`,
              detalle: `idIngrediente es requerido y debe ser numérico`
            });
          }

          const cantExtra = cantAd && !isNaN(Number(cantAd)) ? Number(cantAd) : 1;
          const precioExtra = extra && !isNaN(Number(extra)) ? Number(extra) : 0;

          const adicionalInsertado = await insertarAdicional(
            detalle.iddetallepedido,
            idIngrediente,
            cantExtra,
            precioExtra
          );

          detallesExtras.push(adicionalInsertado[0]);
        }
      }

      resultados.push({ detalle, adicionales: detallesExtras });
    }

    res.status(201).json({ mensaje: 'Productos agregados', detalles: resultados });
  } catch (error) {
    console.error("Error en agregarProductosAlPedido:", error);
    res.status(500).json({ error: 'Error al agregar productos al pedido', detalle: error.message });
  }
};

// 9. Obtener estadísticas de pedidos
export const obtenerEstadisticasPedidos = async (req, res) => {
  try {
    const resumen = await getEstadisticasPedidos();
    res.json(resumen);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas', detalle: err.message });
  }
};

// 10. Obtener pedidos por fecha
export const pedidosPorFecha = async (req, res) => {
  const { desde, hasta } = req.query;

  if (!desde || !hasta) {
    return res.status(400).json({ error: 'Debes enviar parámetros ?desde=YYYY-MM-DD&hasta=YYYY-MM-DD' });
  }

  try {
    const pedidos = await getPedidosPorFecha(desde, hasta);
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: 'Error al filtrar pedidos por fecha', detalle: err.message });
  }
};

// 11. Resumen de un pedido
export const obtenerResumenPedido = async (req, res) => {
  const { id } = req.params;

  if (isNaN(Number(id))) return res.status(400).json({ error: 'El ID debe ser válido' });

  try {
    const resumen = await getResumenPedido(id);
    if (!resumen) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(resumen);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener resumen del pedido', detalle: err.message });
  }
};

// 12. Eliminar producto específico de un pedido
export const eliminarProductoDePedido = async (req, res) => {
  const { id, idDetallePedido } = req.params;

  if (isNaN(Number(id)) || isNaN(Number(idDetallePedido))) {
    return res.status(400).json({ error: 'Los IDs deben ser números válidos' });
  }

  try {
    const eliminado = await deleteProductoDePedido(id, idDetallePedido);
    if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado en este pedido' });
    res.json({ mensaje: 'Producto eliminado del pedido', detalle: eliminado });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto del pedido', detalle: err.message });
  }
};

// Resto de funciones permanecen igual...
// (eliminarPedido, obtenerPedidosPorEstado, agregarProductosAlPedido, etc.)