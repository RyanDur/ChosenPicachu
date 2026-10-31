const toggle = document.querySelector('.info-toggle');
const panel = document.querySelector('.info-measured');

if (toggle instanceof HTMLInputElement && panel instanceof HTMLElement) {
  const moves = (): boolean => parseFloat(getComputedStyle(panel).transitionDuration) > 0;
  const textHeight = (): number => panel.firstElementChild?.getBoundingClientRect().height ?? 0;
  const letGo = (): void => {
    panel.classList.remove('sized');
    panel.style.removeProperty('--measured-height');
  };

  toggle.addEventListener('change', () => {
    if (!moves()) return;
    const resting = toggle.checked ? 0 : textHeight();
    const from = panel.classList.contains('sized') ? panel.getBoundingClientRect().height : resting;
    const to = toggle.checked ? textHeight() : 0;
    if (from === to) {
      letGo();
      return;
    }
    panel.style.setProperty('--measured-height', `${from}px`);
    panel.classList.add('sized', 'unmoving');
    void panel.offsetHeight;
    panel.classList.remove('unmoving');
    panel.style.setProperty('--measured-height', `${to}px`);
  });

  panel.addEventListener('transitionend', ({target, propertyName}) => {
    if (target === panel && propertyName === 'height') letGo();
  });
}
