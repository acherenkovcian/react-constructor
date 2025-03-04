import React, { HTMLAttributes, ReactNode } from "react";

// Типы для пропсов Flex
export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  wrap?: boolean;
  justify?: "start" | "center" | "end" | "between" | "around";
  items?: "start" | "center" | "end" | "stretch" | "baseline";
  gap?: number; // в единицах Tailwind (1-12)
  children?: ReactNode;
}

/**
 * Компонент Flex для гибкого контейнера с Tailwind CSS
 */
const Flex: React.FC<FlexProps> = ({
  direction = "row",
  wrap = false,
  justify = "start",
  items = "start",
  gap = 4,
  children,
  className = "",
  ...props
}) => {
  // Базовые классы
  const baseClasses = "flex p-2 border border-gray-300";

  // Классы для direction
  const directionClasses = {
    row: "flex-row",
    column: "flex-col",
  };

  // Классы для wrap
  const wrapClass = wrap ? "flex-wrap" : "flex-nowrap";

  // Классы для justify
  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };

  // Классы для items
  const itemsClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  // Класс для gap
  const gapClass = `gap-${gap}`;

  // Собираем все классы
  const classes = `${baseClasses} ${directionClasses[direction]} ${wrapClass} ${justifyClasses[justify]} ${itemsClasses[items]} ${gapClass} ${className}`;

  return (
    <div
      className={classes}
      style={{ padding: 24, border: "1px dashed gray" }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Flex;
