import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {render} from '@testing-library/react';
import {Tabs} from '@navigation/Tabs';
import {tabStrip} from '@navigation/Tabs/__test_support/tabStrip';
import {expect} from 'vitest';

const path = '/a/path/';
describe('Tabs', () => {
  const tab1 = {display: 'Tab 1', param: 'tab1', to: `${path}tab1/`};
  const tab2 = {display: 'Tab 2', param: 'tab2', to: `${path}tab2/`};
  const tab3 = {display: 'Tab 3', param: 'tab3', to: `${path}tab3/`};
  const tabs = tabStrip('tabs under test');

  it('the tab it is given is current', () => {
    render(<TestApp at={path}><Tabs label="tabs under test" current={tab1.param} tabs={[tab1, tab2, tab3]}/></TestApp>);

    expect(tabs.current()).toEqual([tab1.display]);
  });

  it('marks the tab it is given as current but not as the page, when told the reader is below it', () => {
    render(<TestApp at={path}><Tabs label="tabs under test" current={tab1.param} aria-current="true" tabs={[tab1, tab2, tab3]}/></TestApp>);

    expect(tabs.currentButNotThePage()).toEqual([tab1.display]);
  });

  it('the tab strip is a list, one item per tab', () => {
    render(<TestApp at={path}><Tabs label="tabs under test" current={tab1.param} tabs={[tab1, tab2, tab3]}/></TestApp>);

    expect(tabs.names()).toEqual([tab1.display, tab2.display, tab3.display]);
  });

  it('marks no tab when it is given none', () => {
    render(<TestApp at={path}><Tabs label="tabs under test" tabs={[tab1, tab2, tab3]}/></TestApp>);

    expect(tabs.current()).toEqual([]);
  });

  it('each tab goes where it is told to', async () => {
    render(<TestApp at={path}><Tabs label="tabs under test" current={tab1.param} tabs={[tab1, tab2, tab3]}/></TestApp>);

    await tabs.open(tab2.display);

    expect(appAddress.path()).toHaveTextContent(tab2.to);
  });

  it('marks only the tab it is given, whatever the address says', () => {
    render(<TestApp at={tab3.to}><Tabs label="tabs under test" current={tab2.param} tabs={[tab1, tab2, tab3]}/></TestApp>);

    expect(tabs.current()).toEqual([tab2.display]);
  });
});
