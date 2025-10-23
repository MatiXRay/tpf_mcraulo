// Correcciones finales para pedido.model.js

import sql from '../db/db.js';

// IMPORTANTE: PostgreSQL devuelve nombres de columnas en lowercase
// El schema SQL usa PascalCase pero las queries devuelven lowercase

export const getAllPedidos = () => sql`
  SELECT * FROM Pedido ORDER BY idPedido DESC
`;

export const getPedidoById = (id) => sql`
  SELECT * FROM Pedido WHERE idPedido = ${id}
`;

export const insertPedido = ({ precio, idEstadoPedido, idTipoContribuyente, idCliente, idCupon = null }) => 
  sql`
    INSERT INTO Pedido (fechaHora, precio, idEstadoPedido, idTipoContribuyente, idCliente, idCupon)
    VALUES (NOW(), ${precio}, ${idEstadoPedido}, ${idTipoContribuyente}, ${idCliente}, ${idCupon})
    RETURNING *;
  `.then(rows => rows[0]);

export const updateEstadoPedido = async (id, estado) => {
  if (!id || !estado) {
    throw new Error("ID o estado no fueron provistos");
  }

  // Buscar el ID del estado por nombre
  const estadoRow = await sql`
    SELECT idEstadoPedido, nombre 
    FROM EstadoPedido 
    WHERE LOWER(nombre) = LOWER(${estado})
  `;

  if (estadoRow.length === 0) return null;

  // PostgreSQL devuelve en lowercase
  const estadoId = estadoRow[0].idestadopedido;

  const result = await sql`
    UPDATE Pedido 
    SET idEstadoPedido = ${estadoId}
    WHERE idPedido = ${Number(id)}
    RETURNING *
  `;

  return result.length ? result[0] : null;
};

export const deletePedido = async (id) => {
  // 1. Eliminar adicionales ligados a los detalles del pedido
  await sql`
    DELETE FROM Adicionales
    WHERE idDetallePedido IN (
      SELECT idDetallePedido FROM DetallePedido WHERE idPedido = ${id}
    );
  `;

  // 2. Eliminar los productos (DetallePedido)
  await sql`
    DELETE FROM DetallePedido
    WHERE idPedido = ${id};
  `;

  // 3. Eliminar pagos relacionados al pedido
  await sql`
    DELETE FROM Pago
    WHERE idPedido = ${id};
  `;

  // 4. Eliminar el pedido
  const result = await sql`
    DELETE FROM Pedido
    WHERE idPedido = ${id}
    RETURNING *;
  `;

  return result.length ? result[0] : null;
};

export const getPedidosByEstado = async (nombreEstado) => {
  return await sql`
    SELECT p.*, e.nombre AS estado
    FROM Pedido p
    JOIN EstadoPedido e ON p.idEstadoPedido = e.idEstadoPedido
    WHERE LOWER(e.nombre) = LOWER(${nombreEstado});
  `;
};

export const insertarDetallePedido = (idPedido, idProducto, cantidad = 1) =>
  sql`
    INSERT INTO DetallePedido (idPedido, idProducto, cantidad)
    VALUES (${idPedido}, ${idProducto}, ${cantidad}) 
    RETURNING *
  `;

// CORREGIDO: Mantener la lógica original del schema
export const insertarAdicional = (idDetallePedido, idIngrediente, cantidad, extra) => {
  return sql`
    INSERT INTO Adicionales (idDetallePedido, idIngrediente, cantidad, extra)
    VALUES (${idDetallePedido}, ${idIngrediente}, ${cantidad}, ${extra})
    RETURNING *
  `;
};

export const getDetalleProducto = (idPedido, idDetallePedido) =>
  sql`
    SELECT dp.*, p.nombre AS nombre_producto, p.precio AS precio_producto
    FROM DetallePedido dp
    JOIN Producto p ON p.idProducto = dp.idProducto
    WHERE dp.idPedido = ${idPedido} AND dp.idDetallePedido = ${idDetallePedido};
  `;

