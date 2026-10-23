export type Undo = () => void;

export const nothingToUndo: Undo = () => undefined;

export const listen = <Type extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  type: Type,
  handler: (event: HTMLElementEventMap[Type]) => void
): Undo => {
  target.addEventListener(type, handler);
  return () => target.removeEventListener(type, handler);
};

export const undoingAll = (undos: readonly Undo[]): Undo => () => undos.forEach(undo => undo());
