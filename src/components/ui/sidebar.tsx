import { Home, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo_mcraulo.svg';

interface SideBarProps {
  onCategorySelect?: (categoria: string) => void;
}

const SideBar = ({ onCategorySelect }: SideBarProps) => {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Inicio",
      icon: Home,
      isActive: location.pathname === "/"
    },
    {
      path: "/admin",
      label: "Administracion",
      icon: Settings,
      isActive: location.pathname === "/admin",
      variant: "secondary" as const
    }
  ];

  const categories = [
    { id: "todas", label: "Todos los pruductos" },
    { id: "hamburguesas", label: "Hamburguesas" },
    { id: "bebidas", label: "Bebidas" },
    { id: "combos", label: "Combos" },
    { id: "papas", label: "Papas" }
  ];

  return (
    <div className="w-64 bg-white/95 backdrop-blur-sm text-gray-800 flex flex-col p-6 shadow-lg border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-center my-8">
        <img
          src={Logo}
          alt="McRaulo Logo"
          className="w-36 h-auto hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Navegación principal */}
      <nav className="flex flex-col space-y-3 mb-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={item.variant || "ghost"}
                className={`w-full justify-start text-lg py-6 hover:bg-red-50 focus:bg-red-100 text-gray-700 transition-all duration-200 ${item.isActive
                  ? 'bg-red-100 text-red-700 font-semibold shadow-sm'
                  : 'hover:shadow-sm'
                  } ${item.variant === 'secondary'
                    ? 'text-yellow-600 hover:bg-yellow-50 focus:bg-yellow-100 hover:text-yellow-700'
                    : ''
                  }`}
              >
                <Icon className="mr-4 h-6 w-6" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Filtros por categoría */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Filtrar por categoría</h3>
        <div className="flex flex-col space-y-2">
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant="outline"
              className="w-full justify-start text-sm py-4 hover:bg-yellow-50 hover:text-yellow-700 transition"
              onClick={() => onCategorySelect?.(cat.id)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">McRaulo</p>
      </div>
    </div>
  );
};

export default SideBar;
