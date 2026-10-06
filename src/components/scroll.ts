export const gotoTopOfPane = (): void => {
  const main = document.querySelector('main');
  if (main instanceof HTMLElement) main.scrollTo(0, 0);
};

export const gotoTopOfPage = (): void => {
  window.scrollTo(0, 0);
  gotoTopOfPane();
};
