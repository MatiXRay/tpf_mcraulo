import multer from 'multer';

// Le decimos a multer que guarde los archivos en la memoria temporalmente
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limita el tamaño del archivo a 5MB
  }
});

export default upload;