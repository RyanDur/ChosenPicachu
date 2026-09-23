import {onTestFinished} from 'vitest';

type Move = 'insertBefore' | 'appendChild';

const blurring = <T extends Node>(node: T): void => {
  const focused = document.activeElement;
  if (node instanceof HTMLElement && focused instanceof HTMLElement && node.contains(focused)) {
    focused.blur();
  }
};

const losingFocusOn = (move: Move): void => {
  const untouched = Object.getOwnPropertyDescriptor(Node.prototype, move);
  if (untouched) {
    Node.prototype[move] = function <T extends Node>(this: Node, node: T, ...rest: readonly (Node | null)[]): T {
      blurring(node);
      return Reflect.apply(untouched.value, this, [node, ...rest]);
    };
    onTestFinished(() => {
      Object.defineProperty(Node.prototype, move, untouched);
    });
    return;
  }
  throw new Error(`no ${move} to blur`);
};

// the browser blurs a focused node when it is moved in the DOM; jsdom does not, so the suite supplies the loss
export const blurFocusOnMoves = (): void => {
  losingFocusOn('insertBefore');
  losingFocusOn('appendChild');
};
