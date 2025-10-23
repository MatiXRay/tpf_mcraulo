// app.js
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import { testConnection } from './db/db.js';

// Importar rutas
import categoriaRoutes from './routes/categoria.routes.js';
import ingredienteRoutes from './routes/ingrediente.routes.js';
import productoRoutes from './routes/producto.routes.js';
import pedidoRoutes from './routes/pedidos.routes.js';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para entender JSON
app.use(express.json());
app.use(cors());

// Probar conexión a la DB
testConnection().then(isConnected => {
  if (isConnected) {
    // Rutas de la API
    app.use('/api/categorias', categoriaRoutes);
    app.use('/api/ingredientes', ingredienteRoutes);
    app.use('/api/productos', productoRoutes);
    app.use('/api/pedidos', pedidoRoutes);

    // Middleware para manejo de rutas no encontradas (404)
    app.use((req, res, next) => {
      res.status(404).json({ error: 'Ruta no encontrada' });
    });

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } else {
    console.error('No se pudo iniciar el servidor debido a un error de conexión con la base de datos.');
    process.exit(1); // Detener la aplicación si no hay conexión a la DB
  }
});