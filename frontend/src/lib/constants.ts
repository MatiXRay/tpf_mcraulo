// =============================================================================
// src/lib/constants.ts - CONSTANTES DEL PROYECTO VERSIÓN 2.0
// =============================================================================

// ===== CONFIGURACIÓN DE LA APLICACIÓN =====
export const APP_CONFIG = {
  name: "McRaulo's",
  version: "2.0.0",
  description: "Sistema de Pedidos McDonald's",
  apiUrl: "http://localhost:3000/api",
  timeout: 10000,
} as const;

// ===== CONFIGURACIÓN DE PRODUCTOS =====
export const PRODUCT_CONFIG = {
  defaultImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop",
  fallbackImage: "https://via.placeholder.com/150",
  maxImageSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
} as const;

// ===== CONFIGURACIÓN DE CATEGORÍAS =====
export const CATEGORIES = {
  hamburguesa: {
    name: "Hamburguesas",
    icon: "🍔",
    color: "red",
  },
  papa: {
    name: "Papas",
    icon: "🍟",
    color: "yellow",
  },
  bebida: {
    name: "Bebidas",
    icon: "🥤",
    color: "blue",
  },
  postre: {
    name: "Postres",
    icon: "🍦",
    color: "pink",
  },
  combo: {
    name: "Combos",
    icon: "🍽️",
    color: "green",
  },
} as const;

// ===== CONFIGURACIÓN DE PAGOS =====
export const PAYMENT_CONFIG = {
  methods: {
    cash: {
      name: "Efectivo",
      icon: "💵",
      description: "Pago en caja",
    },
    card: {
      name: "Tarjeta",
      icon: "💳",
      description: "Pago con tarjeta",
    },
  },
  currency: "USD",
  currencySymbol: "$",
} as const;

// ===== CONFIGURACIÓN DE UI =====
export const UI_CONFIG = {
  animations: {
    duration: 200,
    easing: "ease-out",
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  colors: {
    primary: "#dc2626", // Red-600
    secondary: "#eab308", // Yellow-500
    success: "#10b981", // Emerald-500
    warning: "#f59e0b", // Amber-500
    error: "#ef4444", // Red-500
  },
} as const;

// ===== CONFIGURACIÓN DE VALIDACIÓN =====
export const VALIDATION_CONFIG = {
  product: {
    name: {
      minLength: 2,
      maxLength: 100,
    },
    price: {
      min: 0.01,
      max: 999.99,
    },
    description: {
      maxLength: 500,
    },
  },
  cart: {
    maxItems: 50,
    maxQuantity: 10,
  },
} as const;

// ===== MENSAJES DEL SISTEMA =====
export const MESSAGES = {
  success: {
    productAdded: "Producto agregado al carrito",
    productRemoved: "Producto eliminado del carrito",
    orderPlaced: "Pedido realizado exitosamente",
  },
  error: {
    networkError: "Error de conexión. Verifica tu internet.",
    serverError: "Error del servidor. Intenta más tarde.",
    validationError: "Datos inválidos. Revisa la información.",
    timeoutError: "La operación tardó demasiado. Intenta de nuevo.",
  },
  loading: {
    products: "Cargando productos...",
    categories: "Cargando categorías...",
    processing: "Procesando...",
  },
} as const;

// ===== CONFIGURACIÓN DE DESARROLLO =====
export const DEV_CONFIG = {
  enableLogs: process.env.NODE_ENV === "development",
  enableDebug: process.env.NODE_ENV === "development",
  apiTimeout: 5000, // Menor timeout en desarrollo
} as const;
