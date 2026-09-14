import {Paths} from '@pages/Paths';
import {TestApp} from '@test-support/TestApp';
import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {AddressInfo, User} from '@components/Users/UserInfo/user';
import {createUser} from '@components/Users/resource/usersApi';
import {addressGroup} from '../UserInformation/__test_support';
import {
  addUser,
  addUserWhoWorksFromHome,
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

const conciseUser = (firstName: string): User & {work: AddressInfo} => {
  const homeAddress: AddressInfo = {
    streetAddress: '12 Elm St',
    city: 'Springfield',
    state: 'IL',
    zip: '62704'
  };
  return {
    ...createUser(),
    info: {
      firstName,
      lastName: 'Tester',
      email: `${firstName.toLowerCase()}@example.com`,
      dob: new Date(1984, 5, 2)
    },
    homeAddress,
    work: {
      streetAddress: '9 Oak Ave',
      city: 'Chatham',
      state: 'IL',
      zip: '62629'
    },
    details: 'short notes'
  };
};

describe('the users page', () => {
  describe('ranking the users', () => {
    it('sorting works-from-home ascending puts every No before every Yes', async () => {
      render(<TestApp at={Paths.users}/>);
      await roster();

      await sortWorksFromHome('ascending');

      expect(worksFromHomeColumn()).toContain('Yes');
      expect(worksFromHomeColumn()).toContain('No');
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
    it('a new user joins the roster, saying whether they work from home', async () => {
      const aUser = conciseUser('Aiko');
      const anotherUser = conciseUser('Bram');
      render(<TestApp at={Paths.users}/>);
      await roster();

      await addUserWhoWorksFromHome(aUser);
      await addUser(anotherUser);

      expect(worksFromHome(await rowOf(fullName(aUser)))).toBe('Yes');
      expect(worksFromHome(await rowOf(fullName(anotherUser)))).toBe('No');
    });

    it('editing a user who works from home finds Same as Home ticked', async () => {
      const homeWorker = conciseUser('Hana');
      render(<TestApp at={Paths.users}/>);
      await roster();
      await addUserWhoWorksFromHome(homeWorker);

      await edit(fullName(homeWorker));

      expect(screen.getByRole('checkbox', {name: 'Same as Home'})).toBeChecked();
    });

    it('a user born on a day shows that day when viewed', async () => {
      const born = conciseUser('Faye');
      render(<TestApp at={Paths.users}/>);
      await roster();
      await addUser(born);

      await view(fullName(born));

      expect(screen.getByLabelText('Date Of Birth')).toHaveDisplayValue('1984-06-02');
    });

    it('a user born on a day shows that day when edited', async () => {
      const born = conciseUser('Gabi');
      render(<TestApp at={Paths.users}/>);
      await roster();
      await addUser(born);

      await edit(fullName(born));

      expect(screen.getByLabelText('Date Of Birth')).toHaveDisplayValue('1984-06-02');
    });
  });

  describe('viewing a user', () => {
    let chosen = '';

    beforeEach(async () => {
      render(<TestApp at={Paths.users}/>);
      [chosen] = await roster();
      await view(chosen);
    });

    test('viewing a user shows their details in the form', () => {
      const [firstName] = chosen.split(' ');
      expect(screen.getByLabelText('First Name')).toHaveDisplayValue(firstName);
    });

    test('the form cannot be typed into', () => {
      expect(screen.getByLabelText('First Name')).toHaveAttribute('readonly');
    });

    test('the date of birth reads as text that cannot be changed', () => {
      expect(screen.getByLabelText('Date Of Birth')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('Date Of Birth')).toHaveAttribute('readonly');
    });

    test('the state reads as a field that cannot be chosen', () => {
      expect(addressGroup('home').getByRole('textbox', {name: 'State'})).toHaveAttribute('readonly');
    });

    test('the avatar cannot be rerolled', () => {
      expect(screen.getByRole('button', {name: 'Draw a new avatar'})).toBeDisabled();
    });

    it('viewing a user offers a door to add another', () => {
      expect(screen.getByRole('link', {name: 'Add New User'})).toBeInTheDocument();
    });

    it('viewing a user offers a door to edit them', () => {
      expect(within(screen.getByRole('form', {name: 'User Information'})).getByRole('link', {name: 'Edit'})).toBeInTheDocument();
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
      const form = screen.getByRole('form', {name: 'User Information'});
      expect(within(form).getByLabelText('First Name')).toHaveDisplayValue(firstName);
      expect(within(form).getByLabelText('Last Name')).toHaveDisplayValue(lastName);
    });

    test('the date of birth is picked from a date field', () => {
      expect(screen.getByLabelText('Date Of Birth')).toHaveAttribute('type', 'date');
    });

    test('the state is chosen from a list', () => {
      expect(addressGroup('home').getByRole('combobox', {name: 'State'})).toBeInTheDocument();
    });

    it('should be able to reset the form to the original information', async () => {
      const [firstName] = chosen.split(' ');
      const form = screen.getByRole('form', {name: 'User Information'});
      await userEvent.type(within(form).getByLabelText('First Name'), ' with more text');

      expect(within(form).getByLabelText('First Name')).toHaveDisplayValue(`${firstName} with more text`);

      await userEvent.click(within(form).getByRole('button', {name: 'Reset'}));

      expect(within(form).getByLabelText('First Name')).toHaveDisplayValue(firstName);
    });

    it('cancelling an edit returns to viewing the user', async () => {
      const form = screen.getByRole('form', {name: 'User Information'});
      await userEvent.click(within(form).getByRole('link', {name: 'Cancel'}));
      expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('mode=view');
    });
  });

  test('editing a user with a work address shows that address', async () => {
    const person = conciseUser('Ivo');
    render(<TestApp at={Paths.users}/>);
    await roster();
    await addUser(person);

    await edit(fullName(person));

    expect(addressGroup('work').getByLabelText('Street')).toHaveValue(person.work.streetAddress);
  });

  test('Update keeps the work address a user was added with', async () => {
    const person = conciseUser('Ysolde');
    render(<TestApp at={Paths.users}/>);
    await roster();
    await addUser(person);
    await edit(fullName(person));

    await userEvent.click(within(screen.getByRole('form', {name: 'User Information'})).getByRole('button', {name: 'Update'}));

    await view(fullName(person));
    expect(addressGroup('work').getByLabelText('Street')).toHaveValue(person.work.streetAddress);
  });

  test('an updated user shows their new name in the roster', async () => {
    const person = conciseUser('Cleo');
    render(<TestApp at={Paths.users}/>);
    await roster();
    await addUser(person);
    await edit(fullName(person));

    await userEvent.type(within(screen.getByRole('form', {name: 'User Information'})).getByLabelText('Last Name'), ' Jr');
    await userEvent.click(within(screen.getByRole('form', {name: 'User Information'})).getByRole('button', {name: 'Update'}));

    expect(await rowOf(`${fullName(person)} Jr`)).toBeInTheDocument();
  });

  test('a removed user leaves the roster', async () => {
    const person = conciseUser('Dev');
    render(<TestApp at={Paths.users}/>);
    await roster();
    await addUser(person);
    await rowOf(fullName(person));

    await remove(fullName(person));

    await waitFor(() => expect(names()).not.toContain(fullName(person)));
  });

  test('removing the chosen user clears them from the address', async () => {
    const person = conciseUser('Dana');
    render(<TestApp at={Paths.users}/>);
    await roster();
    await addUser(person);
    await view(fullName(person));
    await waitFor(() => expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('id='));

    await remove(fullName(person));

    await waitFor(() => expect(screen.getByRole('status', {name: 'url search'})).not.toHaveTextContent('id='));
  });

  test('a cloned user stands once more in the roster', async () => {
    const person = conciseUser('Eli');
    render(<TestApp at={Paths.users}/>);
    await roster();
    await addUser(person);
    await rowOf(fullName(person));
    const standing = names().filter(name => name === fullName(person)).length;
    await clone(fullName(person));

    await userEvent.click(within(screen.getByRole('form', {name: 'User Information'})).getByRole('button', {name: 'Add'}));

    await waitFor(() => expect(names().filter(name => name === fullName(person))).toHaveLength(standing + 1));
  });

  const befriend = async (row: HTMLElement, name: string): Promise<void> => {
    await userEvent.selectOptions(within(row).getByRole('combobox', {name: 'Add a friend'}), name);
    await within(row).findByRole('button', {name: `remove ${name}`});
  };

  test("removing a friend takes them off the row and hands focus to the next friend's remove button", async () => {
    const [mira, nils, osa] = [conciseUser('Mira'), conciseUser('Nils'), conciseUser('Osa')];
    render(<TestApp at={Paths.users}/>);
    await roster();
    await addUser(mira);
    await addUser(nils);
    await addUser(osa);
    const row = await rowOf(fullName(mira));
    await befriend(row, fullName(nils));
    await befriend(row, fullName(osa));

    await userEvent.click(within(row).getByRole('button', {name: `remove ${fullName(nils)}`}));

    await waitFor(() => expect(within(row).queryByRole('button', {name: `remove ${fullName(nils)}`})).not.toBeInTheDocument());
    expect(within(row).getByRole('button', {name: `remove ${fullName(osa)}`})).toHaveFocus();
    expect(within(row).getByRole('status', {name: 'friends report'})).toHaveTextContent(`${fullName(nils)} removed.`);
  });

  test("removing the only friend from a person's row hands focus to that row's Add a friend", async () => {
    const [pia, quin] = [conciseUser('Pia'), conciseUser('Quin')];
    render(<TestApp at={Paths.users}/>);
    await roster();
    await addUser(pia);
    await addUser(quin);
    await befriend(await rowOf(fullName(pia)), fullName(quin));
    const quinsRow = await rowOf(fullName(quin));
    await within(quinsRow).findByRole('button', {name: `remove ${fullName(pia)}`});

    await userEvent.click(within(quinsRow).getByRole('button', {name: `remove ${fullName(pia)}`}));

    await waitFor(() => expect(within(quinsRow).queryByRole('button', {name: `remove ${fullName(pia)}`})).not.toBeInTheDocument());
    expect(within(quinsRow).getByRole('combobox', {name: 'Add a friend'})).toHaveFocus();
  });

  test('focus is not pulled back to a settled removal when the roster renders again', async () => {
    const [rae, sol, tam] = [conciseUser('Rae'), conciseUser('Sol'), conciseUser('Tam')];
    render(<TestApp at={Paths.users}/>);
    await roster();
    await addUser(rae);
    await addUser(sol);
    await addUser(tam);
    const raesRow = await rowOf(fullName(rae));
    await befriend(raesRow, fullName(sol));
    await userEvent.click(within(raesRow).getByRole('button', {name: `remove ${fullName(sol)}`}));
    await waitFor(() => expect(within(raesRow).getByRole('combobox', {name: 'Add a friend'})).toHaveFocus());
    await edit(fullName(tam));

    await userEvent.click(within(screen.getByRole('form', {name: 'User Information'})).getByRole('button', {name: 'Update'}));

    await view(fullName(tam));
    expect(within(raesRow).getByRole('combobox', {name: 'Add a friend'})).not.toHaveFocus();
  });
});
