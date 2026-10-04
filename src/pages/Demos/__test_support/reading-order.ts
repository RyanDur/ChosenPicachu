import {not} from '@ryandur/sand';

export const outOfReadingOrder = (elements: readonly Element[]): Element[] =>
  elements.slice(1).filter((next, at) => not(elements[at].compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING));
