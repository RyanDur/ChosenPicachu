export const gotoTopOfPage = (): void => {
  window.scrollTo(0, 0);
  const main = document.querySelector('main');
  if (main instanceof HTMLElement) main.scrollTo(0, 0);
};
