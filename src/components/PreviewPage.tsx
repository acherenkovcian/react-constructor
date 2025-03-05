import { useState } from "react";
import grapesjs, { Editor } from "grapesjs";
import parse, { DOMNode, domToReact } from "html-react-parser";
import Button from "../components/grapesjs/Button";
import Flex from "../components/grapesjs/Flex";

// Создаем маппинг типов компонентов на реальные React-компоненты
const componentMap = {
  reactbutton: {
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
  reactflex: {
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
  console.log("Исходный HTML:", html);

  // Создаем объект параметров парсера один раз
  const parseOptions = {
    replace(domNode) {
      if (domNode.type !== "tag") return domNode;

      const tagName = domNode.name?.toLowerCase();
      console.log(`Обработка тега: ${tagName}`);

      if (componentMap[tagName]) {
        const { component: Component, traits } = componentMap[tagName];

        // Преобразование атрибутов
        const attribs = Object.entries(domNode.attribs || {}).reduce(
            (acc, [key, value]) => {
              const trait = traits?.find(trait => {
                if (typeof trait === 'string') {
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
              if (typeof trait === 'string') {
                acc[trait] = value;

                return acc;
              }

              // булевые поля
              if (trait.type === 'checkbox') {
                acc[trait.name || key] = true;

                return acc;
              }

              // остальные типы
              acc[trait.name || key] = value;

              return acc;
            },
            {} as Record<string, string | boolean>,
        );

        console.log(`Создание React-компонента для ${tagName}:`, attribs);

        // Важно: передаем те же настройки для рекурсивной обработки
        return (
          <Component {...attribs}>
            {domNode.children &&
              domToReact(domNode.children as DOMNode[], parseOptions)}
          </Component>
        );
      }

      // Обычный элемент - просто продолжаем рекурсивную обработку его детей
      if (domNode.children) {
        return {
          ...domNode,
          children: domToReact(domNode.children as DOMNode[], parseOptions),
        };
      }

      return domNode;
    },
  };

  return parse(html, parseOptions);
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
  const css = editor.getCss();

  console.log(css);

  // Чистим за собой
  document.body.removeChild(tempContainer);
  editor.destroy();

  return { html, css };
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
    "styles": [
      {
        "selectors": [
          {
            "name": "gjs-row",
            "private": 1
          }
        ],
        "style": {
          "display": "table",
          "padding-top": "10px",
          "padding-right": "10px",
          "padding-bottom": "10px",
          "padding-left": "10px",
          "width": "100%"
        }
      },
      {
        "selectors": [
          {
            "name": "gjs-cell",
            "private": 1
          }
        ],
        "style": {
          "width": "100%",
          "display": "block"
        },
        "mediaText": "(max-width: 768px)",
        "atRuleType": "media"
      },
      {
        "selectors": [
          "gjs-cell30"
        ],
        "style": {
          "width": "100%",
          "display": "block"
        },
        "mediaText": "(max-width: 768px)",
        "atRuleType": "media"
      },
      {
        "selectors": [
          "gjs-cell70"
        ],
        "style": {
          "width": "100%",
          "display": "block"
        },
        "mediaText": "(max-width: 768px)",
        "atRuleType": "media"
      },
      {
        "selectors": [
          {
            "name": "gjs-cell",
            "private": 1
          }
        ],
        "style": {
          "width": "8%",
          "display": "table-cell",
          "height": "75px"
        }
      },
      {
        "selectors": [
          "text-gray-700",
          "p-2"
        ],
        "style": {
          "max-width": "600px",
          "width": "100%",
          "text-align": "center",
          "font-size": "32px",
          "background-color": "#ffa5a5"
        }
      },
      {
        "selectors": [
          "#io3a"
        ],
        "style": {
          "display": "flex",
          "align-items": "flex-start",
          "gap": "12px",
          "width": "100%",
          "height": "auto",
          "min-height": "20px"
        }
      },
      {
        "selectors": [
          "#imxr"
        ],
        "style": {
          "display": "block"
        }
      },
      {
        "selectors": [
          "#ihzkl"
        ],
        "style": {
          "padding": "24px 24px 24px 24px",
          "border": "3px solid red"
        }
      }
    ],
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
                  "name": "Row",
                  "droppable": ".gjs-cell",
                  "resizable": {
                    "tl": 0,
                    "tc": 0,
                    "tr": 0,
                    "cl": 0,
                    "cr": 0,
                    "bl": 0,
                    "br": 0,
                    "minDim": 1
                  },
                  "classes": [
                    {
                      "name": "gjs-row",
                      "private": 1
                    }
                  ],
                  "attributes": {
                    "id": "ivyn"
                  },
                  "components": [
                    {
                      "name": "Cell",
                      "draggable": ".gjs-row",
                      "resizable": {
                        "tl": 0,
                        "tc": 0,
                        "tr": 0,
                        "cl": 0,
                        "cr": 1,
                        "bl": 0,
                        "br": 0,
                        "minDim": 1,
                        "bc": 0,
                        "currentUnit": 1,
                        "step": 0.2
                      },
                      "classes": [
                        {
                          "name": "gjs-cell",
                          "private": 1
                        }
                      ],
                      "attributes": {
                        "id": "io3a"
                      },
                      "components": [
                        {
                          "tagName": "reactbutton",
                          "type": "ReactButton",
                          "content": "Нажми меня",
                          "attributes": {
                            "variant": "primary",
                            "size": "large",
                            "id": "imxr"
                          }
                        },
                        {
                          "tagName": "reactbutton",
                          "type": "ReactButton",
                          "content": "Нажми меня",
                          "attributes": {
                            "variant": "secondary",
                            "size": "small",
                            "id": "ic45"
                          }
                        },
                        {
                          "tagName": "reactbutton",
                          "type": "ReactButton",
                          "content": "Нажми меня",
                          "attributes": {
                            "variant": "outline",
                            "size": "medium",
                            "id": "ic45-2"
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  "tagName": "reactflex",
                  "type": "ReactFlex",
                  "content": "<div>Flex контейнер</div>",
                  "attributes": {
                    "direction": "row",
                    "wrap": false,
                    "justify": "start",
                    "items": "start",
                    "gap": 4,
                    "id": "ihzkl"
                  },
                  "components": [
                    {
                      "tagName": "reactbutton",
                      "type": "ReactButton",
                      "content": "Нажми меня",
                      "attributes": {
                        "variant": "primary",
                        "size": "medium"
                      }
                    },
                    {
                      "tagName": "reactbutton",
                      "type": "ReactButton",
                      "content": "Нажми меня",
                      "attributes": {
                        "variant": "primary",
                        "size": "medium",
                        "id": "idcx6"
                      }
                    }
                  ]
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
  }

  const start = () => {
    const testPreview = async () => {
      // Шаг 1: Выводим исходный JSON
      console.log("Исходный JSON:", testJson);
      setOutput((prev) => ({ ...prev, json: testJson }));

      // Шаг 2: Инициализируем GrapesJS и получаем HTML
      const { html, css } = await initializeGrapesJS(testJson);
      console.log("Сгенерированный HTML:", html);
      setOutput((prev) => ({ ...prev, html }));

      // Шаг 3: Преобразуем HTML в React
      const reactComponent = htmlToReactComponents(html);
      console.log("React компонент:", reactComponent);
      setOutput((prev) => ({ ...prev, react: reactComponent }));

      const sheet = new CSSStyleSheet();
      sheet.replaceSync(css);
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
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
