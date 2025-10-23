import sql from '../db/db.js';

// ===== INGREDIENTES BÁSICOS =====

// Obtener todos los ingredientes
export const getAllIngredientes = async () => {
  return sql`
    SELECT 
      idIngrediente,
      nombre,
      precio
    FROM Ingredientes
    ORDER BY nombre ASC
  `;
};

// Obtener ingrediente por ID
export const getIngredienteById = async (id) => {
  const result = await sql`
    SELECT 
      idIngrediente,
      nombre,
      precio
    FROM Ingredientes
    WHERE idIngrediente = ${id}
  `;
  return result.length > 0 ? result[0] : null;
};

// ===== FUNCIONES AUXILIARES =====

// Obtener ingredientes de un producto específico (función auxiliar)
export const getIngredientesPorProducto = async (idProducto) => {
  return sql`
    SELECT 
      i.idIngrediente,
      i.nombre AS ingrediente,
      i.precio,
      pp.cantidad,
      (i.precio * pp.cantidad) AS subtotal
    FROM ProductoPredefinido pp
    JOIN Ingredientes i ON pp.idIngrediente = i.idIngrediente
    WHERE pp.idProducto = ${idProducto}
    ORDER BY i.nombre
  `;
};

// Verificar si un ingrediente existe
export const existeIngrediente = async (idIngrediente) => {
  const result = await sql`
    SELECT COUNT(*) as count 
    FROM Ingredientes 
    WHERE idIngrediente = ${idIngrediente}
  `;
  return parseInt(result[0].count) > 0;
};

// Obtener ingredientes más usados en productos
export const getIngredientesMasUsados = async (limite = 10) => {
  return sql`
    SELECT 
      i.idIngrediente,
      i.nombre,
      i.precio,
      COUNT(pp.idProducto) as productos_que_lo_usan,
      SUM(pp.cantidad) as cantidad_total_en_productos
    FROM Ingredientes i
    LEFT JOIN ProductoPredefinido pp ON i.idIngrediente = pp.idIngrediente
    GROUP BY i.idIngrediente, i.nombre, i.precio
    ORDER BY productos_que_lo_usan DESC, cantidad_total_en_productos DESC
    LIMIT ${limite}
  `;
};

// Buscar ingredientes por nombre
export const buscarIngredientes = async (termino) => {
  return sql`
    SELECT 
      idIngrediente,
      nombre,
      precio
    FROM Ingredientes
    WHERE LOWER(nombre) LIKE LOWER(${'%' + termino + '%'})
    ORDER BY nombre
  `;
};

// Obtener estadísticas de un ingrediente específico
export const getEstadisticasIngrediente = async (idIngrediente) => {
  const estadisticas = await sql`
    SELECT 
      COUNT(DISTINCT pp.idProducto) as productos_base_que_lo_incluyen,
      SUM(pp.cantidad) as cantidad_total_en_productos_base,
      COUNT(DISTINCT a.idDetallePedido) as veces_agregado_como_extra,
      SUM(a.cantidad) as cantidad_total_como_extra,
      COALESCE(SUM(a.extra), 0) as ingresos_por_extras
    FROM Ingredientes i
    LEFT JOIN ProductoPredefinido pp ON i.idIngrediente = pp.idIngrediente
    LEFT JOIN Adicionales a ON i.idIngrediente = a.idIngrediente
    LEFT JOIN DetallePedido dp ON a.idDetallePedido = dp.idDetallePedido
    LEFT JOIN Pedido p ON dp.idPedido = p.idPedido AND p.idEstadoPedido IN (2, 3)
    WHERE i.idIngrediente = ${idIngrediente}
    GROUP BY i.idIngrediente
  `;

  return estadisticas.length > 0 ? estadisticas[0] : {
    productos_base_que_lo_incluyen: 0,
    cantidad_total_en_productos_base: 0,
    veces_agregado_como_extra: 0,
    cantidad_total_como_extra: 0,
    ingresos_por_extras: 0
  };
};

// Obtener ingredientes por rango de precio
export const getIngredientesPorPrecio = async (precioMin = 0, precioMax = 999999) => {
  return sql`
    SELECT 
      idIngrediente,
      nombre,
      precio
    FROM Ingredientes
    WHERE precio BETWEEN ${precioMin} AND ${precioMax}
    ORDER BY precio ASC, nombre ASC
  `;
};