export const getEstadisticasPedidos = async () => {
  const total = await sql`SELECT COUNT(*) AS total FROM Pedido`;
  const promedio = await sql`SELECT AVG(precio) AS promedio_precio FROM Pedido`;
  const porEstado = await sql`
    SELECT e.nombre AS estado, COUNT(*) AS cantidad
    FROM Pedido p
    JOIN EstadoPedido e ON e.idEstadoPedido = p.idEstadoPedido
    GROUP BY e.nombre;
  `;

  return {
    total: Number(total[0].total),
    promedio_precio: Number(promedio[0].promedio_precio || 0),
    pedidos_por_estado: porEstado
  };
};

export const getPedidosPorFecha = (desde, hasta) => sql`
  SELECT * FROM Pedido
  WHERE fechaHora BETWEEN ${desde} AND ${hasta}
  ORDER BY fechaHora ASC;
`;

export const getResumenPedido = async (idPedido) => {
  const pedido = await sql`
    SELECT p.*, c.nombre AS cliente, e.nombre AS estado
    FROM Pedido p
    JOIN Cliente c ON c.idCliente = p.idCliente
    JOIN EstadoPedido e ON e.idEstadoPedido = p.idEstadoPedido
    WHERE p.idPedido = ${idPedido};
  `;
  if (pedido.length === 0) return null;

  const productos = await sql`
    SELECT dp.idDetallePedido, dp.cantidad,
           pr.nombre AS producto, pr.precio, tp.nombre AS tipo_producto
    FROM DetallePedido dp
    JOIN Producto pr ON pr.idProducto = dp.idProducto
    JOIN TipoProducto tp ON tp.idTipoProducto = pr.idTipoProducto
    WHERE dp.idPedido = ${idPedido};
  `;

  return { pedido: pedido[0], productos };
};

export const deleteProductoDePedido = async (idPedido, idDetallePedido) => {
  // Primero eliminar adicionales del detalle
  await sql`
    DELETE FROM Adicionales
    WHERE idDetallePedido = ${idDetallePedido}
  `;
  
  // Luego eliminar el detalle
  const eliminado = await sql`
    DELETE FROM DetallePedido
    WHERE idPedido = ${idPedido} AND idDetallePedido = ${idDetallePedido}
    RETURNING *;
  `;
  return eliminado.length ? eliminado[0] : null;
};

// Funciones auxiliares
const toInt = (v) => (v !== undefined && v !== null ? parseInt(v, 10) : null);
const toNum = (v) => (v !== undefined && v !== null ? parseFloat(v) : 0);

/**
 * Crear un pedido completo con transacción
 */
