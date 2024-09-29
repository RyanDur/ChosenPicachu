import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from '../../../__tests__/util';
import {Tabs} from '../index';

const path = '/a/path';
describe('Tabs', () => {
  const tab1 = {display: 'Tab 1', param: 'tab1'};
  const tab2 = {display: 'Tab 2', param: 'tab2'};
  const tab3 = {display: 'Tab 3', param: 'tab3'};

  it('should update the url', async () => {
    const rendered = renderWithRouter(<Tabs values={[tab1, tab2, tab3]}/>, {path, initialRoute: path});
    await userEvent.click(screen.getByText(tab1.display));
    expect(rendered().testLocation?.search).toEqual(`?tab=${tab1.param}`);

    await userEvent.click(screen.getByText(tab2.display));
    expect(rendered().testLocation?.search).toEqual(`?tab=${tab2.param}`);

    await userEvent.click(screen.getByText(tab3.display));
    expect(rendered().testLocation?.search).toEqual(`?tab=${tab3.param}`);
  });

  it('should default to the first choice if the param is not present', async () => {
    const rendered = renderWithRouter(<Tabs values={[tab1, tab2, tab3]}/>, {path, initialRoute: path});

    expect(rendered().testLocation?.search).toEqual(`?tab=${tab1.param}`);
  });
});
