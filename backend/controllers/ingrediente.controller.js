import {
  getAllIngredientes,
  getIngredienteById,
  getIngredientesMasUsados,
  buscarIngredientes,
  getEstadisticasIngrediente,
  getIngredientesPorPrecio
} from '../models/ingrediente.model.js';

// ===== 1. GET /api/ingredientes - Obtener todos los ingredientes =====
export const obtenerTodosLosIngredientes = async (req, res) => {
  const { buscar, precioMin, precioMax, masUsados, limite } = req.query;
  
  try {
    let ingredientes;

    // Si se solicita buscar por nombre
    if (buscar) {
      ingredientes = await buscarIngredientes(buscar);
      return res.json({
        total: ingredientes.length,
        termino_busqueda: buscar,
        ingredientes
      });
    }

    // Si se solicita filtrar por precio
    if (precioMin !== undefined || precioMax !== undefined) {
      const min = precioMin ? parseFloat(precioMin) : 0;
      const max = precioMax ? parseFloat(precioMax) : 999999;
      
      if (isNaN(min) || isNaN(max) || min < 0 || max < min) {
        return res.status(400).json({ 
          error: 'Los parámetros de precio deben ser números válidos y precioMin <= precioMax' 
        });
      }

      ingredientes = await getIngredientesPorPrecio(min, max);
      return res.json({
        total: ingredientes.length,
        filtro: { precioMin: min, precioMax: max },
        ingredientes
      });
    }

    // Si se solicita ingredientes más usados
    if (masUsados === 'true') {
      const limiteNum = limite && !isNaN(limite) ? parseInt(limite) : 10;
      ingredientes = await getIngredientesMasUsados(limiteNum);
      return res.json({
        total: ingredientes.length,
        tipo: 'mas_usados',
        limite: limiteNum,
        ingredientes
      });
    }

    // Obtener todos los ingredientes (comportamiento por defecto)
    ingredientes = await getAllIngredientes();
    res.json({
      total: ingredientes.length,
      ingredientes
    });

  } catch (err) {
    res.status(500).json({ 
      error: 'Error al obtener los ingredientes', 
      detalle: err.message 
    });
  }
};

// ===== 2. GET /api/ingredientes/:id - Obtener ingrediente específico =====
export const obtenerIngredientePorId = async (req, res) => {
  const { id } = req.params;
  const { incluirEstadisticas } = req.query; // ?incluirEstadisticas=true
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID de ingrediente debe ser un número' });
  }

  try {
    const ingrediente = await getIngredienteById(id);
    
    if (!ingrediente) {
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }

    // Si se solicita incluir estadísticas
    if (incluirEstadisticas === 'true') {
      const estadisticas = await getEstadisticasIngrediente(id);
      
      return res.json({
        ...ingrediente,
        estadisticas: {
          ...estadisticas,
          // Convertir a números para evitar strings
          productos_base_que_lo_incluyen: parseInt(estadisticas.productos_base_que_lo_incluyen || 0),
          cantidad_total_en_productos_base: parseInt(estadisticas.cantidad_total_en_productos_base || 0),
          veces_agregado_como_extra: parseInt(estadisticas.veces_agregado_como_extra || 0),
          cantidad_total_como_extra: parseInt(estadisticas.cantidad_total_como_extra || 0),
          ingresos_por_extras: parseFloat(estadisticas.ingresos_por_extras || 0)
        }
      });
    }

    res.json(ingrediente);

  } catch (err) {
    res.status(500).json({ 
      error: 'Error al obtener el ingrediente', 
      detalle: err.message 
    });
  }
};

// ===== CONTROLADORES ADICIONALES (ÚTILES PARA FUTURAS EXPANSIONES) =====

// GET /api/ingredientes/estadisticas/resumen - Resumen general de ingredientes
export const obtenerEstadisticasIngredientes = async (req, res) => {
  try {
    const [
      totalIngredientes,
      precioPromedio,
      ingredientesMasUsados
    ] = await Promise.all([
      getAllIngredientes().then(result => result.length),
      getAllIngredientes().then(ingredientes => {
        if (ingredientes.length === 0) return 0;
        const suma = ingredientes.reduce((acc, ing) => acc + parseFloat(ing.precio), 0);
        return suma / ingredientes.length;
      }),
      getIngredientesMasUsados(5)
    ]);

    res.json({
      resumen: {
        total_ingredientes: totalIngredientes,
        precio_promedio: Math.round(precioPromedio * 100) / 100, // 2 decimales
      },
      ingredientes_mas_usados: ingredientesMasUsados
    });

  } catch (err) {
    res.status(500).json({ 
      error: 'Error al obtener estadísticas de ingredientes', 
      detalle: err.message 
    });
  }
};

// GET /api/ingredientes/buscar/:termino - Buscar ingredientes (ruta alternativa)
export const buscarIngredientesPorTermino = async (req, res) => {
  const { termino } = req.params;
  
  if (!termino || termino.length < 2) {
    return res.status(400).json({ 
      error: 'El término de búsqueda debe tener al menos 2 caracteres' 
    });
  }

  try {
    const ingredientes = await buscarIngredientes(termino);
    
    res.json({
      total_encontrados: ingredientes.length,
      termino_busqueda: termino,
      ingredientes
    });

  } catch (err) {
    res.status(500).json({ 
      error: 'Error al buscar ingredientes', 
      detalle: err.message 
    });
  }
};