export const gotoTopOfPage = () => {
  const main = document.querySelector('main.app-main');
  if (main instanceof HTMLElement) main.scrollTo(0, 0);
  else window.scrollTo(0, 0);
};
