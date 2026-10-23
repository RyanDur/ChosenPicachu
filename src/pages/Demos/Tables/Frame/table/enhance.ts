import {nothingToUndo, Undo} from './undo';

export const enhancing = (enhance: (host: HTMLElement) => Undo): CustomElementConstructor =>
  class extends HTMLElement {
    #undo: Undo = nothingToUndo;

    connectedCallback(): void {
      this.#undo = enhance(this);
    }

    disconnectedCallback(): void {
      this.#undo();
    }
  };
