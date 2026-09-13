import {Paths} from '@pages/Paths';
import {TestApp} from '@test-support/TestApp';
import {render, screen, waitFor, within} from '@testing-library/react';
import {format} from 'date-fns';
import userEvent from '@testing-library/user-event';
import {AddressInfo, User} from '@components/Users/UserInfo/types';
import {createUser} from '@components/Users/resource/usersApi';
import {
  clone,
  edit,
  fullName,
  names,
  remove,
  roster,
  rowOf,
  sortWorksFromHome,
  view,
  worksFromHome,
  worksFromHomeColumn
} from '../__test_support';

describe('the users page', () => {
  describe('ranking the users', () => {
    it('groups by a column menu criterion', async () => {
      render(<TestApp at={Paths.users}/>);
      await roster();

      await sortWorksFromHome('ascending');

      expect(worksFromHomeColumn()).toEqual([...worksFromHomeColumn()].sort((left, right) => left.localeCompare(right)));
    });

    it('every row can be lifted by its grip', async () => {
      render(<TestApp at={Paths.users}/>);
      const people = await roster();

      expect(screen.getAllByRole('button', {name: /move row/})).toHaveLength(people.length);
    });

    it('a column is resized from one handle', async () => {
      render(<TestApp at={Paths.users}/>);
      await roster();

      expect(screen.getAllByRole('button', {name: /resize home-city/})).toHaveLength(1);
    });

    it('a column offers a sort menu only where ranking means something', async () => {
      render(<TestApp at={Paths.users}/>);
      await roster();

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

    it('a new user joins the roster, saying whether they work from home', async () => {
      const aUser = conciseUser('Aiko', true);
      const anotherUser = conciseUser('Bram', false);
      render(<TestApp at={Paths.users}/>);
      await roster();

      await addUser(aUser);
      await addUser(anotherUser);

      expect(worksFromHome(await rowOf(fullName(aUser)))).toBe('Yes');
      expect(worksFromHome(await rowOf(fullName(anotherUser)))).toBe('No');
    });
  });

  describe('viewing a user', () => {
    let chosen = '';

    beforeEach(async () => {
      render(<TestApp at={Paths.users}/>);
      [chosen] = await roster();
      await view(chosen);
    });

    test('populating the form with the chosen user', () => {
      const [firstName] = chosen.split(' ');
      expect(screen.getByLabelText('First Name')).toHaveDisplayValue(firstName);
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
    let chosen = '';

    beforeEach(async () => {
      render(<TestApp at={Paths.users}/>);
      [chosen] = await roster();
      await edit(chosen);
    });

    it('should populate the form', () => {
      const [firstName, lastName] = chosen.split(' ');
      const form = screen.getByRole('form', {name: 'user info'});
      expect(within(form).getByLabelText('First Name')).toHaveDisplayValue(firstName);
      expect(within(form).getByLabelText('Last Name')).toHaveDisplayValue(lastName);
    });

    it('should be able to reset the form to the original information', async () => {
      const [firstName] = chosen.split(' ');
      const form = screen.getByRole('form', {name: 'user info'});
      await userEvent.type(within(form).getByLabelText('First Name'), ' with more text');

      expect(within(form).getByLabelText('First Name')).toHaveDisplayValue(`${firstName} with more text`);

      await userEvent.click(within(form).getByRole('button', {name: 'Reset'}));

      expect(within(form).getByLabelText('First Name')).toHaveDisplayValue(firstName);
    });

    it('should be able to cancel the form to the original information', async () => {
      const form = screen.getByRole('form', {name: 'user info'});
      await userEvent.click(within(form).getByRole('link', {name: 'Cancel'}));
      expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('mode=view');
    });
  });

  test('an updated user shows their new name in the roster', async () => {
    render(<TestApp at={Paths.users}/>);
    const [chosen] = await roster();
    await edit(chosen);

    await userEvent.type(within(screen.getByRole('form', {name: 'user info'})).getByLabelText('Last Name'), ' Jr');
    await userEvent.click(within(screen.getByRole('form', {name: 'user info'})).getByRole('button', {name: 'Update'}));

    expect(await rowOf(`${chosen} Jr`)).toBeInTheDocument();
  });

  test('a removed user leaves the roster', async () => {
    render(<TestApp at={Paths.users}/>);
    const [chosen] = await roster();

    await remove(chosen);

    await waitFor(() => expect(names()).not.toContain(chosen));
    expect(screen.getByRole('status', {name: 'url search'})).not.toHaveTextContent('id=');
  });

  test('a cloned user stands twice in the roster', async () => {
    render(<TestApp at={Paths.users}/>);
    const [chosen] = await roster();
    await clone(chosen);

    await userEvent.click(within(screen.getByRole('form', {name: 'user info'})).getByRole('button', {name: 'Add'}));

    await waitFor(() => expect(names().filter(name => name === chosen)).toHaveLength(2));
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
