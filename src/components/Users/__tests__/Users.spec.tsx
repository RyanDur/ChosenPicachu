import {act, render, screen, within} from '@testing-library/react';
import {Users} from '../index';
import userEvent from '@testing-library/user-event';
import {users} from '../../../__tests__/util';

describe('the users page', () => {
    const [userInfo, anotherUserInfo] = users;
    beforeEach(() => {
        render(<Users/>);
    });

    describe('adding a user', () => {
        beforeEach(() => {
            userEvent.type(screen.getByLabelText('First Name'), userInfo.user.firstName);
            userEvent.type(screen.getByLabelText('Last Name'), userInfo.user.lastName);
            userEvent.type(screen.getByLabelText('Email'), userInfo.user.email!);
            userEvent.type(screen.getByTestId('home-street-address'), userInfo.homeAddress.streetAddress);
            userEvent.type(screen.getByTestId('home-street-address-2'), userInfo.homeAddress.streetAddressTwo!);
            userEvent.type(screen.getByTestId('home-city'), userInfo.homeAddress.city);
            userEvent.type(screen.getByTestId('home-state'), userInfo.homeAddress.state);
            userEvent.type(screen.getByTestId('home-zip'), userInfo.homeAddress.zip);
            userEvent.type(screen.getByTestId('work-street-address'), userInfo.workAddress!.streetAddress);
            userEvent.type(screen.getByTestId('work-street-address-2'), userInfo.workAddress!.streetAddressTwo!);
            userEvent.type(screen.getByTestId('work-city'), userInfo.workAddress!.city);
            userEvent.type(screen.getByTestId('work-state'), userInfo.workAddress!.state);
            userEvent.type(screen.getByTestId('work-zip'), userInfo.workAddress!.zip);
            userEvent.type(screen.getByLabelText('Details'), userInfo.details!);

            userEvent.click(screen.getByText('Add'));

            userEvent.type(screen.getByLabelText('First Name'), anotherUserInfo.user.firstName);
            userEvent.type(screen.getByLabelText('Last Name'), anotherUserInfo.user.lastName);
            userEvent.type(screen.getByTestId('home-street-address'), anotherUserInfo.homeAddress.streetAddress);
            userEvent.type(screen.getByTestId('home-street-address-2'), anotherUserInfo.homeAddress.streetAddressTwo!);
            userEvent.type(screen.getByTestId('home-city'), anotherUserInfo.homeAddress.city);
            userEvent.type(screen.getByTestId('home-state'), anotherUserInfo.homeAddress.state);
            userEvent.type(screen.getByTestId('home-zip'), anotherUserInfo.homeAddress.zip);
            userEvent.click(screen.getByLabelText('Same as Home'));

            act(() => {
                userEvent.click(screen.getByText('Add'));
            });
        });

        test('user info in table in descending order', () => {
            const table = screen.getByTestId('table');
            const [column1, column2, column3] = screen.getAllByTestId('th');

            expect(column1).toHaveTextContent('Full Name');
            expect(column2).toHaveTextContent('Home City');
            expect(column3).toHaveTextContent('Works from Home');

            const firstRowFirstCell = within(table).getByTestId('cell-0-0');
            const firstRowSecondCell = within(table).getByTestId('cell-1-0');
            const firstRowThirdCell = within(table).getByTestId('cell-2-0');

            expect(firstRowFirstCell).toHaveTextContent(`${anotherUserInfo.user.firstName} ${anotherUserInfo.user.lastName}`);
            expect(firstRowSecondCell).toHaveTextContent(anotherUserInfo.homeAddress.city);
            expect(firstRowThirdCell).toHaveTextContent('Yes');

            const secondRowFirstCell = within(table).getByTestId('cell-0-1');
            const secondRowSecondCell = within(table).getByTestId('cell-1-1');
            const secondRowThirdCell = within(table).getByTestId('cell-2-1');

            expect(secondRowFirstCell).toHaveTextContent(`${userInfo.user.firstName} ${userInfo.user.lastName}`);
            expect(secondRowSecondCell).toHaveTextContent(userInfo.homeAddress.city);
            expect(secondRowThirdCell).toHaveTextContent('No');
        });
    });
});