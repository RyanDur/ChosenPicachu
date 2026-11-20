import {screen} from '@testing-library/react';

export const titleAbove = (element: Element): string | undefined =>
  screen.getAllByRole('heading')
    .filter(heading => heading.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING)
    .map(heading => heading.textContent)
    .pop();
