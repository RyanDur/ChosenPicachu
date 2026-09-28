import {TestApp} from '@__test_support/TestApp';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Tabs} from '../index';
import {expect} from 'vitest';

const path = '/a/path';
describe('Tabs', () => {
  const tab1 = {display: 'Tab 1', param: 'tab1'};
  const tab2 = {display: 'Tab 2', param: 'tab2'};
  const tab3 = {display: 'Tab 3', param: 'tab3'};

  it('the default tab is current without being written into the address', () => {
    render(<TestApp at={path}><Tabs label="tabs under test" defaultTab={tab1.param} values={[tab1, tab2, tab3]}/></TestApp>);

    expect(screen.getByRole('link', {name: tab1.display, current: 'page'})).toBeInTheDocument();
    expect(screen.getByRole('status', {name: 'url search'})).not.toHaveTextContent('tab=');
  });

  it('the tab strip is a list, one item per tab', () => {
    render(<TestApp at={path}><Tabs label="tabs under test" defaultTab={tab1.param} values={[tab1, tab2, tab3]}/></TestApp>);

    const items = within(screen.getByRole('navigation', {name: 'tabs under test'})).getAllByRole('listitem');
    expect(items.map(item => within(item).getByRole('link').textContent)).toEqual([tab1.display, tab2.display, tab3.display]);
  });

  it('a tab in the address wins over the default', () => {
    render(<TestApp at={`${path}?tab=${tab2.param}`}><Tabs label="tabs under test" defaultTab={tab1.param} values={[tab1, tab2, tab3]}/></TestApp>);

    expect(screen.getByRole('link', {name: tab2.display, current: 'page'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: tab1.display})).not.toHaveAttribute('aria-current');
  });

  it('should update the url', async () => {
    render(<TestApp at={path}><Tabs label="tabs under test" defaultTab={tab1.param} values={[tab1, tab2, tab3]}/></TestApp>);

    await userEvent.click(screen.getByText(tab1.display));
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(`?tab=${tab1.param}`);

    await userEvent.click(screen.getByText(tab2.display));
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(`?tab=${tab2.param}`);

    await userEvent.click(screen.getByText(tab3.display));
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(`?tab=${tab3.param}`);
  });

  it('the tab in the url is the one marked current', async () => {
    render(<TestApp at={path}><Tabs label="tabs under test" defaultTab={tab1.param} values={[tab1, tab2, tab3]}/></TestApp>);

    expect(screen.getByRole('link', {name: tab1.display, current: 'page'})).toBeInTheDocument();

    await userEvent.click(screen.getByText(tab2.display));

    expect(screen.getByRole('link', {name: tab2.display, current: 'page'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: tab1.display})).not.toHaveAttribute('aria-current');
  });
});
