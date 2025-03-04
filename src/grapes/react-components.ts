import Button from "../components/grapesjs/Button";
import Flex from "../components/grapesjs/Flex";
import { Editor } from "grapesjs";

/**
 * Регистрирует React-компоненты в GrapesJS
 * @param editor Экземпляр редактора GrapesJS
 */
export default function registerReactComponents(editor: Editor) {
  // Регистрируем Button компонент
  editor.DomComponents.addType("Button", {
    extend: "react-component",
    model: {
      defaults: {
        // Указываем React-компонент
        component: Button,

        // Указываем, что компонент можно стилизовать
        stylable: true,

        // Базовые атрибуты (пропсы)
        attributes: {
          variant: "primary",
          size: "medium",
        },

        // Настройка traits для UI редактирования
        traits: [
          {
            type: "select",
            name: "variant",
            label: "Вариант",
            options: [
              { id: "variant-primary", value: "primary", name: "Основной" },
              {
                id: "variant-secondary",
                value: "secondary",
                name: "Вторичный",
              },
              { id: "variant-outline", value: "outline", name: "Контурный" },
            ],
          },
          {
            type: "select",
            name: "size",
            label: "Размер",
            options: [
              { id: "size-small", value: "small", name: "Маленький" },
              { id: "size-medium", value: "medium", name: "Средний" },
              { id: "size-large", value: "large", name: "Большой" },
            ],
          },
        ],
      },
    },
    isComponent: (el) =>
      el.tagName === "BUTTON" ||
      (el.tagName === "DIV" && el.getAttribute("data-gjs-type") === "Button"),
  });

  // Регистрируем Flex компонент
  editor.DomComponents.addType("Flex", {
    extend: "react-component",
    model: {
      defaults: {
        // Указываем React-компонент
        component: Flex,

        // Указываем, что компонент можно стилизовать
        stylable: true,

        // Разрешаем перетаскивать другие компоненты внутрь
        droppable: true,

        // Базовые атрибуты (пропсы)
        attributes: {
          direction: "row",
          wrap: false,
          justify: "start",
          items: "start",
          gap: 4,
        },

        // Настройка traits для UI редактирования
        traits: [
          {
            type: "select",
            name: "direction",
            label: "Направление",
            options: [
              { id: "direction-row", value: "row", name: "Горизонтально" },
              { id: "direction-column", value: "column", name: "Вертикально" },
            ],
          },
          {
            type: "checkbox",
            name: "wrap",
            label: "Перенос",
          },
          {
            type: "select",
            name: "justify",
            label: "Выравнивание (основная ось)",
            options: [
              { id: "justify-start", value: "start", name: "Начало" },
              { id: "justify-center", value: "center", name: "Центр" },
              { id: "justify-end", value: "end", name: "Конец" },
              { id: "justify-between", value: "between", name: "Равномерно" },
              { id: "justify-around", value: "around", name: "По краям" },
            ],
          },
          {
            type: "select",
            name: "items",
            label: "Выравнивание (поперечная ось)",
            options: [
              { id: "items-start", value: "start", name: "Начало" },
              { id: "items-center", value: "center", name: "Центр" },
              { id: "items-end", value: "end", name: "Конец" },
              { id: "items-stretch", value: "stretch", name: "Растянуть" },
              {
                id: "items-baseline",
                value: "baseline",
                name: "По базовой линии",
              },
            ],
          },
          {
            type: "number",
            name: "gap",
            label: "Отступ",
            min: 0,
            max: 12,
          },
        ],
      },
    },
    isComponent: (el) =>
      el.tagName === "DIV" &&
      (el.classList.contains("flex") ||
        el.getAttribute("data-gjs-type") === "Flex"),
  });

  // Добавляем блоки в панель блоков
  editor.BlockManager.add("button", {
    label: "Button",
    category: "React Components",
    content: {
      type: "Button",
      content: "Нажми меня",
    },
  });

  editor.BlockManager.add("flex", {
    label: "Flex Container",
    category: "React Components",
    content: {
      type: "Flex",
      content: "<div>Flex контейнер</div>",
    },
  });
}
