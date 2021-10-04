import {act, screen, waitFor, within} from '@testing-library/react';
import {Users} from '../index';
import userEvent from '@testing-library/user-event';
import {
    createAddress, fakeAsyncEvent,
    fillOutAddress,
    fillOutUser,
    Rendered,
    renderWithRouter,
    createUser,
    users
} from '../../../__tests__/util';
import {Paths} from '../../../App';
import {User} from '../../UserInfo/types';
import {data} from '../../../data';
import {asyncEvent, asyncResult, OnAsyncEvent} from '@ryandur/sand';
import {Explanation, HTTPError} from '../../../data/types';

const addUser = (anotherUserInfo: User) => {
    fillOutUser(anotherUserInfo);
    fillOutAddress(anotherUserInfo.homeAddress, 'home');
    userEvent.click(screen.getByLabelText('Same as Home'));
    userEvent.click(screen.getByText('Add'));
};

describe('the users page', () => {
    const anotherUser = createUser(createAddress());
    const aUser = createUser(createAddress());
    const secondUser = users[1];

    let table: HTMLElement,
        firstRowFirstCell: HTMLElement,
        firstRowSecondCell: HTMLElement,
        firstRowThirdCell: HTMLElement,
        firstRowFourthCell: HTMLElement,
        firstRowFifthCell: HTMLElement,
        secondRowFifthCell: HTMLElement,
        rendered: () => Rendered;

    beforeEach(() => {
        data.users.getAll = jest.fn((): OnAsyncEvent<User[], Explanation<HTTPError>> => ({
            ...fakeAsyncEvent(),
            onLoad: dispatch => {
                dispatch(users);
                return asyncEvent(asyncResult.success(users));
            }
        }));
        data.users.get = jest.fn((): OnAsyncEvent<User, Explanation<HTTPError>> => ({
            ...fakeAsyncEvent(),
            onLoad: dispatch => {
                dispatch(aUser);
                return asyncEvent(asyncResult.success(aUser));
            }
        }));
        data.users.add = jest.fn((user: User): OnAsyncEvent<User[], Explanation<HTTPError>> => ({
            ...fakeAsyncEvent(),
            onLoad: dispatch => {
                dispatch([user, ...users]);
                return asyncEvent(asyncResult.success([user, ...users]));
            }
        }));
        data.users.update = jest.fn((user: User): OnAsyncEvent<User[], Explanation<HTTPError>> => ({
            ...fakeAsyncEvent(),
            onLoad: dispatch => {
                dispatch([user, ...users.filter(aUser => aUser !== user)]);
                return asyncEvent(asyncResult.success([user, ...users.filter(aUser => aUser !== user)]));
            }
        }));
        data.users.delete = jest.fn((user: User): OnAsyncEvent<User[], Explanation<HTTPError>> => ({
            ...fakeAsyncEvent(),
            onLoad: dispatch => {
                dispatch(users.filter(aUser => aUser !== user));
                return asyncEvent(asyncResult.success(users.filter(aUser => aUser !== user)));
            }
        }));
        rendered = renderWithRouter(<Users/>, {path: Paths.users});
        table = screen.getByTestId('table');
        firstRowFirstCell = within(table).getByTestId('cell-0-0');
        firstRowSecondCell = within(table).getByTestId('cell-1-0');
        firstRowThirdCell = within(table).getByTestId('cell-2-0');
        firstRowFourthCell = within(table).getByTestId('cell-3-0');
        firstRowFifthCell = within(table).getByTestId('cell-4-0');

        secondRowFifthCell = within(table).getByTestId('cell-4-1');

        Date.now = () => new Date('2021-07-11').getTime();
        aUser.info.dob = new Date('1980-11-28');
        anotherUser.info.dob = new Date('1978-11-28');

        fillOutUser(aUser);
        fillOutAddress(aUser.homeAddress, 'home');
        fillOutAddress(aUser.workAddress!, 'work');
        userEvent.type(screen.getByLabelText('Details'), aUser.details!);
        userEvent.click(screen.getByText('Add'));
    });

    describe('adding a user', () => {
        it('should display in descending order', () => {
            addUser(anotherUser);

            expect(firstRowFirstCell).toHaveTextContent(`${anotherUser.info.firstName} ${anotherUser.info.lastName}`);
            expect(firstRowSecondCell).toHaveTextContent(anotherUser.homeAddress.city);
            expect(firstRowThirdCell).toHaveTextContent('42 years old');
            expect(firstRowFifthCell).toHaveTextContent('Yes');
        });

        it('should indicate a user works from home when there work and home address amtch', () => {
            fillOutUser(aUser);
            fillOutAddress(aUser.homeAddress, 'home');
            fillOutAddress(aUser.homeAddress, 'work');
            userEvent.click(screen.getByText('Add'));
            expect(firstRowFifthCell).toHaveTextContent('Yes');
        });
    });

    describe('viewing a user', () => {

        beforeEach(() => {
            data.users.get = () => asyncEvent(asyncResult.success(aUser));
            act(() => userEvent.click(within(firstRowFifthCell).getByText('View')));
        });

        test('populating the form with the chosen user', async () => {
            containsUser(screen.getByTestId('user-info-form'), aUser);
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
            expect(rendered().testLocation?.search).toEqual('');
        });

        test('should remove button if able to add a new user', () => {
            userEvent.click(screen.getByText('Add New User'));

            expect(screen.queryByText('Add New User')).not.toBeInTheDocument();
        });

        test('should be able to edit', () => {
            const form = screen.getByTestId('user-info-form');
            userEvent.click(within(form).getByText('Edit'));

            expect(rendered().testLocation?.search).toEqual(`?email=${aUser.info.email}&mode=edit`);
        });
    });

    describe('editing a user', () => {
        beforeEach(() => {
            act(() => {
                userEvent.click(within(firstRowFifthCell).getByText('Edit'));
            });
        });

        test('should populate the form', () => {
            const form = screen.getByTestId('user-info-form');
            containsUser(form, aUser);

            expect(within(form).getByTestId('home-address-street')).toHaveDisplayValue(aUser.homeAddress.streetAddress);
            expect(within(form).getByTestId('home-address-street-2')).toHaveDisplayValue(aUser.homeAddress.streetAddressTwo!);
            expect(within(form).getByTestId('home-address-city')).toHaveDisplayValue(aUser.homeAddress.city);
            expect(within(form).getByTestId('home-address-state')).toHaveDisplayValue(aUser.homeAddress.state);
            expect(within(form).getByTestId('home-address-zip')).toHaveDisplayValue(aUser.homeAddress.zip);

            expect(within(form).getByTestId('work-address-street')).toHaveDisplayValue(aUser.workAddress?.streetAddress!);
            expect(within(form).getByTestId('work-address-street-2')).toHaveDisplayValue(aUser.workAddress?.streetAddressTwo!);
            expect(within(form).getByTestId('work-address-city')).toHaveDisplayValue(aUser.workAddress?.city!);
            expect(within(form).getByTestId('work-address-state')).toHaveDisplayValue(aUser.workAddress?.state!);
            expect(within(form).getByTestId('work-address-zip')).toHaveDisplayValue(aUser.workAddress?.zip!);

            expect(within(form).getByLabelText('Details')).toHaveDisplayValue(aUser.details!);
        });

        test('should be able to reset the form to the original information before updating', () => {
            const form = screen.getByTestId('user-info-form');
            const lastName = within(form).getByLabelText('Last Name');
            userEvent.type(lastName, ' more name');
            expect(lastName).toHaveDisplayValue(`${aUser.info.lastName} more name`);
            userEvent.click(screen.getByText('Reset'));
            expect(lastName).toHaveDisplayValue(aUser.info.lastName);
        });

        test('should be able to cancel the form to the original information before updating', async () => {
            const form = screen.getByTestId('user-info-form');
            const lastName = within(form).getByLabelText('Last Name');
            userEvent.type(lastName, ' more name');

            expect(lastName).toHaveDisplayValue(`${aUser.info.lastName} more name`);

            act(() => userEvent.click(screen.getByText('Cancel')));

            expect(lastName).toHaveDisplayValue(aUser.info.lastName);
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
                    `${aUser.info.firstName} ${aUser.info.lastName} more name`
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
                expect(within(form).getByLabelText('Last Name')).not.toHaveDisplayValue(aUser.info.lastName);
            });
        });
    });

    describe('removing a user', () => {
        it('should remove from table', () => {
            const trs = screen.getAllByTestId('tr');
            const originalLength = trs.length;

            expect(firstRowFirstCell).toHaveTextContent(`${aUser.info.firstName} ${aUser.info.lastName}`);

            userEvent.click(within(firstRowFifthCell).getByText('Remove'));

            expect(firstRowFirstCell).not.toHaveTextContent(`${aUser.info.firstName} ${aUser.info.lastName}`);
            expect(screen.getAllByTestId('tr').length).toEqual(originalLength - 1);
        });

        describe('when a user is being viewed', () => {
            beforeEach(() => {
                userEvent.click(within(firstRowFifthCell).getByText('View'));
                expect(rendered().testLocation?.pathname).toEqual(`${Paths.users}`);
                expect(rendered().testLocation?.search).toEqual(`?email=${aUser.info.email}&mode=view`);
            });

            it('should update the url when removing the viewed user', () => {
                userEvent.click(within(firstRowFifthCell).getByText('Remove'));

                expect(rendered().testLocation?.pathname).toEqual(`${Paths.users}`);
                expect(rendered().testLocation?.search).toEqual('');
            });

            it('should not update the url when removing a user other than the viewed one', () => {
                userEvent.click(within(secondRowFifthCell).getByText('Remove'));

                expect(rendered().testLocation?.pathname).toEqual(`${Paths.users}`);
                expect(rendered().testLocation?.search).toEqual(`?email=${aUser.info.email}&mode=view`);
            });
        });

        describe('when a user is being edited', () => {
            beforeEach(() => {
                userEvent.click(within(firstRowFifthCell).getByText('Edit'));
                expect(rendered().testLocation?.pathname).toEqual(`${Paths.users}`);
                expect(rendered().testLocation?.search).toEqual(`?email=${aUser.info.email}&mode=edit`);
            });

            it('should reset the form when removing the user being edited', async () => {
                act(() => userEvent.click(within(firstRowFifthCell).getByText('Remove')));

                expect(rendered().testLocation?.pathname).toEqual(`${Paths.users}`);
                expect(rendered().testLocation?.search).toEqual('');
            });

            it('should not reset the form when removing a user other than the one being edited', () => {
                userEvent.click(within(secondRowFifthCell).getByText('Remove'));

                containsUser(screen.getByTestId('user-info-form'), aUser);
                expect(rendered().testLocation?.pathname).toEqual(`${Paths.users}`);
                expect(rendered().testLocation?.search).toEqual(`?email=${aUser.info.email}&mode=edit`);
            });
        });
    });

    describe('cloning a user', () => {
        beforeEach(() => {
            userEvent.click(within(firstRowFifthCell).getByText('Clone'));
            const form = screen.getByTestId('user-info-form');
            const lastName = within(form).getByLabelText('Last Name');
            userEvent.type(lastName, ' more name');
        });

        test('add a user', () => {
            expect(firstRowFirstCell).toHaveTextContent(`${aUser.info.firstName} ${aUser.info.lastName}`);
            userEvent.click(screen.getByText('Add'));

            expect(firstRowFirstCell).toHaveTextContent(
                `${aUser.info.firstName} more name ${aUser.info.lastName}`
            );
        });
    });

    describe('user friends', () => {
        it('should update the user', () => {
            userEvent.selectOptions(within(firstRowFourthCell).getByTestId('select-friend'), [
                `${secondUser.info.firstName} ${secondUser.info.lastName}`
            ]);

            expect(data.users.update).toHaveBeenCalled();
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

    const containsUser = (form: HTMLElement, user?: User) => {
        const userForm = getUserFormElements(form);
        expect(userForm.firstName).toHaveDisplayValue(user?.info.firstName || '');
        expect(userForm.lastName).toHaveDisplayValue(user?.info.lastName || '');
        expect(userForm.email).toHaveDisplayValue(user?.info.email! || '');
        expect(userForm.homeAddressStreet).toHaveDisplayValue(user?.homeAddress.streetAddress || '');
        expect(userForm.homeAddressStreet2).toHaveDisplayValue(user?.homeAddress.streetAddressTwo! || '');
        expect(userForm.homeAddressCity).toHaveDisplayValue(user?.homeAddress.city || '');
        expect(userForm.homeAddressState).toHaveDisplayValue(user?.homeAddress.state || '');
        expect(userForm.homeAddressZip).toHaveDisplayValue(user?.homeAddress.zip || '');

        expect(userForm.workAddressStreet).toHaveDisplayValue(user?.workAddress?.streetAddress! || '');
        expect(userForm.workAddressStreet2).toHaveDisplayValue(user?.workAddress?.streetAddressTwo! || '');
        expect(userForm.workAddressCity).toHaveDisplayValue(user?.workAddress?.city! || '');
        expect(userForm.workAddressState).toHaveDisplayValue(user?.workAddress?.state! || '');
        expect(userForm.workAddressZip).toHaveDisplayValue(user?.workAddress?.zip! || '');
        expect(userForm.details).toHaveDisplayValue(user?.details! || '');
    };
});