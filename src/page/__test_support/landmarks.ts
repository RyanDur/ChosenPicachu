import {screen} from '@testing-library/react';
import {computeAccessibleName} from 'dom-accessibility-api';

export type Landmark = readonly [role: string, name: string];

const roles = ['banner', 'navigation', 'region', 'complementary', 'search', 'form', 'main', 'contentinfo'] as const;

const asOnADesk = {hidden: true};

const siteNav = (): HTMLElement => screen.getByLabelText('site');

const ofTheFrame = (element: HTMLElement): boolean => !element.parentElement?.closest('main');

const inDocumentOrder = (first: HTMLElement, second: HTMLElement): number =>
  first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

export const landmarks = {
  arrived: (): Promise<HTMLElement> => screen.findByRole('main'),
  footerArrived: (): Promise<HTMLElement> => screen.findByRole('contentinfo'),
  ofTheFrame: (): Landmark[] => {
    const nav = siteNav();
    return [
      {role: 'navigation', element: nav},
      ...roles.flatMap(role => screen.queryAllByRole(role)
        .filter(element => element !== nav && ofTheFrame(element))
        .map(element => ({role, element})))
    ]
      .sort((one, other) => inDocumentOrder(one.element, other.element))
      .map(({role, element}) => [role, computeAccessibleName(element, asOnADesk)]);
  }
};
