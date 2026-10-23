import {moveReport, Report} from './table-state';

export const report = (host: Element, said: Report): void => {
  const output = host.querySelector('output[aria-label="move report"]');
  const text = moveReport(said);
  if (output !== null && output.textContent !== text) {
    output.textContent = text;
  }
};
