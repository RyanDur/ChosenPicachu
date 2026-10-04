export const inReadingOrder = (elements: readonly Element[]): boolean =>
  elements.slice(1).every((next, at) => Boolean(elements[at].compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING));
