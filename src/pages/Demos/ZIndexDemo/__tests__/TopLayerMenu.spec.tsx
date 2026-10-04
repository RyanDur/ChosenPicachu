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

  test('should say the placement is only for a menu that is also a popover, and why', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why the popover wins'});
    const run = within(part).getByText(/The site’s menu.css places it/);

    expect(run).toHaveTextContent(/screen\. In the sheet the placement sits under &\[popover\], which reads as a menu that is also a popover\./);
    expect(run).toHaveTextContent(/like the old list above, has no anchor, so it is left out\./);
  });

  test('should show the buttons’ tabIndex beside the run that says what it asks, and why Safari needs it', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why the popover wins'});
    const run = explanation.runTelling(part, /The button that opens the menu carries a tabIndex of 0, and so does each choice in the sample above/);
    const sample = explanation.everyCodeBeside(part, /The button that opens the menu carries a tabIndex of 0, and so does each choice in the sample above/).join();

    expect(sample).toMatch(/<button type="button" tabIndex=\{0\} className="button primary/);
    expect(sample).not.toMatch(/<menu/);
    expect(run).toHaveTextContent(/That is the HTML attribute tabindex, spelled the way React spells it, and React is the JavaScript library/);
    expect(run).toHaveTextContent(/A tabindex of 0 asks the browser to stop on the element when Tab moves focus/);
    expect(run).toHaveTextContent(/by default Safari moves Tab only to text fields and to elements that ask for it/);
  });

  test('should show a choice carrying tabIndex={0} in the menu sample the tabIndex run points to', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why the popover wins'});

    const runs = within(part).getAllByRole('listitem');
    const menuSample = explanation.everyCodeBeside(part, /The button names its menu with popovertarget/).join();

    expect(menuSample).toMatch(/<button type="button" tabIndex=\{0\}[^\n]*popoverTargetAction="hide"/);
    expect(runs.indexOf(explanation.runTelling(part, /The button names its menu with popovertarget/)))
      .toBeLessThan(runs.indexOf(explanation.runTelling(part, /The button that opens the menu carries a tabIndex of 0/)));
  });

  test('should name the toggle in a run after the markup that holds it', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why the popover wins'});
    const runs = within(part).getAllByRole('listitem');
    const scriptsAt = runs.indexOf(explanation.runTelling(part, /A toggle on the menu/));

    expect(explanation.everyCodeBeside(part, /The button names its menu with popovertarget/).join()).toMatch(/onToggle=/);
    expect(runs.indexOf(explanation.runTelling(part, /The button names its menu with popovertarget/))).toBeLessThan(scriptsAt);
  });

  test('should show the site’s menu placement and its fallback beside the run that says how the sheet places it', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why the popover wins'});

    expect(explanation.everyCodeBeside(part, /The site’s menu.css places it/).join()).toMatch(/\.menu \{[^]*position-area: block-end span-inline-start[^]*@supports not \(position-area: block-end\)/);
  });

  test('should draw the top layer above the page beside the run that says why nothing covers it', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why the popover wins'});

    expect(explanation.runTelling(part, /The top layer is not inside any stacking context/)).toContainElement(within(part).getByRole('figure', {name: /^Above the page\./}));
  });
});
