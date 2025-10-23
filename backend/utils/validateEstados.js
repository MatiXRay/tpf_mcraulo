// Lista de estados válidos extraídos de tu SQL
export const estadosValidos = ['Pendiente', 'En Preparación', 'Listo', 'Cancelado'];

// Función para validar si un estado es correcto
export const validarEstado = (estado) => {
  return estadosValidos.map(e => e.toLowerCase()).includes(estado.toLowerCase());
};