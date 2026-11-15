import {screen} from '@testing-library/react';
import {maybe} from '@ryandur/sand';

export type Landmark = readonly [role: string, id: string, name: string];

const roles = ['banner', 'navigation', 'region', 'complementary', 'search', 'form', 'main', 'contentinfo'] as const;

const nameOf = (element: HTMLElement): string => maybe(element.getAttribute('aria-label'))
  .orElse(maybe(element.getAttribute('aria-labelledby'))
    .mBind(id => maybe(document.getElementById(id)?.textContent))
    .orElse(''));

const inDocumentOrder = (first: HTMLElement, second: HTMLElement): number =>
  first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

export const landmarks = {
  inOrder: (): Landmark[] => roles
    .flatMap(role => screen.queryAllByRole(role).map(element => ({role, element})))
    .sort((one, other) => inDocumentOrder(one.element, other.element))
    .map(({role, element}) => [role, element.id, nameOf(element)])
};
