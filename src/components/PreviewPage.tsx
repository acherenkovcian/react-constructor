import React, { useState, useEffect, useCallback } from "react";
import grapesjs, { Editor } from "grapesjs";
import parse, { DOMNode, domToReact } from "html-react-parser";
import Button from "../components/grapesjs/Button";
import Flex from "../components/grapesjs/Flex";

// Создаем маппинг типов компонентов на реальные React-компоненты
const componentMap = {
  REACTBUTTON: {
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
  REACTFLEX: {
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
};

const customTagComponents = (editor: Editor) => {
  editor.DomComponents.addType("REACTBUTTON", {
    extend: "react-component",
    model: {
      defaults: {
        tagName: "REACTBUTTON",
        attributes: {
          variant: "primary",
          size: "medium",
        },
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
    isComponent: (el) => el.tagName === "REACTBUTTON",
  });

  editor.DomComponents.addType("REACTFLEX", {
    extend: "react-component",
    model: {
      defaults: {
        tagName: "REACTFLEX",
        attributes: {
          direction: "row",
          wrap: false,
          justify: "start",
          items: "start",
          gap: 4,
        },
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
    isComponent: (el) => el.tagName === "REACTFLEX",
  });
};

const htmlToReactComponents = (html: string) => {
  console.log(html);
  return parse(html, {
    replace(domNode) {
      console.log(domNode.name);
      if (domNode.type === "tag" && componentMap[domNode.name]) {
        const { component: Component, traits } = componentMap[domNode.name];

        const attribs = Object.entries(domNode.attribs || {}).reduce(
          (acc, [key, value]) => {
            const trait = traits?.find((trait) => {
              if (typeof trait === "string") {
                return trait.toLowerCase() === key.toLowerCase();
              }

              return trait.name?.toLowerCase() === key.toLowerCase();
            });

            // системные поля
            if (!trait) {
              acc[key] = value;

              return acc;
            }

            // поля в которых может быть потерян регистр
            if (typeof trait === "string") {
              acc[trait] = value;

              return acc;
            }

            // булевые поля
            if (trait.type === "checkbox") {
              acc[trait.name || key] = true;

              return acc;
            }

            // остальные типы
            acc[trait.name || key] = value;

            return acc;
          },
          {} as Record<string, string | boolean>,
        );

        return (
          <Component {...attribs}>
            {domNode.children && domToReact(domNode.children as DOMNode[])}
          </Component>
        );
      }

      return domNode;
    },
  });
};

const initializeGrapesJS = (jsonConfig) => {
  // Создаем временный контейнер для GrapesJS
  const tempContainer = document.createElement("div");
  tempContainer.style.display = "none";
  document.body.appendChild(tempContainer);

  // Инициализируем GrapesJS в headless режиме
  const editor = grapesjs.init({
    container: tempContainer,
    headless: true,
    storageManager: { type: "none" },
  });

  customTagComponents(editor);

  // Загружаем конфигурацию из JSON
  editor.loadProjectData(jsonConfig);

  // Получаем HTML
  const html = editor.getHtml();

  // Чистим за собой
  document.body.removeChild(tempContainer);
  editor.destroy();

  return html;
};

const TestPreview = () => {
  const [output, setOutput] = useState({
    json: null,
    html: "",
    react: null,
  });

  // Тестовый JSON из вашего примера
  const testJson ={
    "assets": [],
    "styles": [],
    "pages": [
      {
        "frames": [
          {
            "component": {
              "type": "wrapper",
              "stylable": [
                "background",
                "background-color",
                "background-image",
                "background-repeat",
                "background-attachment",
                "background-position",
                "background-size"
              ],
              "attributes": {
                "id": "iy6y"
              },
              "components": [
                {
                  "type": "REACTFLEX",
                  "content": "<div>Flex контейнер</div>",
                  "attributes": {
                    "direction": "row",
                    "wrap": false,
                    "justify": "start",
                    "items": "start",
                    "gap": 4
                  }
                }
              ],
              "head": {
                "type": "head"
              },
              "docEl": {
                "tagName": "html"
              }
            },
            "id": "jMtHlvVWHQ2VEAsC"
          }
        ],
        "type": "main",
        "id": "gm1nl9WHzzlNYJMA"
      }
    ],
    "symbols": [],
    "dataSources": []
  };

  const start = () => {
    const testPreview = async () => {
      // Шаг 1: Выводим исходный JSON
      console.log("Исходный JSON:", testJson);
      setOutput((prev) => ({ ...prev, json: testJson }));

      // Шаг 2: Инициализируем GrapesJS и получаем HTML
      const html = await initializeGrapesJS(testJson);
      console.log("Сгенерированный HTML:", html);
      setOutput((prev) => ({ ...prev, html }));

      // Шаг 3: Преобразуем HTML в React
      const reactComponent = htmlToReactComponents(html);
      console.log("React компонент:", reactComponent);
      setOutput((prev) => ({ ...prev, react: reactComponent }));
    };

    testPreview();
  };

  return (
    <div>
      <button onClick={start}>start</button>
      <h2>Тестовое превью</h2>
      <div>
        <h3>Исходный JSON:</h3>
        <pre>{JSON.stringify(output.json, null, 2)}</pre>
      </div>
      <div>
        <h3>Сгенерированный HTML:</h3>
        <pre>{output.html}</pre>
      </div>
      <div>
        <h3>React компоненты:</h3>
        {output.react}
      </div>
    </div>
  );
};

export default TestPreview;
