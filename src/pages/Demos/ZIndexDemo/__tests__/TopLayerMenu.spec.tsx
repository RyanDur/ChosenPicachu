import {render, screen, within} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';

describe('the menu built the new way', () => {
  test('should sit in card one, beside Sort by', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const trap = await screen.findByRole('figure', {name: /^The trap\./});

    const cardOne = within(trap).getAllByRole('listitem').filter(card => within(card).queryByRole('button', {name: 'Sort by, the old way'}) !== null)[0];

    expect(within(cardOne).getByRole('button', {name: 'Sort by, in the top layer'})).toBeInTheDocument();
  });
});

describe('why the popover wins', () => {
  test('should show the menu’s markup beside the run that says what popover gives for free', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why the popover wins'});

    expect(explanation.everyCodeBeside(part, /The button names its menu with popovertarget/).join()).toMatch(/popoverTarget=[^]*popover="auto"[^]*popoverTargetAction="hide"/);
  });

  test('should show the site’s menu placement and its fallback beside the run that says what each way costs', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why the popover wins'});

    expect(explanation.everyCodeBeside(part, /The new way costs placement/).join()).toMatch(/\.menu \{[^]*position-area: block-end span-inline-start[^]*@supports not \(position-area: block-end\)/);
  });

  test('should draw the top layer above the page beside the run that says why nothing covers it', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why the popover wins'});

    expect(explanation.runTelling(part, /The top layer is not inside any stacking context/)).toContainElement(within(part).getByRole('figure', {name: /^Above the page\./}));
  });
});
