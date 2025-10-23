// =============================================================================
// src/components/ui/LoadingSpinner.tsx - COMPONENTE DE LOADING VERSIÓN 2.0
// =============================================================================

import { Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// ===== TIPOS =====
interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "default" | "primary" | "secondary";
    text?: string;
    className?: string;
}

interface LoadingStateProps {
    title?: string;
    description?: string;
    showRetry?: boolean;
    onRetry?: () => void;
    className?: string;
}

// ===== COMPONENTE SPINNER =====
export const LoadingSpinner = ({
    size = "md",
    variant = "default",
    text,
    className
}: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12"
    };

    const variantClasses = {
        default: "text-gray-600",
        primary: "text-red-600",
        secondary: "text-yellow-600"
    };

    return (
        <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
            <Loader2
                className={cn(
                    "animate-spin",
                    sizeClasses[size],
                    variantClasses[variant]
                )}
            />
            {text && (
                <p className="text-sm text-gray-600 font-medium">{text}</p>
            )}
        </div>
    );
};

// ===== COMPONENTE DE ESTADO DE CARGA =====
export const LoadingState = ({
    title = "Cargando...",
    description,
    showRetry = false,
    onRetry,
    className
}: LoadingStateProps) => (
    <div className={cn("w-full", className)}>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <LoadingSpinner size="lg" variant="primary" />
            <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                {description && (
                    <p className="text-sm text-gray-600">{description}</p>
                )}
                {showRetry && onRetry && (
                    <button
                        onClick={onRetry}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reintentar
                    </button>
                )}
            </div>
        </div>
    </div>
);

// ===== COMPONENTE DE LOADING CON OVERLAY =====
export const LoadingOverlay = ({
    isVisible,
    text = "Procesando...",
    className
}: {
    isVisible: boolean;
    text?: string;
    className?: string;
}) => {
    if (!isVisible) return null;

    return (
        <div className={cn(
            "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50",
            className
        )}>
            <div className="bg-white rounded-lg p-6 shadow-xl">
                <LoadingSpinner size="lg" variant="primary" text={text} />
            </div>
        </div>
    );
};

// ===== COMPONENTE DE LOADING INLINE =====
export const InlineLoading = ({
    text,
    className
}: {
    text?: string;
    className?: string;
}) => (
    <div className={cn("flex items-center space-x-2", className)}>
        <LoadingSpinner size="sm" variant="primary" />
        {text && (
            <span className="text-sm text-gray-600">{text}</span>
        )}
    </div>
);

// ===== COMPONENTE DE LOADING PARA BOTONES =====
export const ButtonLoading = ({
    isLoading,
    children,
    loadingText = "Cargando...",
    className
}: {
    isLoading: boolean;
    children: React.ReactNode;
    loadingText?: string;
    className?: string;
}) => (
    <button
        disabled={isLoading}
        className={cn(
            "inline-flex items-center justify-center",
            className
        )}
    >
        {isLoading ? (
            <>
                <LoadingSpinner size="sm" variant="default" />
                <span className="ml-2">{loadingText}</span>
            </>
        ) : (
            children
        )}
    </button>
);

export default LoadingSpinner;
