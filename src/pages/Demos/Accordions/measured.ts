const moves = (panel: HTMLElement): boolean => parseFloat(getComputedStyle(panel).transitionDuration) > 0;

const textHeight = (panel: HTMLElement): number => panel.firstElementChild?.getBoundingClientRect().height ?? 0;

const setsHeight = (panel: HTMLElement, height: number): void => {
  panel.style.setProperty('--measured-height', `${height}px`);
  void panel.offsetHeight;
};

const startsAt = (panel: HTMLElement, height: number): void => {
  panel.classList.add('unmoving', 'sized');
  setsHeight(panel, height);
  panel.classList.remove('unmoving');
};

const stillMoving = (panel: HTMLElement): boolean =>
  panel.getAnimations().some(motion => motion instanceof CSSTransition && motion.transitionProperty === 'height');

const letsGo = (panel: HTMLElement): void => {
  panel.classList.remove('sized');
  panel.style.removeProperty('--measured-height');
};

const settled = ({target, currentTarget: panel, propertyName}: TransitionEvent): void => {
  if (target !== panel || propertyName !== 'height' || !(panel instanceof HTMLElement)) {
    return;
  }
  letsGo(panel);
  panel.removeEventListener('transitionend', settled);
};

const movesTo = (panel: HTMLElement, from: () => number, to: number): void => {
  if (!panel.classList.contains('sized')) {
    startsAt(panel, from());
  }
  setsHeight(panel, to);
  if (stillMoving(panel)) {
    panel.addEventListener('transitionend', settled);
  } else {
    letsGo(panel);
  }
};

const opened = (panel: HTMLElement): void => {
  panel.dataset.shown = '';
  if (moves(panel)) {
    movesTo(panel, () => 0, textHeight(panel));
  }
};

const closed = (panel: HTMLElement): void => {
  delete panel.dataset.shown;
  if (moves(panel)) {
    movesTo(panel, () => textHeight(panel), 0);
  }
};

export const foldMeasured = ({currentTarget: list}: {currentTarget: HTMLElement}): void =>
  list.querySelectorAll('.fold').forEach(fold => {
    const toggle = fold.querySelector('.info-toggle');
    const panel = fold.querySelector('.info-measured');
    if (!(toggle instanceof HTMLInputElement) || !(panel instanceof HTMLElement)) {
      return;
    }
    const shown = 'shown' in panel.dataset;
    if (toggle.checked && !shown) {
      opened(panel);
    } else if (!toggle.checked && shown) {
      closed(panel);
    }
  });
