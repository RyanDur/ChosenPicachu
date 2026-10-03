const moves = (panel: HTMLElement): boolean => parseFloat(getComputedStyle(panel).transitionDuration) > 0;

const textHeight = (panel: HTMLElement): number => panel.firstElementChild?.getBoundingClientRect().height ?? 0;

const heading = (panel: HTMLElement, height: number): void => {
  panel.style.setProperty('--measured-height', `${height}px`);
  void panel.offsetHeight;
};

const startsAt = (panel: HTMLElement, height: number): void => {
  panel.classList.add('unmoving', 'sized');
  heading(panel, height);
  panel.classList.remove('unmoving');
};

const settles = (panel: HTMLElement): void => {
  const settled = (event: TransitionEvent): void => {
    if (event.target === panel && event.propertyName === 'height') {
      panel.classList.remove('sized');
      panel.style.removeProperty('--measured-height');
      panel.removeEventListener('transitionend', settled);
    }
  };
  panel.addEventListener('transitionend', settled);
};

const movesTo = (panel: HTMLElement, from: () => number, to: number): void => {
  if (!panel.classList.contains('sized')) {
    startsAt(panel, from());
  }
  heading(panel, to);
  settles(panel);
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
