import {onTestFinished} from 'vitest';

// the browser blurs a focused node when it is moved in the DOM; jsdom does not, so the suite supplies the loss
export const blurFocusOnMoves = (): void => {
  const untouched = Object.getOwnPropertyDescriptor(Node.prototype, 'insertBefore');
  if (untouched) {
    Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, child: Node | null): T {
      const focused = document.activeElement;
      if (node instanceof HTMLElement && focused instanceof HTMLElement && node.contains(focused)) {
        focused.blur();
      }
      return Reflect.apply(untouched.value, this, [node, child]);
    };
    onTestFinished(() => {
      Object.defineProperty(Node.prototype, 'insertBefore', untouched);
    });
    return;
  }
  throw new Error('no insertBefore to blur');
};
