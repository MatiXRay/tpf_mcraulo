  import sql from '../db/db.js';

  // ===== CATEGORÍAS BÁSICAS =====

  // Obtener todas las categorías (TipoProducto)
  export const getAllCategorias = async () => {
    return sql`
      SELECT 
        idTipoProducto,
        nombre
      FROM TipoProducto
      ORDER BY nombre ASC
    `;
  };

  // Obtener categoría por ID
  export const getCategoriaById = async (id) => {
    const result = await sql`
      SELECT 
        idTipoProducto,
        nombre
      FROM TipoProducto
      WHERE idTipoProducto = ${id}
    `;
    return result.length > 0 ? result[0] : null;
  };

  // Obtener categoría con sus productos
  export const getCategoriaConProductos = async (idCategoria) => {
    return sql`
      SELECT 
        p.idProducto,
        p.nombre,
        p.precio,
        p.descripcion
      FROM Producto p
      WHERE p.idTipoProducto = ${idCategoria}
      ORDER BY p.nombre ASC
    `;
  };

  // ===== ESTADÍSTICAS DE CATEGORÍAS =====

  // Obtener estadísticas completas de todas las categorías
  export const getEstadisticasCategorias = async () => {
    return sql`
      SELECT 
        tp.idTipoProducto,
        tp.nombre AS categoria,
        COUNT(p.idProducto) AS cantidadProductos,
        COALESCE(AVG(p.precio), 0) AS precioPromedio,
        COALESCE(MIN(p.precio), 0) AS precioMinimo,
        COALESCE(MAX(p.precio), 0) AS precioMaximo
      FROM TipoProducto tp
      LEFT JOIN Producto p ON tp.idTipoProducto = p.idTipoProducto
      GROUP BY tp.idTipoProducto, tp.nombre
      ORDER BY cantidadProductos DESC, tp.nombre ASC
    `;
  };

  // Verificar si una categoría existe
  export const existeCategoria = async (idCategoria) => {
    const result = await sql`
      SELECT COUNT(*) as count 
      FROM TipoProducto 
      WHERE idTipoProducto = ${idCategoria}
    `;
    return parseInt(result[0].count) > 0;
  };

  // Obtener categoría por nombre (útil para búsquedas)
  export const getCategoriaPorNombre = async (nombre) => {
    const result = await sql`
      SELECT 
        idTipoProducto,
        nombre
      FROM TipoProducto
      WHERE LOWER(nombre) = LOWER(${nombre})
    `;
    return result.length > 0 ? result[0] : null;
  };

  // Buscar categorías por término
  export const buscarCategorias = async (termino) => {
    return sql`
      SELECT 
        tp.idTipoProducto,
        tp.nombre AS categoria,
        COUNT(p.idProducto) AS cantidadProductos
      FROM TipoProducto tp
      LEFT JOIN Producto p ON tp.idTipoProducto = p.idTipoProducto
      WHERE LOWER(tp.nombre) LIKE LOWER(${'%' + termino + '%'})
      GROUP BY tp.idTipoProducto, tp.nombre
      ORDER BY cantidadProductos DESC, tp.nombre ASC
    `;
  };

  // ===== ESTADÍSTICAS AVANZADAS =====

  // Obtener categorías con ventas (para reportes)
  export const getCategoriasConVentas = async () => {
    return sql`
      SELECT 
        tp.idTipoProducto,
        tp.nombre AS categoria,
        COUNT(DISTINCT p.idProducto) AS productosEnCategoria,
        COUNT(DISTINCT dp.idPedido) AS pedidosConProductosDeCategoria,
        SUM(dp.cantidad) AS totalProductosVendidos,
        SUM(dp.cantidad * p.precio) AS ingresosTotales
      FROM TipoProducto tp
      LEFT JOIN Producto p ON tp.idTipoProducto = p.idTipoProducto
      LEFT JOIN DetallePedido dp ON p.idProducto = dp.idProducto
      LEFT JOIN Pedido ped ON dp.idPedido = ped.idPedido
      WHERE ped.idEstadoPedido IN (2, 3, 4) OR ped.idEstadoPedido IS NULL -- En preparación, listo, entregado
      GROUP BY tp.idTipoProducto, tp.nombre
      ORDER BY ingresosTotales DESC NULLS LAST, tp.nombre ASC
    `;
  };

  // Obtener la categoría más popular (por cantidad de pedidos)
  export const getCategoriaMasPopular = async () => {
    const result = await sql`
      SELECT 
        tp.nombre AS categoria,
        COUNT(DISTINCT dp.idPedido) AS totalPedidos,
        SUM(dp.cantidad) AS totalProductosVendidos
      FROM TipoProducto tp
      JOIN Producto p ON tp.idTipoProducto = p.idTipoProducto
      JOIN DetallePedido dp ON p.idProducto = dp.idProducto
      JOIN Pedido ped ON dp.idPedido = ped.idPedido
      WHERE ped.idEstadoPedido IN (2, 3, 4) -- Solo pedidos completados
      GROUP BY tp.idTipoProducto, tp.nombre
      ORDER BY totalPedidos DESC
      LIMIT 1
    `;
    return result.length > 0 ? result[0] : null;
  };