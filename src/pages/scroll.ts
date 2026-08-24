export const gotoTopOfPage = () => {
  window.scrollTo(0, 0);
  const main = document.querySelector('main.app-main');
  if (main instanceof HTMLElement) main.scrollTo(0, 0);
};
