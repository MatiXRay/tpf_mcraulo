// =============================================================================
// src/pages/Login.tsx - CORREGIDO
// =============================================================================

import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom" // 1. Importar useNavigate

export default function Login() {
  const navigate = useNavigate(); // 2. Inicializar el hook de navegación

  // 3. Función para manejar el "submit" del formulario
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir que la página se recargue
    // Aquí iría tu lógica de autenticación en el futuro
    console.log("Simulando inicio de sesión...");
    navigate("/"); // 4. Redirigir al usuario al Home
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h1>
        <p className="mt-2 text-gray-500">Bienvenido de vuelta</p>
        
        {/* 5. Usar un formulario real con el evento onSubmit */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Aquí puedes agregar los inputs de email y contraseña */}
          <div>
            <label className="sr-only">Usuario</label>
            <input className="w-full px-4 py-2 border rounded-md" placeholder="Usuario (demo)" />
          </div>
          <div>
            <label className="sr-only">Contraseña</label>
            <input type="password" className="w-full px-4 py-2 border rounded-md" placeholder="Contraseña (demo)" />
          </div>
          
          {/* 6. El botón ahora es de tipo "submit" */}
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-lg py-6">
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  )
}