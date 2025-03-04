import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { Editor } from "grapesjs";

// Атрибут для маркера дочерних элементов
const CHILDREN_MARKER_ATTR = "data-gjs-children";

/**
 * Базовый адаптер для React-компонентов в GrapesJS
 * @param editor Экземпляр редактора GrapesJS
 */
export default function setupReactAdapter(editor: Editor) {
  const domc = editor.DomComponents;
  const defaultType = domc.getType("default");
  const defaultModel = defaultType.model;

  // Добавляем базовый тип для React-компонентов
  domc.addType("react-component", {
    model: {
      // Переопределяем метод toHTML для корректного экспорта React-компонентов
      toHTML(opts = {}) {
        // Используем оригинальный метод, но заменяем тег на имя компонента
        return defaultModel.prototype.toHTML.call(this, {
          ...opts,
          tag: this.get("type"),
        });
      },
    },
    view: {
      // Базовый тег для контейнера
      tagName: () => "div",

      // Корень React для этого компонента
      _reactRoot: null as Root | null,

      // Временный контейнер для дочерних элементов
      _childrenContainer: null as HTMLElement | null,

      // Инициализация адаптера
      init() {
        const { model } = this;

        // Слушаем изменения атрибутов для перерендеринга
        this.listenTo(model, "change:attributes", this.render);

        // Слушаем изменения дочерних компонентов
        this.listenTo(
          model.components(),
          "add remove reset",
          this.handleComponentsChange,
        );
      },

      /**
       * Обрабатывает изменения дочерних компонентов с задержкой
       * для предотвращения множественных рендерингов
       */
      handleComponentsChange() {
        clearTimeout(this._componentChangeTimeout);
        this._componentChangeTimeout = setTimeout(() => this.render(), 0);
      },

      /**
       * Создает временный контейнер для дочерних элементов
       */
      getChildrenContainerHolder() {
        if (!this._childrenContainer) {
          this._childrenContainer = document.createElement("div");
          this._childrenContainer.style.display = "none";
        }
        return this._childrenContainer;
      },

      /**
       * Возвращает контейнер для дочерних элементов
       * Если маркер существует - возвращает его, иначе - временный контейнер
       */
      getChildrenContainer() {
        const childrenMarker = this.el.querySelector(
          `[${CHILDREN_MARKER_ATTR}]`,
        );
        return childrenMarker || this.getChildrenContainerHolder();
      },

      /**
       * Создает маркер для дочерних элементов в React-компоненте
       */
      createChildrenMarker() {
        return React.createElement("span", { [CHILDREN_MARKER_ATTR]: true });
      },

      /**
       * Создает React-элемент для компонента с маркером для детей
       */
      createReactElement() {
        const { model } = this;
        const Component = model.get("component");
        const props = { ...model.get("attributes") };

        // Создаем React-элемент с маркером для детей
        return React.createElement(
          Component,
          props,
          this.createChildrenMarker(),
        );
      },

      /**
       * Рендерит React-компонент в DOM-элемент
       */
      renderReactComponent() {
        const { el } = this;

        // Создаем корень React, если его еще нет
        if (!this._reactRoot) {
          this._reactRoot = createRoot(el);
        }

        // Рендерим React-компонент
        this._reactRoot.render(this.createReactElement());
      },

      /**
       * Перемещает дочерние элементы из временного контейнера в маркер
       */
      attachChildren() {
        const { el } = this;
        const childrenMarker = el.querySelector(`[${CHILDREN_MARKER_ATTR}]`);

        // Если маркер найден, перемещаем дочерние элементы
        if (childrenMarker) {
          const tmpContainer = this.getChildrenContainerHolder();

          // Переносим все дочерние элементы из временного контейнера в маркер
          while (tmpContainer.firstChild) {
            childrenMarker.appendChild(tmpContainer.firstChild);
          }
        }
      },

      /**
       * Основной метод рендеринга, вызываемый GrapesJS
       */
      render() {
        // Обновляем атрибуты элемента
        this.updateAttributes();

        // Рендерим дочерние компоненты в временный контейнер
        this.renderChildren();

        // Рендерим React-компонент
        this.renderReactComponent();

        // Перемещаем дочерние элементы в маркер
        this.attachChildren();

        return this;
      },

      /**
       * Очистка при удалении компонента
       */
      remove() {
        // Очищаем таймер
        clearTimeout(this._componentChangeTimeout);

        // Размонтируем React-компонент если он есть
        if (this._reactRoot) {
          this._reactRoot.unmount();
          this._reactRoot = null;
        }

        // Вызываем базовый метод remove
        defaultType.view.prototype.remove.apply(this);
      },
    },
  });
}
