import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// Conexión a la base de datos desde la variable de entorno
const sql = postgres(process.env.DATABASE_URL, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false
});

// Función para probar la conexión
export const testConnection = async () => {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (err) {
    console.error('Error de conexión a la base de datos:', err);
    return false;
  }
};

export default sql;