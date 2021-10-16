import {act, screen, waitFor, within} from '@testing-library/react';
import {createUser, Rendered, renderWithRouter, users} from '../../../__tests__/util';
import {Users} from '../index';
import userEvent from '@testing-library/user-event';
import {toISOWithoutTime} from '../../util';
import {asyncResult, maybe} from '@ryandur/sand';
import {data} from '../../../data';
import {AddressInfo, User} from '../../UserInfo/types';
import {Explanation, explanation, HTTPError} from '../../../data/types';

const {success, failure} = asyncResult;

jest.mock('../../../data', () => ({
    data: {
        users: {
            getAll: jest.fn(),
            get: jest.fn(),
            add: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }
    }
}));

describe('the users page', () => {
    let currentUsers = users;
    const firstUser = currentUsers[0];

    beforeEach(() => {
        currentUsers = users;
        data.users.getAll = () => success(currentUsers);
        data.users.get = id => maybe.of(currentUsers.find(user => user.id === id))
            .map(user => success<User, Explanation<HTTPError>>(user))
            .orElse(failure<User, Explanation<HTTPError>>(explanation(HTTPError.UNKNOWN)));
        data.users.add = jest.fn((user: User) => {
            currentUsers = [user, ...currentUsers];
            return success(currentUsers);
        });
        data.users.update = jest.fn((user: User) => {
            currentUsers = currentUsers.map(currentUser => currentUser.id === user.id ? user : currentUser);
            return success(currentUsers);
        });
        data.users.delete = jest.fn((user: User) => {
            currentUsers = currentUsers.filter(currentUser => currentUser.id !== user.id);
            return success(currentUsers);
        });
    });

    describe('adding a user', () => {
        const aUser = createUser(true);
        const anotherUser = createUser(false);

        beforeEach(async () => {
            renderWithRouter(<Users/>);
            await addUser(aUser);
            await addUser(anotherUser);
        });

        it('should display the new user', async () => {
            const table = screen.getByTestId('table');
            expect(within(table).getByTestId('tbody')).toHaveTextContent(`${aUser.info.firstName} ${aUser.info.lastName}`);
        });

        it('should indicate a user works from home when there work and home address match', () => {
            const table = screen.getByTestId('table');
            expect(within(table).getByTestId('cell-4-0')).toHaveTextContent('No');
            expect(within(table).getByTestId('cell-4-1')).toHaveTextContent('Yes');
        });
    });

    describe('viewing a user', () => {
        beforeEach(async () => {
            renderWithRouter(<Users/>);
            await waitFor(() => userEvent.click(within(screen.getByTestId('cell-4-0')).getByText('View')));
        });

        test('populating the form with the chosen user', () => {
            expect(screen.getByLabelText('First Name')).toHaveDisplayValue(firstUser.info.firstName);
        });

        it('should be able to add a user', () => {
            expect(screen.queryByText('Add New User')).toBeInTheDocument();
        });

        it('should be able to edit', () => {
            expect(within(screen.getByTestId('user-info-form')).queryByText('Edit')).toBeInTheDocument();
        });
    });

    describe('editing a user', () => {
        let rendered: () => Rendered;
        beforeEach(async () => {
            rendered = renderWithRouter(<Users/>);
            await waitFor(() => userEvent.click(within(screen.getByTestId('cell-4-0'))
                .getByText('Edit')));
        });

        it('should populate the form', () => {
            const form = screen.getByTestId('user-info-form');
            expect(within(form).getByLabelText('First Name')).toHaveDisplayValue(firstUser.info.firstName);
            expect(within(form).getByLabelText('Last Name')).toHaveDisplayValue(firstUser.info.lastName);
        });

        it('should be able to reset the form to the original information', () => {
            const form = screen.getByTestId('user-info-form');
            userEvent.type(within(form).getByLabelText('First Name'), ' with more text');

            expect(within(form).getByLabelText('First Name'))
                .toHaveDisplayValue(`${firstUser.info.firstName} with more text`);

            userEvent.click(within(form).getByText('Reset'));

            expect(within(form).getByLabelText('First Name'))
                .toHaveDisplayValue(`${firstUser.info.firstName}`);
        });

        it('should be able to cancel the form to the original information', () => {
            const form = screen.getByTestId('user-info-form');
            userEvent.click(within(form).getByText('Cancel'));
            expect(rendered().testLocation?.search).toEqual(`?id=${firstUser.id}&mode=view`);
        });
    });

    test('updating a user', async () => {
        renderWithRouter(<Users/>);

        await waitFor(() => userEvent.click(within(screen.getByTestId('cell-4-0'))
            .getByText('Edit')));

        await waitFor(() => userEvent.click(within(screen.getByTestId('user-info-form'))
            .getByText('Update')));

        expect(data.users.update).toHaveBeenCalled();
    });

    test('removing a user', async () => {
        renderWithRouter(<Users/>);

        await waitFor(() => userEvent.click(within(screen.getByTestId('cell-4-0'))
            .getByText('Remove')));

        expect(data.users.delete).toHaveBeenCalledWith(firstUser);
    });

    test('cloning a user', async () => {
        renderWithRouter(<Users/>);

        await waitFor(() => userEvent.click(within(screen.getByTestId('cell-4-0'))
            .getByText('Clone')));

        await waitFor(() => userEvent.click(within(screen.getByTestId('user-info-form'))
            .getByText('Add')));

        expect(data.users.add).toHaveBeenCalled();
    });
});

const addUser = async (user: User) => {
    userEvent.type(screen.getByLabelText('First Name'), user.info.firstName);
    userEvent.type(screen.getByLabelText('Last Name'), user.info.lastName);
    userEvent.type(screen.getByLabelText('Email'), user.info.email);
    userEvent.type(screen.getByLabelText('Date Of Birth'), toISOWithoutTime(user.info.dob!));

    addAddress(user.homeAddress, screen.getByTestId('home-address'));

    if (user.workAddress) addAddress(user.workAddress, screen.getByTestId('work-address'));

    userEvent.type(screen.getByLabelText('Details'), user.details || '');

    await act(async () => await act(async () =>
        await waitFor(() => userEvent.click(screen.getByText('Add')))));
};

const addAddress = (address: AddressInfo, element: HTMLElement) => {
    userEvent.type(within(element).getByLabelText('Street'), address.streetAddress);
    userEvent.type(within(element).getByLabelText('Street Line 2'), address.streetAddressTwo || '');
    userEvent.type(within(element).getByLabelText('City'), address.city);
    userEvent.selectOptions(within(element).getByLabelText('State'), [address.state]);
    userEvent.type(within(element).getByLabelText('Postal / Zip code'), address.zip);
};
