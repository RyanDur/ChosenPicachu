import {TestApp} from '@test-support/TestApp';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Tabs} from '../index';
import {expect} from 'vitest';

const path = '/a/path';
describe('Tabs', () => {
  const tab1 = {display: 'Tab 1', param: 'tab1'};
  const tab2 = {display: 'Tab 2', param: 'tab2'};
  const tab3 = {display: 'Tab 3', param: 'tab3'};

  it('should start with the default', () => {
    render(<TestApp at={path}><Tabs label="tabs under test" defaultTab={tab1.param} values={[tab1, tab2, tab3]}/></TestApp>);

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(tab1.param);
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

  it('should default to the first choice if the param is not present', async () => {
    render(<TestApp at={path}><Tabs label="tabs under test" defaultTab={tab1.param} values={[tab1, tab2, tab3]}/></TestApp>);

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(`?tab=${tab1.param}`);
  });

  it('the chosen tab says it is current, styles or not', async () => {
    render(<TestApp at={path}><Tabs label="tabs under test" defaultTab={tab1.param} values={[tab1, tab2, tab3]}/></TestApp>);

    expect(screen.getByRole('link', {name: tab1.display, current: 'page'})).toBeInTheDocument();

    await userEvent.click(screen.getByText(tab2.display));

    expect(screen.getByRole('link', {name: tab2.display, current: 'page'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: tab1.display})).not.toHaveAttribute('aria-current');
  });
});
