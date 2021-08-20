import {screen} from '@testing-library/react';
import {renderWithRouter} from '../../../__tests__/util';
import {Tabs} from '../index';
import userEvent from '@testing-library/user-event';

const initialRoute = '/a/path';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useRouteMatch: () => ({path: initialRoute})
}));
describe('Tabs', () => {
    const tab1 = {display: 'Tab 1', param:'tab1'};
    const tab2 = {display: 'Tab 2', param:'tab2'};
    const tab3 = {display: 'Tab 3', param:'tab3'};

    it('should update the url', () => {
        const rendered = renderWithRouter(<Tabs values={[tab1, tab2, tab3]}/>, {initialRoute});

        userEvent.click(screen.getByText(tab1.display));
        expect(rendered().testLocation?.search).toEqual(`?tab=${tab1.param}`);
        userEvent.click(screen.getByText(tab2.display));
        expect(rendered().testLocation?.search).toEqual(`?tab=${tab2.param}`);
        userEvent.click(screen.getByText(tab3.display));
        expect(rendered().testLocation?.search).toEqual(`?tab=${tab3.param}`);
    });
});