export const createPedidoCompleto = async ({ fechaHora, idTipoContribuyente, idCliente, idCupon = null, productos }) => {
  if (!Array.isArray(productos) || productos.length === 0) {
    const err = new Error('Debes enviar un array "productos" con al menos un elemento');
    err.code = 'INVALID_BODY';
    throw err;
  }

  return await sql.begin(async (tx) => {
    // 1) Insertar pedido con precio inicial 0 y estado Pendiente (id=1)
    const pedidoRow = await tx`
      INSERT INTO Pedido (fechaHora, precio, idEstadoPedido, idTipoContribuyente, idCliente, idCupon)
      VALUES (${fechaHora || new Date().toISOString()}, ${0}, ${1}, ${toInt(idTipoContribuyente)}, ${toInt(idCliente)}, ${toInt(idCupon)})
      RETURNING *
    `;
    const pedido = pedidoRow[0];

    let total = 0;

    // 2) Procesar cada producto
    for (const p of productos) {
      const idProducto = toInt(p.idProducto);
      const cantidad = Math.max(1, toInt(p.cantidad) || 1);

      // Verificar que el producto existe
      const productoRow = await tx`
        SELECT idProducto, precio FROM Producto WHERE idProducto = ${idProducto}
      `;
      if (productoRow.length === 0) {
        const err = new Error(`Producto no encontrado: idProducto=${idProducto}`);
        err.code = 'PRODUCTO_NOT_FOUND';
        throw err;
      }

      const precioProducto = toNum(productoRow[0].precio);
      const subtotalProducto = precioProducto * cantidad;

      // Insertar detalle del pedido
      const detalleRow = await tx`
        INSERT INTO DetallePedido (idPedido, idProducto, cantidad)
        VALUES (${pedido.idpedido}, ${idProducto}, ${cantidad})
        RETURNING *
      `;
      const detalle = detalleRow[0];

      total += subtotalProducto;

      // 3) Procesar adicionales si existen
      const adicionales = Array.isArray(p.adicionales) ? p.adicionales : [];
      for (const ad of adicionales) {
        const idIngrediente = toInt(ad.idIngrediente);
        const cantidadExtra = Math.max(1, toInt(ad.cantidad) || 1);

        // Verificar que el ingrediente existe
        const ingredienteRow = await tx`
          SELECT idIngrediente, precio FROM Ingredientes WHERE idIngrediente = ${idIngrediente}
        `;
        if (ingredienteRow.length === 0) {
          const err = new Error(`Ingrediente no encontrado: idIngrediente=${idIngrediente}`);
          err.code = 'INGREDIENTE_NOT_FOUND';
          throw err;
        }

        const precioIngrediente = toNum(ingredienteRow[0].precio);
        const costoExtra = precioIngrediente * cantidadExtra;

        // Insertar adicional
        await tx`
          INSERT INTO Adicionales (idDetallePedido, idIngrediente, cantidad, extra)
          VALUES (${detalle.iddetallepedido}, ${idIngrediente}, ${cantidadExtra}, ${costoExtra})
        `;

        total += costoExtra;
      }
    }

    // 4) Aplicar descuento de cupón si existe
    if (idCupon) {
      const cuponRow = await tx`
        SELECT cp.porcentajeDescuento
        FROM Cupon c
        JOIN CuponPredefinido cp ON c.idCuponPredef = cp.idCuponPredef
        WHERE c.idCupon = ${idCupon} AND c.fechaVencimiento > NOW()
      `;
      if (cuponRow.length > 0) {
        const descuento = toNum(cuponRow[0].porcentajedescuento);
        total = total * (1 - descuento / 100);
      }
    }

    // 5) Actualizar el precio total del pedido
    const pedidoActualizado = await tx`
      UPDATE Pedido SET precio = ${Number(total.toFixed(2))}
      WHERE idPedido = ${pedido.idpedido}
      RETURNING *
    `;

    return pedidoActualizado[0];
  });
};

/**
 * Obtener pedido con todos sus detalles y adicionales
 */
export const getPedidoConDetalles = async (idPedido) => {
  const pedido = await sql`SELECT * FROM Pedido WHERE idPedido = ${idPedido}`;
  if (pedido.length === 0) return null;

  const detalles = await sql`
    SELECT 
      dp.*, 
      p.nombre AS nombreProducto, 
      p.precio AS precioProducto,
      tp.nombre AS categoria
    FROM DetallePedido dp
    JOIN Producto p ON dp.idProducto = p.idProducto
    JOIN TipoProducto tp ON p.idTipoProducto = tp.idTipoProducto
    WHERE dp.idPedido = ${idPedido}
    ORDER BY dp.idDetallePedido
  `;

  // Para cada detalle, obtener sus adicionales
  for (const detalle of detalles) {
    const adicionales = await sql`
      SELECT 
        a.*, 
        i.nombre AS nombreIngrediente,
        i.precio AS precioIngrediente
      FROM Adicionales a
      JOIN Ingredientes i ON a.idIngrediente = i.idIngrediente
      WHERE a.idDetallePedido = ${detalle.iddetallepedido}
    `;
    detalle.adicionales = adicionales;
  }

  return { 
    ...pedido[0], 
    detalles 
  };
};