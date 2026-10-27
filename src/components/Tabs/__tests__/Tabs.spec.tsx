import {TestApp} from '@__test_support/TestApp';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Tabs} from '../index';
import {expect} from 'vitest';

const path = '/a/path/';
describe('Tabs', () => {
  const tab1 = {display: 'Tab 1', param: 'tab1', to: `${path}tab1/`};
  const tab2 = {display: 'Tab 2', param: 'tab2', to: `${path}tab2/`};
  const tab3 = {display: 'Tab 3', param: 'tab3', to: `${path}tab3/`};

  it('the tab it is given is current', () => {
    render(<TestApp at={path}><Tabs label="tabs under test" current={tab1.param} values={[tab1, tab2, tab3]}/></TestApp>);

    expect(screen.getByRole('link', {name: tab1.display, current: 'page'})).toBeInTheDocument();
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

  it('each tab goes where it is told to', async () => {
    render(<TestApp at={path}><Tabs label="tabs under test" current={tab1.param} values={[tab1, tab2, tab3]}/></TestApp>);

    await userEvent.click(screen.getByRole('link', {name: tab2.display}));

    expect(screen.getByRole('status', {name: 'url path'})).toHaveTextContent(tab2.to);
  });

  it('marks only the tab it is given, whatever the address says', () => {
    render(<TestApp at={tab3.to}><Tabs label="tabs under test" current={tab2.param} values={[tab1, tab2, tab3]}/></TestApp>);

    expect(screen.getByRole('link', {name: tab2.display, current: 'page'})).toBeInTheDocument();
    expect(screen.getAllByRole('link', {current: 'page'})).toHaveLength(1);
  });
});
