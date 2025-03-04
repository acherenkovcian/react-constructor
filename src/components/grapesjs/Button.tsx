import React, { ButtonHTMLAttributes, ReactNode } from "react";

// Типы для пропсов Button
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  children?: ReactNode;
}

/**
 * Базовый компонент Button с поддержкой Tailwind CSS
 */
const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  children,
  className = "",
  ...props
}) => {
  // Базовые классы для всех кнопок
  const baseClasses =
    "font-medium rounded-md focus:outline-none transition-colors";

  // Классы для вариантов
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
  };

  // Классы для размеров
  const sizeClasses = {
    small: "text-sm py-1 px-3",
    medium: "text-base py-2 px-4",
    large: "text-lg py-3 px-6",
  };

  // Собираем все классы
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
