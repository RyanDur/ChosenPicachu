import {act, screen, within} from '@testing-library/react';
import {Users} from '../index';
import userEvent from '@testing-library/user-event';
import {fillOutAddress, fillOutUser, renderWithRouter, users} from '../../../__tests__/util';

describe('the users page', () => {
    const [userInfo, anotherUserInfo] = users;

    beforeEach(() => {
        renderWithRouter(<Users/>);
    });

    describe('adding a user', () => {
        beforeEach(() => {
            fillOutUser(userInfo);
            fillOutAddress(userInfo, 'home');
            fillOutAddress(userInfo, 'work');
            userEvent.type(screen.getByLabelText('Details'), userInfo.details!);
            userEvent.click(screen.getByText('Add'));

            fillOutUser(anotherUserInfo);
            fillOutAddress(anotherUserInfo, 'home');
            userEvent.click(screen.getByLabelText('Same as Home'));
            userEvent.click(screen.getByText('Add'));
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

        test('user can view a user', async () => {
            const table = screen.getByTestId('table');
            const firstRowThirdCell = within(table).getByTestId('cell-2-0');

            act(() => {
                userEvent.click(within(firstRowThirdCell).getByText('View'));
            });
            const form = screen.getByTestId('user-info-form');
            expect(within(form).getByLabelText('First Name')).toHaveDisplayValue(anotherUserInfo.user.firstName);
            expect(within(form).getByLabelText('Last Name')).toHaveDisplayValue(anotherUserInfo.user.lastName);
            expect(within(form).getByLabelText('Email')).toHaveDisplayValue(anotherUserInfo.user.email!);
        });
    });
});