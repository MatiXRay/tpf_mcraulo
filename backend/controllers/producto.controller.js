import {
  getAllProductos,
  getProductoById,
  getProductoConIngredientes,
  getProductosPorCategoria,
  calcularPrecioBatch,
  createProducto as createProductoModel // Renombramos para evitar conflictos
} from '../models/producto.model.js';
import { getIngredientesPorProducto } from '../models/ingrediente.model.js';
import cloudinary from '../utils/cloudinary.js'; // Importamos la config de Cloudinary

/**
 * POST /api/productos
 * Crear un nuevo producto
 */
export const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, descripcion, idTipoProducto } = req.body;
    let imagen_url = null;

    // 1. Validar datos básicos
    if (!nombre || !precio || !idTipoProducto) {
      return res.status(400).json({ error: 'Nombre, precio y idTipoProducto son requeridos.' });
    }

    // 2. Revisar si se subió un archivo de imagen
    if (req.file) {
      // Sube el archivo a Cloudinary desde el buffer en memoria
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "productos_mcraulo" }, // Opcional: para organizar en carpetas
          (error, result) => {
            if (error) {
              console.error('Error de Cloudinary:', error);
              reject(new Error('Error al subir la imagen'));
            } else {
              resolve(result);
            }
          }
        );
        stream.end(req.file.buffer);
      });
      
      imagen_url = result.secure_url; // Esta es la URL que guardaremos
    }

    // 3. Crear el producto en la base de datos
    const nuevoProducto = await createProductoModel({
      nombre,
      precio: parseFloat(precio),
      descripcion,
      idTipoProducto: parseInt(idTipoProducto, 10),
      imagen_url // Será la URL de Cloudinary o null
    });

    res.status(201).json(nuevoProducto);

  } catch (err) {
    res.status(500).json({
      error: 'Error al crear el producto',
      detalle: err.message
    });
  }
};


/**
 * GET /api/productos
 * Obtener todos los productos
 */
export const obtenerTodosLosProductos = async (req, res) => {
  const { incluirIngredientes } = req.query; // ?incluirIngredientes=true
  
  try {
    const productos = await getAllProductos();

    // Incluir ingredientes base si se pide
    if (incluirIngredientes === 'true') {
      const productosConIngredientes = await Promise.all(
        productos.map(async (producto) => {
          const ingredientesBase = await getIngredientesPorProducto(producto.idproducto);
          return {
            ...producto,
            ingredientesBase
          };
        })
      );
      return res.json(productosConIngredientes);
    }

    res.json(productos);
  } catch (err) {
    res.status(500).json({
      error: 'Error al obtener los productos',
      detalle: err.message
    });
  }
};

/**
 * GET /api/productos/:id
 * Obtener producto específico con sus ingredientes base
 */
export const obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID de producto debe ser un número' });
  }

  try {
    const producto = await getProductoConIngredientes(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (err) {
    res.status(500).json({
      error: 'Error al obtener el producto',
      detalle: err.message
    });
  }
};

/**
 * GET /api/productos/categoria/:categoria
 * Obtener todos los productos de una categoría
 */
export const obtenerProductosPorCategoria = async (req, res) => {
  const { categoria } = req.params;
  const { incluirIngredientes } = req.query; // ?incluirIngredientes=true
  
  try {
    const productos = await getProductosPorCategoria(categoria);
    if (!productos) {
      return res.status(404).json({
        error: 'Categoría no encontrada. Categorías disponibles: Hamburguesas, Papas, Bebidas, Postres, Combos, Extras'
      });
    }

    // Incluir ingredientes base si se pide
    if (incluirIngredientes === 'true') {
      const productosConIngredientes = await Promise.all(
        productos.map(async (producto) => {
          const ingredientesBase = await getIngredientesPorProducto(producto.idproducto);
          return {
            ...producto,
            ingredientesBase
          };
        })
      );
      return res.json(productosConIngredientes);
    }

    res.json(productos);
  } catch (err) {
    res.status(500).json({
      error: 'Error al obtener productos por categoría',
      detalle: err.message
    });
  }
};

/**
 * POST /api/productos/:id/calcular-precio
 * Calcular el precio personalizado de un producto
 */
export const calcularPrecioPersonalizado = async (req, res) => {
  const { id } = req.params;
  const { ingredientesExtra = [], ingredientesEliminar = [], cantidad = 1 } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID de producto debe ser un número' });
  }

  if (cantidad < 1) {
    return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
  }

  try {
    // Verificar que el producto existe
    const producto = await getProductoById(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Validar ingredientes extra
    for (const extra of ingredientesExtra) {
      if (!extra.idIngrediente || isNaN(extra.idIngrediente)) {
        return res.status(400).json({
          error: 'Cada ingrediente extra debe tener un idIngrediente válido'
        });
      }
      if (extra.cantidad && (isNaN(extra.cantidad) || extra.cantidad < 1)) {
        return res.status(400).json({
          error: 'La cantidad de cada ingrediente extra debe ser mayor a 0'
        });
      }
    }

    // Calcular precio con extras y eliminados
    const calculoPrecio = await calcularPrecioBatch({
      idProducto: id,
      ingredientesExtra,
      ingredientesEliminar,
      cantidad
    });

    res.json({
      producto: {
        id: producto.idproducto,
        nombre: producto.nombre,
        categoria: producto.categoria,
        descripcion: producto.descripcion
      },
      cantidad,
      precios: {
        precioBaseUnitario: parseFloat(producto.precio),
        precioBaseTotal: parseFloat(producto.precio) * cantidad,
        totalExtrasUnitario: calculoPrecio.totalExtra,
        totalExtrasTotal: calculoPrecio.totalExtra * cantidad,
        precioFinalUnitario: calculoPrecio.precioFinal,
        precioFinalTotal: calculoPrecio.precioFinal * cantidad
      },
      detalles: {
        ingredientesExtra: calculoPrecio.ingredientesExtra,
        ingredientesEliminados: ingredientesEliminar,
        resumen: calculoPrecio.resumen
      }
    });
  } catch (err) {
    res.status(500).json({
      error: 'Error al calcular el precio personalizado',
      detalle: err.message
    });
  }
};