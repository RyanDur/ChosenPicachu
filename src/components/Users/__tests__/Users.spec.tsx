import {fireEvent, screen, waitFor, within} from '@testing-library/react';
import {format} from 'date-fns';
import {createUser, users as someUsers} from '../../../__tests__/util/dummyData';
import {Rendered, renderWithRouter} from '../../../__tests__/util';
import {Users} from '../index';
import userEvent from '@testing-library/user-event';
import {data} from '../../../data';
import {AddressInfo, User} from '../../UserInfo/types';
import {users} from '../../../data/users';

describe('the users page', () => {
  const currentUsers = someUsers;
  const firstUser = currentUsers[0];

  beforeEach(() => {
    data.usersApi = users(currentUsers);
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

    it('should be able to reset the form to the original information', async () => {
      const form = screen.getByTestId('user-info-form');
      await userEvent.type(within(form).getByLabelText('First Name'), ' with more text');

      expect(within(form).getByLabelText('First Name'))
        .toHaveDisplayValue(`${firstUser.info.firstName} with more text`);

      await userEvent.click(within(form).getByText('Reset'));

      expect(within(form).getByLabelText('First Name'))
        .toHaveDisplayValue(`${firstUser.info.firstName}`);
    });

    it('should be able to cancel the form to the original information', async () => {
      const form = screen.getByTestId('user-info-form');
      await userEvent.click(within(form).getByText('Cancel'));
      expect(rendered().testLocation?.search).toEqual(`?id=${firstUser.id}&mode=view`);
    });
  });

  test('updating a user', async () => {
    const spy = vi.spyOn(data.usersApi, 'update');

    renderWithRouter(<Users/>);

    await waitFor(() => userEvent.click(within(screen.getByTestId('cell-4-0'))
      .getByText('Edit')));

    await waitFor(() => userEvent.click(within(screen.getByTestId('user-info-form'))
      .getByText('Update')));

    expect(spy).toHaveBeenCalled();
  });

  test('removing a user', async () => {
    const spy = vi.spyOn(data.usersApi, 'delete');

    renderWithRouter(<Users/>);

    await waitFor(() => userEvent.click(within(screen.getByTestId('cell-4-0'))
      .getByText('Remove')));

    expect(spy).toHaveBeenCalledWith(firstUser);
  });

  test('cloning a user', async () => {
    const spy = vi.spyOn(data.usersApi, 'add');
    renderWithRouter(<Users/>);

    await waitFor(() => userEvent.click(within(screen.getByTestId('cell-4-0'))
      .getByText('Clone')));

    await waitFor(() => userEvent.click(within(screen.getByTestId('user-info-form'))
      .getByText('Add')));

    expect(spy).toHaveBeenCalled();
  });
});

const addUser = async (user: User) => {
  await userEvent.type(screen.getByLabelText('First Name'), user.info.firstName);
  await userEvent.type(screen.getByLabelText('Last Name'), user.info.lastName);
  await userEvent.type(screen.getByLabelText('Email'), user.info.email);
  await userEvent.type(screen.getByLabelText('Date Of Birth'), format(user.info.dob!, 'P'));

  await addAddress(user.homeAddress, screen.getByTestId('home-address'));

  if (user.workAddress) await addAddress(user.workAddress, screen.getByTestId('work-address'));

  await userEvent.type(screen.getByLabelText('Details'), user.details || '');

  await waitFor(() => fireEvent.submit(screen.getByText('Add')));
};

const addAddress = async (address: AddressInfo, element: HTMLElement) => {
  await userEvent.type(within(element).getByLabelText('Street'), address.streetAddress);
  await userEvent.type(within(element).getByLabelText('Street Line 2'), address.streetAddressTwo || '');
  await userEvent.type(within(element).getByLabelText('City'), address.city);
  await userEvent.selectOptions(within(element).getByLabelText('State'), [address.state]);
  await userEvent.type(within(element).getByLabelText('Postal / Zip code'), address.zip);
};
