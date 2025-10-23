export function crearNuevoProducto(formData: FormData): Promise<any>;
export function obtenerCategorias(): Promise<any>;
export function obtenerProductos(): Promise<any>;
export function obtenerProductosPorCategoria(categoria: string): Promise<any>;
export function obtenerProductoPorId(id: number | string): Promise<any>;
export function actualizarProducto(id: number | string, datosProducto: any): Promise<any>;
export function eliminarProducto(id: number | string): Promise<void>;
export function getProductosPorCategoria(categoria: string): Promise<any>;

export default {};
