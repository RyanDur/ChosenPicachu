const moves = (panel: HTMLElement): boolean => parseFloat(getComputedStyle(panel).transitionDuration) > 0;

const textHeight = (panel: HTMLElement): string => `${panel.firstElementChild?.getBoundingClientRect().height ?? 0}px`;

const startsAt = (panel: HTMLElement, height: string): void => {
  panel.style.transitionProperty = 'visibility';
  panel.style.height = height;
  void panel.offsetHeight;
  panel.style.removeProperty('transition-property');
};

const landsOnAuto = (panel: HTMLElement): void => {
  const landed = (event: TransitionEvent): void => {
    if (event.target === panel && event.propertyName === 'height') {
      panel.style.removeProperty('height');
      panel.removeEventListener('transitionend', landed);
      panel.removeEventListener('transitioncancel', landed);
    }
  };
  panel.addEventListener('transitionend', landed);
  panel.addEventListener('transitioncancel', landed);
};

const opened = (panel: HTMLElement): void => {
  panel.dataset.shown = '';
  if (moves(panel)) {
    startsAt(panel, '0');
    panel.style.height = textHeight(panel);
    void panel.offsetHeight;
    landsOnAuto(panel);
  }
};

const closed = (panel: HTMLElement): void => {
  delete panel.dataset.shown;
  if (moves(panel)) {
    startsAt(panel, textHeight(panel));
    panel.style.removeProperty('height');
    void panel.offsetHeight;
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
