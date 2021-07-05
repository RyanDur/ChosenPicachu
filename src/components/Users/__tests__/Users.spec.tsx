import {act, render, screen, within} from '@testing-library/react';
import {Users} from '../index';
import userEvent from '@testing-library/user-event';
import {anotherHomeAddress, anotherUser, details, homeAddress, user, workAddress} from '../../../__tests__/util';

describe('the users page', () => {
    beforeEach(() => {
        render(<Users/>);
    });

    describe('adding a user', () => {
        beforeEach(() => {
            userEvent.type(screen.getByLabelText('First Name'), user.firstName);
            userEvent.type(screen.getByLabelText('Last Name'), user.lastName);
            userEvent.type(screen.getByLabelText('Email'), user.email);
            userEvent.type(screen.getByTestId('home-street-address'), homeAddress.streetAddress);
            userEvent.type(screen.getByTestId('home-street-address-2'), homeAddress.streetAddressTwo);
            userEvent.type(screen.getByTestId('home-city'), homeAddress.city);
            userEvent.type(screen.getByTestId('home-state'), homeAddress.state);
            userEvent.type(screen.getByTestId('home-zip'), homeAddress.zip);
            userEvent.type(screen.getByTestId('work-street-address'), workAddress.streetAddress);
            userEvent.type(screen.getByTestId('work-street-address-2'), workAddress.streetAddressTwo);
            userEvent.type(screen.getByTestId('work-city'), workAddress.city);
            userEvent.type(screen.getByTestId('work-state'), workAddress.state);
            userEvent.type(screen.getByTestId('work-zip'), workAddress.zip);
            userEvent.type(screen.getByLabelText('Details'), details);

            userEvent.click(screen.getByText('Add'));

            userEvent.type(screen.getByLabelText('First Name'), anotherUser.firstName);
            userEvent.type(screen.getByLabelText('Last Name'), anotherUser.lastName);
            userEvent.type(screen.getByTestId('home-street-address'), anotherHomeAddress.streetAddress);
            userEvent.type(screen.getByTestId('home-street-address-2'), anotherHomeAddress.streetAddressTwo);
            userEvent.type(screen.getByTestId('home-city'), anotherHomeAddress.city);
            userEvent.type(screen.getByTestId('home-state'), anotherHomeAddress.state);
            userEvent.type(screen.getByTestId('home-zip'), anotherHomeAddress.zip);
            userEvent.click(screen.getByLabelText('Same as Home'));

            act(() => {
                userEvent.click(screen.getByText('Add'));
            });
        });

        test('user info in table', () => {
            const table = screen.getByTestId('table');
            const [column1, column2, column3] = screen.getAllByTestId('th');
            const firstCell = within(table).getByTestId('cell-0-0');
            const secondCell = within(table).getByTestId('cell-1-0');
            const thirdCell = within(table).getByTestId('cell-2-0');

            expect(column1).toHaveTextContent('Full Name');
            expect(column2).toHaveTextContent('Home City');
            expect(column3).toHaveTextContent('Works from Home');

            expect(firstCell).toHaveTextContent(`${user.firstName} ${user.lastName}`);
            expect(secondCell).toHaveTextContent(homeAddress.city);
            expect(thirdCell).toHaveTextContent('No');

            const anotherFirstCell = within(table).getByTestId('cell-0-1');
            const anotherSecondCell = within(table).getByTestId('cell-1-1');
            const anotherThirdCell = within(table).getByTestId('cell-2-1');

            expect(anotherFirstCell).toHaveTextContent(`${anotherUser.firstName} ${anotherUser.lastName}`);
            expect(anotherSecondCell).toHaveTextContent(anotherHomeAddress.city);
            expect(anotherThirdCell).toHaveTextContent('Yes');
        });
    });
});