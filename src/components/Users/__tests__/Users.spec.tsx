import {act, screen, within} from '@testing-library/react';
import {Users} from '../index';
import userEvent from '@testing-library/user-event';
import {fillOutAddress, fillOutUser, renderWithRouter, users} from '../../../__tests__/util';

describe('the users page', () => {
    const [userInfo, anotherUserInfo] = users;
    let table: HTMLElement,
        firstRowFirstCell: HTMLElement,
        firstRowSecondCell: HTMLElement,
        firstRowThirdCell: HTMLElement;

    beforeEach(() => {
        renderWithRouter(<Users/>);
        table = screen.getByTestId('table');
        firstRowFirstCell = within(table).getByTestId('cell-0-0');
        firstRowSecondCell = within(table).getByTestId('cell-1-0');
        firstRowThirdCell = within(table).getByTestId('cell-2-0');

        fillOutUser(userInfo);
        fillOutAddress(userInfo, 'home');
        fillOutAddress(userInfo, 'work');
        userEvent.type(screen.getByLabelText('Details'), userInfo.details!);
        userEvent.click(screen.getByText('Add'));
    });

    describe('adding a user', () => {
        beforeEach(() => {
            fillOutUser(anotherUserInfo);
            fillOutAddress(anotherUserInfo, 'home');
            userEvent.click(screen.getByLabelText('Same as Home'));
            userEvent.click(screen.getByText('Add'));
        });

        test('user info in table in descending order', () => {
            const [column1, column2, column3] = screen.getAllByTestId('th');

            expect(column1).toHaveTextContent('Full Name');
            expect(column2).toHaveTextContent('Home City');
            expect(column3).toHaveTextContent('Works from Home');

            expect(firstRowFirstCell).toHaveTextContent(`${anotherUserInfo.user.firstName} ${anotherUserInfo.user.lastName}`);
            expect(firstRowSecondCell).toHaveTextContent(anotherUserInfo.homeAddress.city);
            expect(firstRowThirdCell).toHaveTextContent('Yes');

            const secondRowFirstCell = within(table).getByTestId('cell-0-1'),
                secondRowSecondCell = within(table).getByTestId('cell-1-1'),
                secondRowThirdCell = within(table).getByTestId('cell-2-1');

            expect(secondRowFirstCell).toHaveTextContent(`${userInfo.user.firstName} ${userInfo.user.lastName}`);
            expect(secondRowSecondCell).toHaveTextContent(userInfo.homeAddress.city);
            expect(secondRowThirdCell).toHaveTextContent('No');
        });
    });

    describe('viewing a user', () => {
        beforeEach(() => {
            act(() => {
                userEvent.click(within(firstRowThirdCell).getByText('View'));
            });
        });

        test('populating the form with the chosen user', async () => {
            const form = screen.getByTestId('user-info-form');
            expect(within(form).getByLabelText('First Name')).toHaveDisplayValue(userInfo.user.firstName);
            expect(within(form).getByLabelText('Last Name')).toHaveDisplayValue(userInfo.user.lastName);
            expect(within(form).getByLabelText('Email')).toHaveDisplayValue(userInfo.user.email!);
        });

        test('should not be able to change the uses data', async () => {
            const form = screen.getByTestId('user-info-form');
            expect(within(form).getByLabelText('First Name')).toHaveAttribute('readonly');
            expect(within(form).getByLabelText('Last Name')).toHaveAttribute('readonly');
            expect(within(form).getByLabelText('Email')).toHaveAttribute('readonly');

            const avatarImage: HTMLImageElement = form.querySelector('#avatar')!;
            const imageSrc = avatarImage.src;
            userEvent.click(within(form).getByTestId('avatar-cell'));
            expect(avatarImage.src).toEqual(imageSrc);

            expect(within(form).getByTestId('home-street-address')).toHaveAttribute('readonly');
            expect(within(form).getByTestId('home-street-address-2')).toHaveAttribute('readonly');
            expect(within(form).getByTestId('home-city')).toHaveAttribute('readonly');
            expect(within(form).getByTestId('home-state')).toHaveAttribute('readonly');
            expect(within(form).getByTestId('home-zip')).toHaveAttribute('readonly');

            expect(within(form).getByTestId('work-street-address')).toHaveAttribute('readonly');
            expect(within(form).getByTestId('work-street-address-2')).toHaveAttribute('readonly');
            expect(within(form).getByTestId('work-city')).toHaveAttribute('readonly');
            expect(within(form).getByTestId('work-state')).toHaveAttribute('readonly');
            expect(within(form).getByTestId('work-zip')).toHaveAttribute('readonly');

            expect(within(form).getByLabelText('Details')).toHaveAttribute('readonly');
        });

        test('adding a new user', () => {
            userEvent.click(screen.getByText('Add New User'));
            fillOutUser(anotherUserInfo);
            fillOutAddress(anotherUserInfo, 'home');
            userEvent.click(screen.getByLabelText('Same as Home'));
            userEvent.click(screen.getByText('Add'));

            expect(firstRowFirstCell).toHaveTextContent(`${anotherUserInfo.user.firstName} ${anotherUserInfo.user.lastName}`);
            expect(firstRowSecondCell).toHaveTextContent(anotherUserInfo.homeAddress.city);
            expect(firstRowThirdCell).toHaveTextContent('Yes');
        });

        test('should remove button if able to add a new user', () => {
            userEvent.click(screen.getByText('Add New User'));

            expect(screen.queryByText('Add New User')).not.toBeInTheDocument();
        });
    });

    describe('editing a user', () => {
        beforeEach(() => {
            act(() => {
                userEvent.click(within(firstRowThirdCell).getByText('Edit'));
            });
        });

        test('should populate the form', () => {
            const form = screen.getByTestId('user-info-form');
            expect(within(form).getByLabelText('First Name')).toHaveDisplayValue(userInfo.user.firstName);
            expect(within(form).getByLabelText('Last Name')).toHaveDisplayValue(userInfo.user.lastName);
            expect(within(form).getByLabelText('Email')).toHaveDisplayValue(userInfo.user.email!);

            expect(within(form).getByTestId('home-street-address')).toHaveDisplayValue(userInfo.homeAddress.streetAddress);
            expect(within(form).getByTestId('home-street-address-2')).toHaveDisplayValue(userInfo.homeAddress.streetAddressTwo!);
            expect(within(form).getByTestId('home-city')).toHaveDisplayValue(userInfo.homeAddress.city);
            expect(within(form).getByTestId('home-state')).toHaveDisplayValue(userInfo.homeAddress.state);
            expect(within(form).getByTestId('home-zip')).toHaveDisplayValue(userInfo.homeAddress.zip);

            expect(within(form).getByTestId('work-street-address')).toHaveDisplayValue(userInfo.workAddress?.streetAddress!);
            expect(within(form).getByTestId('work-street-address-2')).toHaveDisplayValue(userInfo.workAddress?.streetAddressTwo!);
            expect(within(form).getByTestId('work-city')).toHaveDisplayValue(userInfo.workAddress?.city!);
            expect(within(form).getByTestId('work-state')).toHaveDisplayValue(userInfo.workAddress?.state!);
            expect(within(form).getByTestId('work-zip')).toHaveDisplayValue(userInfo.workAddress?.zip!);

            expect(within(form).getByLabelText('Details')).toHaveDisplayValue(userInfo.details!);
        });

        test('after edit it should update the user', () => {
            const rows = screen.getAllByTestId('tr');
            const rowsOriginalLength = rows.length;
            const form = screen.getByTestId('user-info-form');
            const lastName = within(form).getByLabelText('Last Name');
            userEvent.type(lastName, ' more name');
            userEvent.click(screen.getByText('Update'));

            expect(firstRowFirstCell).toHaveTextContent(
                `${userInfo.user.firstName} ${userInfo.user.lastName} more name`
            );

            expect(rowsOriginalLength).toEqual(screen.getAllByTestId('tr').length);
        });

        test('should be able to reset the form to the original information before updating', () => {
            const form = screen.getByTestId('user-info-form');
            const lastName = within(form).getByLabelText('Last Name');
            userEvent.type(lastName, ' more name');
            expect(lastName).toHaveDisplayValue(`${userInfo.user.lastName} more name`);
            userEvent.click(screen.getByText('Reset'));
            expect(lastName).toHaveDisplayValue(userInfo.user.lastName);
        });
    });
});