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

  it('the tab it is given is current, and the address is left alone', () => {
    render(<TestApp at={path}><Tabs label="tabs under test" current={tab1.param} values={[tab1, tab2, tab3]}/></TestApp>);

    expect(screen.getByRole('link', {name: tab1.display, current: 'page'})).toBeInTheDocument();
    expect(screen.getByRole('status', {name: 'url search'})).not.toHaveTextContent('tab=');
  });

  it('the tab strip is a list, one item per tab', () => {
    render(<TestApp at={path}><Tabs label="tabs under test" current={tab1.param} values={[tab1, tab2, tab3]}/></TestApp>);

    const items = within(screen.getByRole('navigation', {name: 'tabs under test'})).getAllByRole('listitem');
    expect(items.map(item => within(item).getByRole('link').textContent)).toEqual([tab1.display, tab2.display, tab3.display]);
  });

  it('marks no tab when it is given none', () => {
    render(<TestApp at={path}><Tabs label="tabs under test" values={[tab1, tab2, tab3]}/></TestApp>);

    expect(screen.queryByRole('link', {current: 'page'})).not.toBeInTheDocument();
  });

  it('should update the url', async () => {
    render(<TestApp at={path}><Tabs label="tabs under test" current={tab1.param} values={[tab1, tab2, tab3]}/></TestApp>);

    await userEvent.click(screen.getByText(tab1.display));
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(`?tab=${tab1.param}`);

    await userEvent.click(screen.getByText(tab2.display));
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(`?tab=${tab2.param}`);

    await userEvent.click(screen.getByText(tab3.display));
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(`?tab=${tab3.param}`);
  });

  it('marks only the tab it is given, whatever the address says', () => {
    render(<TestApp at={`${path}?tab=${tab3.param}`}><Tabs label="tabs under test" current={tab2.param} values={[tab1, tab2, tab3]}/></TestApp>);

    expect(screen.getByRole('link', {name: tab2.display, current: 'page'})).toBeInTheDocument();
    expect(screen.getAllByRole('link', {current: 'page'})).toHaveLength(1);
  });
});
