/**
 * @file Servicios de API optimizados - VERSIÓN 2.0
 * Centraliza todas las llamadas a la API relacionadas con productos
 */

// ===== CONFIGURACIÓN =====
const API_URL = 'http://localhost:3000/api';
const DEFAULT_TIMEOUT = 10000; // 10 segundos

// ===== UTILIDADES =====
const createTimeoutPromise = (timeout = DEFAULT_TIMEOUT) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout: La solicitud tardó demasiado')), timeout)
  );

const fetchWithTimeout = async (url, options = {}, timeout = DEFAULT_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Timeout: La solicitud tardó demasiado');
    }
    throw error;
  }
};

const handleApiError = (error, operation) => {
  console.error(`Error en ${operation}:`, error);
  if (error.message.includes('Timeout')) {
    throw new Error('El servidor está tardando demasiado en responder. Intenta de nuevo.');
  }
  if (error.message.includes('Failed to fetch')) {
    throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
  }
  throw error;
};

// ===== FUNCIONES PRINCIPALES =====

/**
 * Obtiene todos los productos del backend
 * @returns {Promise<Array<object>>} Array de productos
 */
export const obtenerProductos = async () => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/productos`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error HTTP ${response.status}: No se pudieron obtener los productos.`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    handleApiError(error, 'obtenerProductos');
  }
};

/**
 * Obtiene productos por categoría específica
 * @param {string} categoria - Nombre de la categoría
 * @returns {Promise<Array<object>>} Array de productos de la categoría
 */
export const obtenerProductosPorCategoria = async (categoria) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/productos/categoria/${encodeURIComponent(categoria)}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error HTTP ${response.status}: No se pudieron obtener los productos de la categoría.`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    handleApiError(error, `obtenerProductosPorCategoria (${categoria})`);
  }
};

/**
 * Obtiene un producto por su ID
 * @param {number|string} id - ID del producto
 * @returns {Promise<object>} Datos del producto
 */
export const obtenerProductoPorId = async (id) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/productos/${id}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error HTTP ${response.status}: No se pudo obtener el producto.`);
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, `obtenerProductoPorId (${id})`);
  }
};

/**
 * Obtiene todas las categorías disponibles
 * @returns {Promise<Array<object>>} Array de categorías
 */
export const obtenerCategorias = async () => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/categorias`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error HTTP ${response.status}: No se pudieron obtener las categorías.`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    handleApiError(error, 'obtenerCategorias');
  }
};

/**
 * Crea un nuevo producto
 * @param {FormData} formData - Datos del producto incluyendo imagen
 * @returns {Promise<object>} Producto creado
 */
export const crearNuevoProducto = async (formData) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/productos`, {
      method: 'POST',
      body: formData,
      // No establecer Content-Type, el navegador lo hace automáticamente
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error HTTP ${response.status}: No se pudo crear el producto.`);
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, 'crearNuevoProducto');
  }
};

/**
 * Actualiza un producto existente
 * @param {number|string} id - ID del producto
 * @param {object} datosProducto - Datos actualizados del producto
 * @returns {Promise<object>} Producto actualizado
 */
export const actualizarProducto = async (id, datosProducto) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosProducto),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error HTTP ${response.status}: No se pudo actualizar el producto.`);
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, `actualizarProducto (${id})`);
  }
};

/**
 * Elimina un producto
 * @param {number|string} id - ID del producto a eliminar
 * @returns {Promise<void>}
 */
export const eliminarProducto = async (id) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/productos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error HTTP ${response.status}: No se pudo eliminar el producto.`);
    }

    return; // DELETE no devuelve contenido
  } catch (error) {
    handleApiError(error, `eliminarProducto (${id})`);
  }
};

// ===== FUNCIONES DE UTILIDAD =====

/**
 * Verifica la conectividad con el servidor
 * @returns {Promise<boolean>} True si el servidor está disponible
 */
export const verificarConectividad = async () => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/health`, {}, 5000);
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Obtiene estadísticas de productos
 * @returns {Promise<object>} Estadísticas de productos
 */
export const obtenerEstadisticas = async () => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/productos/estadisticas`);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: No se pudieron obtener las estadísticas.`);
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, 'obtenerEstadisticas');
  }
};

// ===== FUNCIONES DE BÚSQUEDA =====

/**
 * Busca productos por término
 * @param {string} termino - Término de búsqueda
 * @returns {Promise<Array<object>>} Productos encontrados
 */
export const buscarProductos = async (termino) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/productos/buscar?q=${encodeURIComponent(termino)}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error HTTP ${response.status}: No se pudo realizar la búsqueda.`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    handleApiError(error, `buscarProductos (${termino})`);
  }
};

// ===== EXPORTACIONES =====
export default {
  obtenerProductos,
  obtenerProductosPorCategoria,
  obtenerProductoPorId,
  obtenerCategorias,
  crearNuevoProducto,
  actualizarProducto,
  eliminarProducto,
  verificarConectividad,
  obtenerEstadisticas,
  buscarProductos,
};