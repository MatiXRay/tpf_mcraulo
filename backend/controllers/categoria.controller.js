import {
  getAllCategorias,
  getCategoriaById,
  getEstadisticasCategorias,
  getCategoriaConProductos
} from '../models/categoria.model.js';

// ===== 1. GET /api/categorias - Obtener todas las categorías =====
export const obtenerTodasLasCategorias = async (req, res) => {
  const { incluirProductos, incluirEstadisticas } = req.query;
  
  try {
    let categorias;

    // Si se solicita incluir productos
    if (incluirProductos === 'true') {
      categorias = await Promise.all(
        (await getAllCategorias()).map(async (categoria) => {
          const productos = await getCategoriaConProductos(categoria.idtipoproducto);
          return {
            ...categoria,
            productos: productos || []
          };
        })
      );
      
      return res.json({
        total: categorias.length,
        tipo: 'con_productos',
        categorias
      });
    }

    // Si se solicita incluir estadísticas
    if (incluirEstadisticas === 'true') {
      const estadisticas = await getEstadisticasCategorias();
      return res.json({
        total: estadisticas.length,
        tipo: 'con_estadisticas',
        categorias: estadisticas
      });
    }

    // Obtener todas las categorías (comportamiento por defecto)
    categorias = await getAllCategorias();
    res.json({
      total: categorias.length,
      categorias
    });

  } catch (err) {
    res.status(500).json({ 
      error: 'Error al obtener las categorías', 
      detalle: err.message 
    });
  }
};

// ===== 2. GET /api/categorias/:id - Obtener categoría específica =====
export const obtenerCategoriaPorId = async (req, res) => {
  const { id } = req.params;
  const { incluirProductos, incluirEstadisticas } = req.query;
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID de categoría debe ser un número' });
  }

  try {
    const categoria = await getCategoriaById(id);
    
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    let resultado = { ...categoria };

    // Si se solicita incluir productos
    if (incluirProductos === 'true') {
      const productos = await getCategoriaConProductos(id);
      resultado.productos = productos || [];
    }

    // Si se solicita incluir estadísticas (solo para esta categoría)
    if (incluirEstadisticas === 'true') {
      const estadisticasGeneral = await getEstadisticasCategorias();
      const estadisticaCategoria = estadisticasGeneral.find(
        cat => cat.idtipoproducto === parseInt(id)
      );
      
      if (estadisticaCategoria) {
        resultado.estadisticas = {
          cantidad_productos: parseInt(estadisticaCategoria.cantidadproductos || 0),
          precio_promedio: parseFloat(estadisticaCategoria.preciopromedio || 0),
          precio_minimo: parseFloat(estadisticaCategoria.preciominimo || 0),
          precio_maximo: parseFloat(estadisticaCategoria.preciomaximo || 0)
        };
      }
    }

    res.json(resultado);

  } catch (err) {
    res.status(500).json({ 
      error: 'Error al obtener la categoría', 
      detalle: err.message 
    });
  }
};

// ===== CONTROLADORES ADICIONALES =====

// GET /api/categorias/estadisticas/resumen - Resumen estadístico de todas las categorías
export const obtenerResumenEstadisticasCategorias = async (req, res) => {
  try {
    const estadisticas = await getEstadisticasCategorias();
    
    const resumen = {
      total_categorias: estadisticas.length,
      total_productos: estadisticas.reduce((sum, cat) => sum + parseInt(cat.cantidadproductos || 0), 0),
      precio_promedio_general: estadisticas.reduce((sum, cat) => sum + parseFloat(cat.preciopromedio || 0), 0) / estadisticas.length,
      categoria_con_mas_productos: estadisticas.reduce((max, cat) => 
        parseInt(cat.cantidadproductos || 0) > parseInt(max.cantidadproductos || 0) ? cat : max
      ),
      categoria_mas_cara: estadisticas.reduce((max, cat) => 
        parseFloat(cat.preciomaximo || 0) > parseFloat(max.preciomaximo || 0) ? cat : max
      ),
      categoria_mas_barata: estadisticas.reduce((min, cat) => 
        parseFloat(cat.preciominimo || 0) < parseFloat(min.preciominimo || 0) ? cat : min
      )
    };

    res.json({
      resumen,
      detalle_por_categoria: estadisticas
    });

  } catch (err) {
    res.status(500).json({ 
      error: 'Error al obtener estadísticas de categorías', 
      detalle: err.message 
    });
  }
};