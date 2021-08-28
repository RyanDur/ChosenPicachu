import {act, screen, waitFor, within} from '@testing-library/react';
import {Users} from '../index';
import userEvent from '@testing-library/user-event';
import {
    createAddress,
    fillOutAddress,
    fillOutUser,
    Rendered,
    renderWithRouter,
    userInfo,
    users
} from '../../../__tests__/util';
import {Paths} from '../../../App';
import {UserInfo} from '../../UserInfo/types';

const addUser = (anotherUserInfo: UserInfo) => {
    fillOutUser(anotherUserInfo);
    fillOutAddress(anotherUserInfo.homeAddress, 'home');
    userEvent.click(screen.getByLabelText('Same as Home'));
    userEvent.click(screen.getByText('Add'));
};
const mockUsers = users;
jest.mock('../../../__tests__/util', () => ({
    ...jest.requireActual('../../../__tests__/util'),
    createRandomUsers: () => jest.fn(() => mockUsers)
}));

describe('the users page', () => {
    const anotherUserInfo = userInfo(createAddress());
    const aUserInfo = userInfo(createAddress());
    let table: HTMLElement,
        firstRowFirstCell: HTMLElement,
        firstRowSecondCell: HTMLElement,
        firstRowThirdCell: HTMLElement,
        firstRowFourthCell: HTMLElement,
        secondRowFourthCell: HTMLElement,
        rendered: () => Rendered;
    beforeEach(() => {
        rendered = renderWithRouter(<Users/>, {path: Paths.users});
        table = screen.getByTestId('table');
        firstRowFirstCell = within(table).getByTestId('cell-0-0');
        firstRowSecondCell = within(table).getByTestId('cell-1-0');
        firstRowThirdCell = within(table).getByTestId('cell-2-0');
        firstRowFourthCell = within(table).getByTestId('cell-3-0');

        secondRowFourthCell = within(table).getByTestId('cell-3-1');

        Date.now = () => new Date('2021-07-11').getTime();
        aUserInfo.user.dob = new Date('1980-11-28');
        anotherUserInfo.user.dob = new Date('1978-11-28');

        fillOutUser(aUserInfo);
        fillOutAddress(aUserInfo.homeAddress, 'home');
        fillOutAddress(aUserInfo.workAddress!, 'work');
        userEvent.type(screen.getByLabelText('Details'), aUserInfo.details!);
        userEvent.click(screen.getByText('Add'));
    });

    describe('adding a user', () => {
        test('user info in table in descending order', () => {
            addUser(anotherUserInfo);

            expect(firstRowFirstCell).toHaveTextContent(`${anotherUserInfo.user.firstName} ${anotherUserInfo.user.lastName}`);
            expect(firstRowSecondCell).toHaveTextContent(anotherUserInfo.homeAddress.city);
            expect(firstRowThirdCell).toHaveTextContent('42 years old');
            expect(firstRowFourthCell).toHaveTextContent('Yes');
        });

        test('when user types in the same address as home it should indicate they work from home', () => {
            fillOutUser(aUserInfo);
            fillOutAddress(aUserInfo.homeAddress, 'home');
            fillOutAddress(aUserInfo.homeAddress, 'work');
            userEvent.click(screen.getByText('Add'));
            expect(firstRowFourthCell).toHaveTextContent('Yes');
        });
    });

    describe('viewing a user', () => {
        let form: HTMLElement;

        beforeEach(() => {
            userEvent.click(within(firstRowFourthCell).getByText('View'));
            form = screen.getByTestId('user-info-form');
        });

        test('populating the form with the chosen user', () => {
            containsUser(form, aUserInfo);
        });

        test('should not be able to change the uses data', async () => {
            expect(within(form).getByLabelText('First Name')).toHaveAttribute('readonly');
            expect(within(form).getByLabelText('Last Name')).toHaveAttribute('readonly');
            expect(within(form).getByLabelText('Email')).toHaveAttribute('readonly');

            const avatarImage: HTMLImageElement = form.querySelector('#avatar')!;
            const imageSrc = avatarImage.src;
            userEvent.click(within(form).getByTestId('avatar-cell'));
            expect(avatarImage.src).toEqual(imageSrc);

            expect(within(form).getByTestId('home-address-street')).toHaveAttribute('readonly');
            expect(within(form).getByTestId('home-address-street-2')).toHaveAttribute('readonly');
            expect(within(form).getByTestId('home-address-city')).toHaveAttribute('readonly');
            expect(within(form).getByTestId('home-address-state')).toHaveAttribute('readonly');
            expect(within(form).getByTestId('home-address-zip')).toHaveAttribute('readonly');

            expect(within(form).getByTestId('work-address-street')).toHaveAttribute('readonly');
            expect(within(form).getByTestId('work-address-street-2')).toHaveAttribute('readonly');
            expect(within(form).getByTestId('work-address-city')).toHaveAttribute('readonly');
            expect(within(form).getByTestId('work-address-state')).toHaveAttribute('readonly');
            expect(within(form).getByTestId('work-address-zip')).toHaveAttribute('readonly');

            expect(within(form).getByLabelText('Details')).toHaveAttribute('readonly');
        });

        test('adding a new user', () => {
            userEvent.click(screen.getByText('Add New User'));
            addUser(anotherUserInfo);

            expect(firstRowFirstCell).toHaveTextContent(`${anotherUserInfo.user.firstName} ${anotherUserInfo.user.lastName}`);
            expect(firstRowSecondCell).toHaveTextContent(anotherUserInfo.homeAddress.city);
            expect(firstRowThirdCell).toHaveTextContent('42 years old');
            expect(firstRowFourthCell).toHaveTextContent('Yes');
        });

        test('should remove button if able to add a new user', () => {
            userEvent.click(screen.getByText('Add New User'));

            expect(screen.queryByText('Add New User')).not.toBeInTheDocument();
        });

        test('should be able to edit', () => {
            userEvent.click(within(form).getByText('Edit'));
            const userForm = getUserFormElements(form);

            expect(userForm.firstName).not.toHaveAttribute('readonly');
            expect(userForm.lastName).not.toHaveAttribute('readonly');
            expect(userForm.email).not.toHaveAttribute('readonly');
            expect(userForm.dob).not.toHaveAttribute('readonly');

            expect(userForm.dob).toHaveDisplayValue('1980-11-28');
            expect(userForm.homeAddressStreet).not.toHaveAttribute('readonly');
            expect(userForm.homeAddressStreet2).not.toHaveAttribute('readonly');
            expect(userForm.homeAddressCity).not.toHaveAttribute('readonly');
            expect(userForm.homeAddressState).not.toHaveAttribute('readonly');
            expect(userForm.homeAddressZip).not.toHaveAttribute('readonly');
            expect(userForm.workAddressStreet).not.toHaveAttribute('readonly');
            expect(userForm.workAddressStreet2).not.toHaveAttribute('readonly');
            expect(userForm.workAddressCity).not.toHaveAttribute('readonly');
            expect(userForm.workAddressState).not.toHaveAttribute('readonly');

            expect(userForm.workAddressZip).not.toHaveAttribute('readonly');
            expect(userForm.details).not.toHaveAttribute('readonly');
        });
    });

    describe('editing a user', () => {
        beforeEach(() => {
            act(() => {
                userEvent.click(within(firstRowFourthCell).getByText('Edit'));
            });
        });

        test('should populate the form', () => {
            const form = screen.getByTestId('user-info-form');
            containsUser(form, aUserInfo);

            expect(within(form).getByTestId('home-address-street')).toHaveDisplayValue(aUserInfo.homeAddress.streetAddress);
            expect(within(form).getByTestId('home-address-street-2')).toHaveDisplayValue(aUserInfo.homeAddress.streetAddressTwo!);
            expect(within(form).getByTestId('home-address-city')).toHaveDisplayValue(aUserInfo.homeAddress.city);
            expect(within(form).getByTestId('home-address-state')).toHaveDisplayValue(aUserInfo.homeAddress.state);
            expect(within(form).getByTestId('home-address-zip')).toHaveDisplayValue(aUserInfo.homeAddress.zip);

            expect(within(form).getByTestId('work-address-street')).toHaveDisplayValue(aUserInfo.workAddress?.streetAddress!);
            expect(within(form).getByTestId('work-address-street-2')).toHaveDisplayValue(aUserInfo.workAddress?.streetAddressTwo!);
            expect(within(form).getByTestId('work-address-city')).toHaveDisplayValue(aUserInfo.workAddress?.city!);
            expect(within(form).getByTestId('work-address-state')).toHaveDisplayValue(aUserInfo.workAddress?.state!);
            expect(within(form).getByTestId('work-address-zip')).toHaveDisplayValue(aUserInfo.workAddress?.zip!);

            expect(within(form).getByLabelText('Details')).toHaveDisplayValue(aUserInfo.details!);
        });

        test('should be able to reset the form to the original information before updating', () => {
            const form = screen.getByTestId('user-info-form');
            const lastName = within(form).getByLabelText('Last Name');
            userEvent.type(lastName, ' more name');
            expect(lastName).toHaveDisplayValue(`${aUserInfo.user.lastName} more name`);
            userEvent.click(screen.getByText('Reset'));
            expect(lastName).toHaveDisplayValue(aUserInfo.user.lastName);
        });

        test('should be able to cancel the form to the original information before updating', async () => {
            const form = screen.getByTestId('user-info-form');
            const lastName = within(form).getByLabelText('Last Name');
            userEvent.type(lastName, ' more name');

            expect(lastName).toHaveDisplayValue(`${aUserInfo.user.lastName} more name`);

            act(() => userEvent.click(screen.getByText('Cancel')));

            expect(lastName).toHaveDisplayValue(aUserInfo.user.lastName);
            await waitFor(() => expect(within(form).getByLabelText('Last Name')).toHaveAttribute('readonly'));
        });

        describe('on update', () => {
            beforeEach(() => {
                const form = screen.getByTestId('user-info-form');
                const lastName = within(form).getByLabelText('Last Name');
                userEvent.type(lastName, ' more name');
            });

            test('should put the user in first row', () => {
                userEvent.click(screen.getByText('Update'));
                expect(firstRowFirstCell).toHaveTextContent(
                    `${aUserInfo.user.firstName} ${aUserInfo.user.lastName} more name`
                );
            });

            it('should not effect the number of rows', () => {
                const rows = screen.getAllByTestId('tr');
                const rowsOriginalLength = rows.length;
                userEvent.click(screen.getByText('Update'));
                expect(rowsOriginalLength).toEqual(screen.getAllByTestId('tr').length);
            });

            it('should reset from the form on update', () => {
                userEvent.click(screen.getByText('Update'));
                const form = screen.getByTestId('user-info-form');
                expect(within(form).getByLabelText('Last Name')).not.toHaveDisplayValue(aUserInfo.user.lastName);
            });
        });
    });

    describe('removing a user', () => {
        it('should remove from table', () => {
            const trs = screen.getAllByTestId('tr');
            const originalLength = trs.length;

            expect(firstRowFirstCell).toHaveTextContent(`${aUserInfo.user.firstName} ${aUserInfo.user.lastName}`);

            userEvent.click(within(firstRowFourthCell).getByText('Remove'));

            expect(firstRowFirstCell).not.toHaveTextContent(`${aUserInfo.user.firstName} ${aUserInfo.user.lastName}`);
            expect(screen.getAllByTestId('tr').length).toEqual(originalLength - 1);
        });

        describe('when a user is being viewed', () => {
            beforeEach(() => {
                userEvent.click(within(firstRowFourthCell).getByText('View'));
                expect(rendered().testLocation?.pathname).toEqual(`${Paths.users}`);
                expect(rendered().testLocation?.search).toEqual(`?email=${aUserInfo.user.email}&mode=view`);
            });

            it('should update the url when removing the viewed user', () => {
                userEvent.click(within(firstRowFourthCell).getByText('Remove'));

                expect(rendered().testLocation?.pathname).toEqual(`${Paths.users}`);
                expect(rendered().testLocation?.search).toEqual('');
            });

            it('should not update the url when removing a user other than the viewed one', () => {
                userEvent.click(within(secondRowFourthCell).getByText('Remove'));

                expect(rendered().testLocation?.pathname).toEqual(`${Paths.users}`);
                expect(rendered().testLocation?.search).toEqual(`?email=${aUserInfo.user.email}&mode=view`);
            });
        });

        describe('when a user is being edited', () => {
            beforeEach(() => {
                userEvent.click(within(firstRowFourthCell).getByText('Edit'));
                expect(rendered().testLocation?.pathname).toEqual(`${Paths.users}`);
                expect(rendered().testLocation?.search).toEqual(`?email=${aUserInfo.user.email}&mode=edit`);
            });

            it('should reset the form when removing the user being edited', async () => {
                userEvent.click(within(firstRowFourthCell).getByText('Remove'));

                containsUser(screen.getByTestId('user-info-form'));
                expect(rendered().testLocation?.pathname).toEqual(`${Paths.users}`);
                expect(rendered().testLocation?.search).toEqual('');
            });

            it('should not reset the form when removing a user other than the one being edited', () => {
                userEvent.click(within(secondRowFourthCell).getByText('Remove'));

                containsUser(screen.getByTestId('user-info-form'), aUserInfo);
                expect(rendered().testLocation?.pathname).toEqual(`${Paths.users}`);
                expect(rendered().testLocation?.search).toEqual(`?email=${aUserInfo.user.email}&mode=edit`);
            });
        });
    });

    describe('cloning a user', () => {
        beforeEach(() => {
            userEvent.click(within(firstRowFourthCell).getByText('Clone'));
            const form = screen.getByTestId('user-info-form');
            const lastName = within(form).getByLabelText('Last Name');
            userEvent.type(lastName, ' more name');
        });

        test('add a user', () => {
            expect(firstRowFirstCell).toHaveTextContent(`${aUserInfo.user.firstName} ${aUserInfo.user.lastName}`);
            userEvent.click(screen.getByText('Add'));

            expect(firstRowFirstCell).toHaveTextContent(
                `${aUserInfo.user.firstName} ${aUserInfo.user.lastName} more name`
            );
        });

        it('should effect the number of rows', () => {
            const rows = screen.getAllByTestId('tr');
            const rowsOriginalLength = rows.length;
            userEvent.click(screen.getByText('Add'));
            expect(rowsOriginalLength + 1).toEqual(screen.getAllByTestId('tr').length);
        });
    });

    const getUserFormElements = (form: HTMLElement) => ({
        firstName: within(form).getByLabelText('First Name'),
        lastName: within(form).getByLabelText('Last Name'),
        email: within(form).getByLabelText('Email'),
        dob: within(form).getByLabelText('Date Of Birth'),
        homeAddressStreet: within(form).getByTestId('home-address-street'),
        homeAddressStreet2: within(form).getByTestId('home-address-street-2'),
        homeAddressCity: within(form).getByTestId('home-address-city'),
        homeAddressState: within(form).getByTestId('home-address-state'),
        homeAddressZip: within(form).getByTestId('home-address-zip'),
        workAddressStreet: within(form).getByTestId('work-address-street'),
        workAddressStreet2: within(form).getByTestId('work-address-street-2'),
        workAddressCity: within(form).getByTestId('work-address-city'),
        workAddressState: within(form).getByTestId('work-address-state'),
        workAddressZip: within(form).getByTestId('work-address-zip'),
        details: within(form).getByLabelText('Details')
    });

    const containsUser = (form: HTMLElement, userInfo?: UserInfo) => {
        const userForm = getUserFormElements(form);
        expect(userForm.firstName).toHaveDisplayValue(userInfo?.user.firstName || '');
        expect(userForm.lastName).toHaveDisplayValue(userInfo?.user.lastName || '');
        expect(userForm.email).toHaveDisplayValue(userInfo?.user.email! || '');
        expect(userForm.homeAddressStreet).toHaveDisplayValue(userInfo?.homeAddress.streetAddress || '');
        expect(userForm.homeAddressStreet2).toHaveDisplayValue(userInfo?.homeAddress.streetAddressTwo! || '');
        expect(userForm.homeAddressCity).toHaveDisplayValue(userInfo?.homeAddress.city || '');
        expect(userForm.homeAddressState).toHaveDisplayValue(userInfo?.homeAddress.state || '');
        expect(userForm.homeAddressZip).toHaveDisplayValue(userInfo?.homeAddress.zip || '');

        expect(userForm.workAddressStreet).toHaveDisplayValue(userInfo?.workAddress?.streetAddress! || '');
        expect(userForm.workAddressStreet2).toHaveDisplayValue(userInfo?.workAddress?.streetAddressTwo! || '');
        expect(userForm.workAddressCity).toHaveDisplayValue(userInfo?.workAddress?.city! || '');
        expect(userForm.workAddressState).toHaveDisplayValue(userInfo?.workAddress?.state! || '');
        expect(userForm.workAddressZip).toHaveDisplayValue(userInfo?.workAddress?.zip! || '');
        expect(userForm.details).toHaveDisplayValue(userInfo?.details! || '');
    };
});