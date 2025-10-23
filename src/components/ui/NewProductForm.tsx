import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Button } from './button';
import { crearNuevoProducto } from '../../../services/productosApi'; // Ajusta la ruta si es necesario

// Definimos una interfaz para las categorías
interface Categoria {
  idtipoproducto: number;
  categoria: string;
}

const NewProductForm = () => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idTipoProducto, setIdTipoProducto] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Efecto para cargar las categorías cuando el componente se monta
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        // Asumimos que tienes un endpoint para obtener las categorías
        const response = await fetch('http://localhost:3000/api/categorias');
        if (!response.ok) {
          throw new Error('No se pudieron cargar las categorías');
        }
        const data = await response.json();
        // El backend devuelve { total, categorias } o en algunos casos un array directo.
        // Normalizamos a un array para evitar errores como "categorias.map is not a function".
        const cats = Array.isArray(data) ? data : (data && Array.isArray(data.categorias) ? data.categorias : []);
        setCategorias(cats);
        if (cats.length > 0) {
          setIdTipoProducto(cats[0].idtipoproducto.toString());
        }
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('Ocurrió un error desconocido');
        }
      }
    };

    fetchCategorias();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!nombre || !precio || !idTipoProducto) {
      setError('Por favor, completa todos los campos requeridos.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('descripcion', descripcion);
    formData.append('idTipoProducto', idTipoProducto);
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      const nuevoProducto = await crearNuevoProducto(formData);
      setSuccess(`¡Producto "${nuevoProducto.nombre}" creado con éxito!`);
      // Limpiar el formulario
      setNombre('');
      setPrecio('');
      setDescripcion('');
      setImagen(null);
      if (categorias.length > 0) {
        setIdTipoProducto(categorias[0].idtipoproducto.toString());
      }
      // Resetea el input de archivo
      const fileInput = e.target as HTMLFormElement;
      fileInput.reset();

    } catch (err) {
        if (err instanceof Error) {
            setError(`Error al crear el producto: ${err.message}`);
        } else {
            setError('Ocurrió un error desconocido');
        }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg p-6 bg-white shadow-md rounded-lg">
      {error && <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>}
      {success && <p className="text-green-500 bg-green-100 p-3 rounded">{success}</p>}
      
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
        <input
          id="precio"
          type="number"
          step="0.01"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
        <select
          id="categoria"
          value={idTipoProducto}
          onChange={(e) => setIdTipoProducto(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          {categorias.map((cat) => (
            <option key={cat.idtipoproducto} value={cat.idtipoproducto.toString()}>
              {cat.categoria}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="imagen" className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
        <input
          id="imagen"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      <Button type="submit" className="w-full">
        Crear Producto
      </Button>
    </form>
  );
};

export default NewProductForm;