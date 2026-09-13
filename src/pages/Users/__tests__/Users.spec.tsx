import {Paths} from '@pages/Paths';
import {TestApp} from '@test-support/TestApp';
import {render, screen, waitFor, within} from '@testing-library/react';
import {format} from 'date-fns';
import {users as someUsers} from '@test-support/fixtures';
import userEvent from '@testing-library/user-event';
import {AddressInfo, User} from '@components/Users/UserInfo/types';
import {createUser, usersApi} from '@components/Users/resource/usersApi';
import {users} from '@components/Users/resource/users';
import {
  clone,
  edit,
  fullName,
  remove,
  rowOf,
  rows,
  sortWorksFromHome,
  view,
  worksFromHome,
  worksFromHomeColumn
} from '../__test_support/table';

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
    const tableStands = async () => {
      render(<TestApp at={Paths.users}/>);
      await waitFor(() => expect(rows().length).toBeGreaterThan(1));
    };

    it('groups by a column menu criterion', async () => {
      await tableStands();

      await sortWorksFromHome('ascending');

      expect(worksFromHomeColumn()).toEqual([...worksFromHomeColumn()].sort((left, right) => left.localeCompare(right)));
    });

    it('every row can be lifted by its grip', async () => {
      await tableStands();

      expect(screen.getAllByRole('button', {name: /move row/}).length).toBeGreaterThan(0);
    });

    it('a column is resized from one handle', async () => {
      await tableStands();

      expect(screen.getAllByRole('button', {name: /resize home-city/}).length).toBe(1);
    });

    it('a column offers a sort menu only where ranking means something', async () => {
      await tableStands();

      expect(screen.getByRole('button', {name: 'sort age'})).toBeVisible();
      expect(screen.queryByRole('button', {name: 'sort full-name'})).toBeNull();
      expect(screen.queryByRole('button', {name: 'sort home-city'})).toBeNull();
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
      render(<TestApp at={Paths.users}/>);
      await addUser(aUser);
      await addUser(anotherUser);
    });

    it('should display the new user', async () => {
      expect(await rowOf(fullName(aUser))).toBeInTheDocument();
    });

    it('should indicate a user works from home when there work and home address match', async () => {
      expect(worksFromHome(await rowOf(fullName(anotherUser)))).toBe('No');
      expect(worksFromHome(await rowOf(fullName(aUser)))).toBe('Yes');
    });
  });

  describe('viewing a user', () => {
    beforeEach(async () => {
      render(<TestApp at={Paths.users}/>);
      await view(fullName(firstUser));
    });

    test('populating the form with the chosen user', () => {
      expect(screen.getByLabelText('First Name')).toHaveDisplayValue(firstUser.info.firstName);
    });

    test('the form cannot be typed into', () => {
      expect(screen.getByLabelText('First Name')).toHaveAttribute('readonly');
    });

    test('the avatar cannot be rerolled', () => {
      expect(screen.getByRole('button', {name: 'Generate a new avatar'})).toBeDisabled();
    });

    it('should be able to add a user', () => {
      expect(screen.getByRole('link', {name: 'Add New User'})).toBeInTheDocument();
    });

    it('should be able to edit', () => {
      expect(within(screen.getByRole('form', {name: 'user info'})).getByRole('link', {name: 'Edit'})).toBeInTheDocument();
    });
  });

  describe('editing a user', () => {
    beforeEach(async () => {
      render(<TestApp at={Paths.users}/>);
      await edit(fullName(firstUser));
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

      await userEvent.click(within(form).getByRole('button', {name: 'Reset'}));

      expect(within(form).getByLabelText('First Name'))
        .toHaveDisplayValue(`${firstUser.info.firstName}`);
    });

    it('should be able to cancel the form to the original information', async () => {
      const form = screen.getByRole('form', {name: 'user info'});
      await userEvent.click(within(form).getByRole('link', {name: 'Cancel'}));
      expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(`id=${firstUser.id}&mode=view`);
    });
  });

  test('updating a user', async () => {
    const spy = vi.spyOn(users, 'update');

    render(<TestApp at={Paths.users}/>);

    await edit(fullName(firstUser));

    await userEvent.click(await within(screen.getByRole('form', {name: 'user info'})).findByRole('button', {name: 'Update'}));

    expect(spy).toHaveBeenCalled();
  });

  test('removing a user', async () => {
    const spy = vi.spyOn(users, 'delete');

    render(<TestApp at={Paths.users}/>);

    await remove(fullName(firstUser));

    expect(spy).toHaveBeenCalledWith(firstUser);
    await waitFor(() => expect(screen.getByRole('status', {name: 'url search'})).not.toHaveTextContent('id='));
  });

  test('cloning a user', async () => {
    const spy = vi.spyOn(users, 'add');
    render(<TestApp at={Paths.users}/>);

    await clone(fullName(firstUser));

    await userEvent.click(await within(screen.getByRole('form', {name: 'user info'})).findByRole('button', {name: 'Add'}));

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

  await userEvent.click(await screen.findByRole('button', {name: 'Add'}));
};

const addAddress = async (address: AddressInfo, element: HTMLElement) => {
  await userEvent.type(within(element).getByLabelText('Street'), address.streetAddress);
  await userEvent.type(within(element).getByLabelText('Street Line 2'), address.streetAddressTwo || '');
  await userEvent.type(within(element).getByLabelText('City'), address.city);
  await userEvent.selectOptions(within(element).getByLabelText('State'), [address.state]);
  await userEvent.type(within(element).getByLabelText('Postal / Zip code'), address.zip);
};
