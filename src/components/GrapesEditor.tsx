import React, { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
// Импортируем стили GrapesJS
import "grapesjs/dist/css/grapes.min.css";
// Импортируем базовые блоки (если нужны)
import gjsBlocks from "grapesjs-blocks-basic";

// Импортируем адаптер для React-компонентов
import setupReactAdapter from "../grapes/base-react-adapter";
// Импортируем регистрацию React-компонентов
import registerReactComponents from "../grapes/react-components";

interface GrapesEditorProps {
  // Здесь можем добавить пропсы по мере необходимости
}

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
          type: 'local',
          autosave: true,
          autoload: true,
          stepsBeforeSave: 1
        },
        // Включаем плагин базовых блоков
        plugins: [gjsBlocks],
        // Настраиваем блоки
        blockManager: {
          appendTo: "#blocks",
          blocks: [
            {
              id: "text",
              label: "Text",
              content: '<div class="text-gray-700 p-2">Hello World</div>',
            },
          ],
        },
        // Добавляем панель с базовыми действиями
        panels: {
          defaults: [
            {
              id: 'panel-top',
              el: '.panel__top',
            },
            {
              id: 'basic-actions',
              el: '.panel__basic-actions',
              buttons: [
                {
                  id: 'visibility',
                  active: true,
                  className: 'btn-toggle-borders',
                  label: '<u>B</u>',
                  command: 'sw-visibility',
                },
                {
                  id: 'export',
                  className: 'btn-export',
                  label: 'Export',
                  command(editor) {
                    const projectData = editor.getProjectData();
                    const dataStr = JSON.stringify(projectData, null, 2);
                    const blob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'grapesjs-project.json';
                    a.click();
                  },
                },
              ],
            },
          ],
        },
      });

      // Настраиваем адаптер для React-компонентов
      setupReactAdapter(editor);

      // Регистрируем React-компоненты
      registerReactComponents(editor);

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
    <div className="editor-wrapper h-screen flex flex-col">
      {/* Верхняя панель */}
      <div className="panel__top p-2 bg-gray-100 flex">
        <div className="panel__basic-actions"></div>
      </div>

      {/* Основная область редактора */}
      <div className="editor-row flex flex-1">
        {/* Панель блоков */}
        <div className="panel__right w-64 bg-gray-50 overflow-y-auto">
          <div id="blocks" className="p-2"></div>
        </div>

        {/* Canvas редактора */}
        <div className="editor-canvas flex-1">
          <div id="gjs" className="border-2 border-gray-300 h-full"></div>
        </div>
      </div>
    </div>
  );
};

export default GrapesEditor;
