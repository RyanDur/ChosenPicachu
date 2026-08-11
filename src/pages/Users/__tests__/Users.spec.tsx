import {screen, waitFor, within} from '@testing-library/react';
import {format} from 'date-fns';
import {users as someUsers} from '@test-support/fixtures';
import {renderWithRouter} from '@test-support';
import userEvent from '@testing-library/user-event';
import {AddressInfo, User} from '@components/Users/UserInfo/types';
import {createUser, usersApi} from '@components/Users/resource/usersApi';
import {users} from '@components/Users/resource/users';
import {UsersPage} from '@pages/Users/component';

const cellAt = (column: number, row: number): HTMLElement => {
  const [, tbody] = screen.getAllByRole('rowgroup');
  const lane = within(tbody).getAllByRole('row')[row];
  const seat = [lane.querySelector('th'), ...lane.querySelectorAll('td')][column];
  if (!seat) throw new Error(`no cell ${column} in row ${row}`);
  return seat;
};

describe('the users page', () => {
  const currentUsers = someUsers;
  const firstUser = currentUsers[0];

  beforeEach(() => {
    const testResource = usersApi(someUsers);
    users.getAll = testResource.getAll;
    users.get = testResource.get;
    users.add = testResource.add;
    users.update = testResource.update;
    users.delete = testResource.delete;
  });

  describe('ranking the users', () => {
    it('groups by a column menu criterion', async () => {
      renderWithRouter(<UsersPage/>, {});
      const homes = () => within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row')
        .map(row => row.querySelectorAll('th, td')[4]?.textContent ?? '');
      await waitFor(() => expect(homes().length).toBeGreaterThan(1));

      const toggle = screen.getByRole('button', {name: 'sort worksFromHome'});
      const menu = document.getElementById(toggle.getAttribute('popovertarget') ?? '');
      if (!menu) throw new Error('no menu for worksFromHome');
      await userEvent.click(within(menu).getByText('ascending'));

      expect(homes()).toEqual([...homes()].sort((left, right) => left.localeCompare(right)));
      expect(screen.getAllByRole('button', {name: /move row/}).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', {name: /resize homeCity/}).length).toBe(1);
      expect(screen.getByRole('button', {name: 'sort age'})).toBeVisible();
      expect(screen.queryByRole('button', {name: 'sort fullName'})).toBeNull();
      expect(screen.queryByRole('button', {name: 'sort homeCity'})).toBeNull();
      expect(screen.queryByRole('button', {name: 'sort friends'})).toBeNull();
    });
  });

  describe('adding a user', () => {
    const conciseUser = (firstName: string, worksFromHome: boolean): User => {
      const homeAddress: AddressInfo = {
        streetAddress: '12 Elm St',
        streetAddressTwo: 'Apt. 3',
        city: 'Springfield',
        state: 'IL',
        zip: '62704'
      };
      return {
        ...createUser(worksFromHome),
        info: {
          firstName,
          lastName: 'Tester',
          email: `${firstName.toLowerCase()}@example.com`,
          dob: new Date(1984, 5, 2)
        },
        homeAddress,
        workAddress: worksFromHome ? homeAddress : {
          streetAddress: '9 Oak Ave',
          streetAddressTwo: 'Suite 2',
          city: 'Chatham',
          state: 'IL',
          zip: '62629'
        },
        details: 'short notes'
      };
    };
    const aUser = conciseUser('Aiko', true);
    const anotherUser = conciseUser('Bram', false);

    beforeEach(async () => {
      renderWithRouter(<UsersPage/>, {});
      await addUser(aUser);
      await addUser(anotherUser);
    });

    it('should display the new user', async () => {
      const [, tbody] = screen.getAllByRole('rowgroup');
      expect(tbody).toHaveTextContent(`${aUser.info.firstName} ${aUser.info.lastName}`);
    });

    it('should indicate a user works from home when there work and home address match', () => {
      expect(cellAt(4, 0)).toHaveTextContent('No');
      expect(cellAt(4, 1)).toHaveTextContent('Yes');
    });
  });

  describe('viewing a user', () => {
    beforeEach(async () => {
      renderWithRouter(<UsersPage/>);
      const view = await waitFor(() => within(cellAt(4, 0)).getByText('View'));
      await userEvent.click(view);
    });

    test('populating the form with the chosen user', () => {
      expect(screen.getByLabelText('First Name')).toHaveDisplayValue(firstUser.info.firstName);
    });

    it('should be able to add a user', () => {
      expect(screen.queryByText('Add New User')).toBeInTheDocument();
    });

    it('should be able to edit', () => {
      expect(within(screen.getByRole('form', {name: 'user info'})).queryByText('Edit')).toBeInTheDocument();
    });
  });

  describe('editing a user', () => {
    beforeEach(async () => {

      renderWithRouter(<UsersPage/>);
      const edit = await waitFor(() => within(cellAt(4, 0)).getByText('Edit'));
      await userEvent.click(edit);
    });

    it('should populate the form', () => {
      const form = screen.getByRole('form', {name: 'user info'});
      expect(within(form).getByLabelText('First Name')).toHaveDisplayValue(firstUser.info.firstName);
      expect(within(form).getByLabelText('Last Name')).toHaveDisplayValue(firstUser.info.lastName);
    });

    it('should be able to reset the form to the original information', async () => {
      const form = screen.getByRole('form', {name: 'user info'});
      await userEvent.type(within(form).getByLabelText('First Name'), ' with more text');

      expect(within(form).getByLabelText('First Name'))
        .toHaveDisplayValue(`${firstUser.info.firstName} with more text`);

      await userEvent.click(within(form).getByText('Reset'));

      expect(within(form).getByLabelText('First Name'))
        .toHaveDisplayValue(`${firstUser.info.firstName}`);
    });

    it('should be able to cancel the form to the original information', async () => {
      const form = screen.getByRole('form', {name: 'user info'});
      await userEvent.click(within(form).getByText('Cancel'));
      expect(screen.getByLabelText('url search')).toHaveTextContent(`id=${firstUser.id}&mode=view`);
    });
  });

  test('updating a user', async () => {
    const spy = vi.spyOn(users, 'update');

    renderWithRouter(<UsersPage/>);

    const editControl = await waitFor(() => within(cellAt(4, 0)).getByText('Edit'));
    await userEvent.click(editControl);

    const updateControl = await waitFor(() => within(screen.getByRole('form', {name: 'user info'})).getByText('Update'));
    await userEvent.click(updateControl);

    expect(spy).toHaveBeenCalled();
  });

  test('removing a user', async () => {
    const spy = vi.spyOn(users, 'delete');

    renderWithRouter(<UsersPage/>);

    const removeControl = await waitFor(() => within(cellAt(4, 0)).getByText('Remove'));
    await userEvent.click(removeControl);

    expect(spy).toHaveBeenCalledWith(firstUser);
  });

  test('cloning a user', async () => {
    const spy = vi.spyOn(users, 'add');
    renderWithRouter(<UsersPage/>);

    const cloneControl = await waitFor(() => within(cellAt(4, 0)).getByText('Clone'));
    await userEvent.click(cloneControl);

    const addControl = await waitFor(() => within(screen.getByRole('form', {name: 'user info'})).getByText('Add'));
    await userEvent.click(addControl);

    expect(spy).toHaveBeenCalled();
  });
});

const addUser = async (user: User) => {
  await userEvent.type(screen.getByLabelText('First Name'), user.info.firstName);
  await userEvent.type(screen.getByLabelText('Last Name'), user.info.lastName);
  await userEvent.type(screen.getByLabelText('Email'), user.info.email);
  await userEvent.type(screen.getByLabelText('Date Of Birth'), format(user.info.dob!, 'yyyy-MM-dd'));

  await addAddress(user.homeAddress, screen.getByRole('article', {name: 'Home Address'}));

  if (user.workAddress) await addAddress(user.workAddress, screen.getByRole('article', {name: 'Work Address'}));

  await userEvent.type(screen.getByLabelText('Details'), user.details || '');

  await userEvent.click(await screen.findByText('Add'));
};

const addAddress = async (address: AddressInfo, element: HTMLElement) => {
  await userEvent.type(within(element).getByLabelText('Street'), address.streetAddress);
  await userEvent.type(within(element).getByLabelText('Street Line 2'), address.streetAddressTwo || '');
  await userEvent.type(within(element).getByLabelText('City'), address.city);
  await userEvent.selectOptions(within(element).getByLabelText('State'), [address.state]);
  await userEvent.type(within(element).getByLabelText('Postal / Zip code'), address.zip);
};
