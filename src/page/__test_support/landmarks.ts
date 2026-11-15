import {screen} from '@testing-library/react';
import {computeAccessibleName} from 'dom-accessibility-api';

export type Landmark = readonly [role: string, id: string, name: string];

const roles = ['banner', 'navigation', 'region', 'complementary', 'search', 'form', 'main', 'contentinfo'] as const;

const ofTheFrame = (element: HTMLElement): boolean => !element.parentElement?.closest('main');

const inDocumentOrder = (first: HTMLElement, second: HTMLElement): number =>
  first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

export const landmarks = {
  ofTheFrame: (): Landmark[] => roles
    .flatMap(role => screen.queryAllByRole(role).filter(ofTheFrame).map(element => ({role, element})))
    .sort((one, other) => inDocumentOrder(one.element, other.element))
    .map(({role, element}) => [role, element.id, computeAccessibleName(element)])
};
