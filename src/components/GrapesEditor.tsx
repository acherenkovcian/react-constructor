import React, { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
// Импортируем стили GrapesJS
import "grapesjs/dist/css/grapes.min.css";
// Импортируем базовые блоки (если нужны)
import gjsBasicBlocks from "grapesjs-blocks-basic";
import gjsPresetWebpage from "grapesjs-blocks-basic";

// Импортируем адаптер для React-компонентов
import setupReactAdapter from "../grapes/base-react-adapter";
// Импортируем регистрацию React-компонентов
import registerReactComponents from "../grapes/react-components";

interface GrapesEditorProps {
  // Здесь можем добавить пропсы по мере необходимости
}

const copyStylesAndScripts = (iframe: HTMLIFrameElement) => {
  const doc = iframe.contentDocument;
  //@ts-expect-error есть он
  const head = doc.head;

  // Копируем стили
  document
    .querySelectorAll('style, link[rel="stylesheet"]')
    .forEach((style) => {
      head.appendChild(style.cloneNode(true));
    });

  // Копируем скрипты
  document.querySelectorAll("script").forEach((script) => {
    //@ts-expect-error есть он
    const newScript = doc.createElement("script");
    newScript.textContent = script.textContent;
    head.appendChild(newScript);
  });
};

const GrapesEditor: React.FC<GrapesEditorProps> = () => {
  // Используем ref для хранения экземпляра редактора
  const editorRef = useRef<any>(null);

  useEffect(() => {
    // Инициализируем GrapesJS только после монтирования компонента
    if (!editorRef.current) {
      const editor = grapesjs.init({
        // Указываем DOM-элемент для размещения редактора
        container: "#gjs",
        // Базовые размеры редактора
        height: "100vh",
        width: "auto",
        // Настраиваем хранилище (localStorage)
        storageManager: {
          type: "local",
          autosave: true,
          autoload: true,
          stepsBeforeSave: 1,
        },
        // Включаем плагин базовых блоков
        plugins: [gjsBasicBlocks, gjsPresetWebpage],
        // Настраиваем блоки
        blockManager: {
          appendTo: "#blocks",
          blocks: [
            {
              id: "text",
              label: "Text",
              content: '<span data-gjs-type="text">Hello World</span>',
            },
          ],
        },
        // Добавляем панель с базовыми действиями
        panels: {
          defaults: [
            {
              id: "panel-top",
              el: ".panel__top",
            },
            {
              id: "basic-actions",
              el: ".panel__basic-actions",
              buttons: [
                {
                  id: "visibility",
                  active: true,
                  className: "btn-toggle-borders",
                  label: "<u>B</u>",
                  command: "sw-visibility",
                },
                {
                  id: "export",
                  className: "btn-export",
                  label: "Export",
                  command(editor) {
                    const projectData = editor.getProjectData();
                    const dataStr = JSON.stringify(projectData, null, 2);
                    const blob = new Blob([dataStr], {
                      type: "application/json",
                    });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "grapesjs-project.json";
                    a.click();
                  },
                },
              ],
            },
          ],
        },
        // Настройка Style Manager
        styleManager: {
          appendTo: "#styles-container",
          sectors: [
            {
              name: "Размеры",
              open: false,
              buildProps: [
                "width",
                "height",
                "min-width",
                "min-height",
                "max-width",
                "max-height",
                "padding",
                "margin",
              ],
            },
            {
              name: "Оформление",
              open: false,
              buildProps: [
                "background-color",
                "color",
                "font-size",
                "font-weight",
                "text-align",
                "letter-spacing",
              ],
            },
            {
              name: "Границы",
              open: false,
              buildProps: ["border-radius", "border", "box-shadow"],
            },
            {
              name: "Позиционирование",
              open: false,
              buildProps: [
                "position",
                "top",
                "right",
                "bottom",
                "left",
                "z-index",
              ],
            },
            {
              name: "Flex",
              open: false,
              buildProps: [
                "display",
                "flex-direction",
                "flex-wrap",
                "justify-content",
                "align-items",
                "align-content",
                "gap",
              ],
            },
          ],
        },

        // Настройка Trait Manager
        traitManager: {
          appendTo: "#traits-container",
        },
      });

      // Настраиваем адаптер для React-компонентов
      setupReactAdapter(editor);

      // Регистрируем React-компоненты
      registerReactComponents(editor);

      editor.on("load", () => {
        const iframe = editor.Canvas.getFrameEl();
        copyStylesAndScripts(iframe);
      });

      // Добавим переключение между вкладками
      editor.on("load", () => {
        const tabStyles = document.getElementById("tab-styles");
        const tabTraits = document.getElementById("tab-traits");
        const stylesContainer = document.getElementById("styles-container");
        const traitsContainer = document.getElementById("traits-container");

        tabStyles.addEventListener("click", () => {
          stylesContainer.classList.remove("hidden");
          traitsContainer.classList.add("hidden");
          tabStyles.classList.add("active");
          tabTraits.classList.remove("active");
        });

        tabTraits.addEventListener("click", () => {
          stylesContainer.classList.add("hidden");
          traitsContainer.classList.remove("hidden");
          tabStyles.classList.remove("active");
          tabTraits.classList.add("active");
        });
      });

      editorRef.current = editor;
    }

    // Очистка при размонтировании компонента
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div className="editor-row flex flex-1">
      <div className="panel__basic-actions"></div>
      {/* Панель блоков */}
      <div className="panel__left w-64 bg-gray-50 overflow-y-auto">
        <div id="blocks" className="p-2"></div>
      </div>

      {/* Canvas редактора */}
      <div className="editor-canvas flex-1">
        <div id="gjs" className="border-2 border-gray-300 h-full"></div>
      </div>

      {/* Панель стилей и свойств */}
      <div className="panel__right w-80 bg-gray-50 overflow-y-auto">
        <div className="tabs flex">
          <button id="tab-styles" className="tab-btn p-2 flex-1">
            Стили
          </button>
          <button id="tab-traits" className="tab-btn p-2 flex-1">
            Свойства
          </button>
        </div>
        <div id="styles-container" className="p-2"></div>
        <div id="traits-container" className="p-2 hidden"></div>
      </div>
    </div>
  );
};

export default GrapesEditor;
