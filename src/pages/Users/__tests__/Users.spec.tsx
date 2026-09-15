import {Paths} from '@pages/Paths';
import {TestApp} from '@__test_support/TestApp';
import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createSearchParams} from 'react-router';
import {fullNameOf} from '@components/Users/UserInfo/user';
import {
  anAddress,
  aUser,
  setupUserAddedResponse,
  setupUserRemovedResponse,
  setupUsersResponse,
  setupUserUpdatedResponse
} from '@components/Users/__test_support';
import {userForm} from '../UserInformation/__test_support';
import {usersTable} from '../__test_support';
import {userAt} from '../mode';

describe('the users page', () => {
  describe('ranking the users', () => {
    it('sorting works-from-home ascending puts every No before every Yes', async () => {
      setupUsersResponse([aUser(), aUser({work: 'home'}), aUser(), aUser({work: 'home'})]);
      render(<TestApp at={Paths.users}/>);
      await usersTable.roster();

      await usersTable.sortWorksFromHome('ascending');

      expect(usersTable.worksFromHomeColumn()).toContain('Yes');
      expect(usersTable.worksFromHomeColumn()).toContain('No');
      expect(usersTable.worksFromHomeColumn()).toEqual([...usersTable.worksFromHomeColumn()].sort((left, right) => left.localeCompare(right)));
    });

    it('every row can be lifted by its grip', async () => {
      setupUsersResponse([aUser(), aUser(), aUser()]);
      render(<TestApp at={Paths.users}/>);
      await usersTable.roster();

      expect(usersTable.grips()).toHaveLength(3);
    });

    it('a column is resized from one handle', async () => {
      setupUsersResponse([aUser()]);
      render(<TestApp at={Paths.users}/>);
      await usersTable.roster();

      expect(usersTable.resizeHandles('home-city')).toHaveLength(1);
    });

    it('a column offers a sort menu only where ranking means something', async () => {
      setupUsersResponse([aUser()]);
      render(<TestApp at={Paths.users}/>);
      await usersTable.roster();

      expect(usersTable.sortMenu('age')).toBeVisible();
      expect(usersTable.sortMenu('full-name')).toBeNull();
      expect(usersTable.sortMenu('home-city')).toBeNull();
      expect(usersTable.sortMenu('friends')).toBeNull();
    });
  });

  describe('adding a user', () => {
    it('adding a user who works from home sends the backend home as their work', async () => {
      const aiko = aUser({work: 'home'});
      setupUsersResponse([aUser()]);
      const sent = setupUserAddedResponse([]);
      render(<TestApp at={Paths.users}/>);

      await userForm.addWhoWorksFromHome(aiko);

      await waitFor(() => expect(sent()).toMatchObject({work: 'home'}));
    });

    it('editing a user who works from home finds Same as Home ticked', async () => {
      const hana = aUser({work: 'home'});
      setupUsersResponse([hana]);

      render(<TestApp at={userAt(hana.id, 'edit')}/>);
      await userForm.showing(hana);

      expect(userForm.sameAsHome()).toBeChecked();
    });

    it('a user born on a day shows that day when viewed', async () => {
      const born = aUser({dob: new Date(1984, 5, 2)});
      setupUsersResponse([born]);

      render(<TestApp at={userAt(born.id, 'view')}/>);
      await userForm.showing(born);

      expect(userForm.field('Date Of Birth')).toHaveDisplayValue('1984-06-02');
    });

    it('a user born on a day shows that day when edited', async () => {
      const born = aUser({dob: new Date(1984, 5, 2)});
      setupUsersResponse([born]);

      render(<TestApp at={userAt(born.id, 'edit')}/>);
      await userForm.showing(born);

      expect(userForm.field('Date Of Birth')).toHaveDisplayValue('1984-06-02');
    });
  });

  describe('viewing a user', () => {
    const jo = aUser();

    beforeEach(async () => {
      setupUsersResponse([jo]);
      render(<TestApp at={userAt(jo.id, 'view')}/>);
      await userForm.showing(jo);
    });

    test('viewing a user shows their details in the form', () => {
      expect(userForm.field('Last Name')).toHaveDisplayValue(jo.info.lastName);
    });

    test('the form cannot be typed into', () => {
      expect(userForm.field('First Name')).toHaveAttribute('readonly');
    });

    test('the date of birth reads as text that cannot be changed', () => {
      expect(userForm.field('Date Of Birth')).toHaveAttribute('type', 'text');
      expect(userForm.field('Date Of Birth')).toHaveAttribute('readonly');
    });

    test('the state reads as a field that cannot be chosen', () => {
      expect(userForm.address('home').getByRole('textbox', {name: 'State'})).toHaveAttribute('readonly');
    });

    test('the avatar cannot be rerolled', () => {
      expect(userForm.avatar()).toBeDisabled();
    });

    it('viewing a user offers a door to add another', () => {
      expect(usersTable.addNewUser()).toBeInTheDocument();
    });

    it('viewing a user offers a door to edit them', () => {
      expect(userForm.editLink()).toBeInTheDocument();
    });
  });

  describe('editing a user', () => {
    const kai = aUser();

    beforeEach(async () => {
      setupUsersResponse([kai]);
      render(<TestApp at={userAt(kai.id, 'edit')}/>);
      await userForm.showing(kai);
    });

    it('should populate the form', () => {
      expect(userForm.field('First Name')).toHaveDisplayValue(kai.info.firstName);
      expect(userForm.field('Last Name')).toHaveDisplayValue(kai.info.lastName);
    });

    test('the date of birth is picked from a date field', () => {
      expect(userForm.field('Date Of Birth')).toHaveAttribute('type', 'date');
    });

    test('the state is chosen from a list', () => {
      expect(userForm.address('home').getByRole('combobox', {name: 'State'})).toBeInTheDocument();
    });

    it('should be able to reset the form to the original information', async () => {
      await userForm.typeInto('First Name', ' with more text');

      expect(userForm.field('First Name')).toHaveDisplayValue(`${kai.info.firstName} with more text`);

      await userForm.reset();

      expect(userForm.field('First Name')).toHaveDisplayValue(kai.info.firstName);
    });

    it('cancelling an edit returns to viewing the user', async () => {
      await userForm.cancel();
      expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('mode=view');
    });
  });

  test('editing a user with a work address shows that address', async () => {
    const work = anAddress();
    const person = aUser({work});
    setupUsersResponse([person]);

    render(<TestApp at={userAt(person.id, 'edit')}/>);
    await userForm.showing(person);

    expect(userForm.address('work').getByLabelText('Street')).toHaveValue(work.streetAddress);
  });

  test('Update sends the backend the work address the user already had', async () => {
    const work = anAddress();
    const person = aUser({work});
    setupUsersResponse([person]);
    const sent = setupUserUpdatedResponse(person.id, [person]);
    render(<TestApp at={userAt(person.id, 'edit')}/>);
    await userForm.showing(person);

    await userForm.update();

    await waitFor(() => expect(sent()).toMatchObject({work}));
  });

  test('an updated user shows their new name in the roster', async () => {
    const person = aUser();
    setupUsersResponse([person]);
    setupUserUpdatedResponse(person.id, [{...person, info: {...person.info, lastName: `${person.info.lastName} Jr`}}]);
    render(<TestApp at={userAt(person.id, 'edit')}/>);
    await userForm.showing(person);

    await userForm.typeInto('Last Name', ' Jr');
    await userForm.update();

    expect(await usersTable.rowOf(`${fullNameOf(person)} Jr`)).toBeInTheDocument();
  });

  test('a removed user leaves the roster', async () => {
    const person = aUser();
    setupUsersResponse([person]);
    setupUserRemovedResponse(person.id, []);
    render(<TestApp at={Paths.users}/>);

    await usersTable.remove(fullNameOf(person));

    await waitFor(() => expect(usersTable.names()).not.toContain(fullNameOf(person)));
  });

  test('removing the chosen user clears them from the address', async () => {
    const person = aUser();
    setupUsersResponse([person]);
    setupUserRemovedResponse(person.id, []);
    render(<TestApp at={userAt(person.id, 'view')}/>);
    await userForm.showing(person);

    await usersTable.remove(fullNameOf(person));

    await waitFor(() => expect(screen.getByRole('status', {name: 'url search'})).not.toHaveTextContent('id='));
  });

  test('a cloned user stands once more in the roster', async () => {
    const person = aUser();
    setupUsersResponse([person]);
    setupUserAddedResponse([{...person, id: 'the clone'}, person]);
    render(<TestApp at={`${Paths.users}?${createSearchParams({id: person.id})}`}/>);
    await userForm.showing(person);

    await userForm.add();

    await waitFor(() => expect(usersTable.names().filter(name => name === fullNameOf(person))).toHaveLength(2));
  });

  test("removing the only friend from a person's row hands focus to that row's Add a friend", async () => {
    const pia = aUser({id: 'pia', friends: ['quin']});
    const quin = aUser({id: 'quin', friends: ['pia']});
    setupUsersResponse([pia, quin]);
    setupUserUpdatedResponse(quin.id, [{...pia, friends: []}, {...quin, friends: []}]);
    render(<TestApp at={Paths.users}/>);
    const quinsRow = await usersTable.rowOf(fullNameOf(quin));

    await userEvent.click(within(quinsRow).getByRole('button', {name: `remove ${fullNameOf(pia)}`}));

    await waitFor(() => expect(within(quinsRow).queryByRole('button', {name: `remove ${fullNameOf(pia)}`})).not.toBeInTheDocument());
    expect(within(quinsRow).getByRole('combobox', {name: 'Add a friend'})).toHaveFocus();
  });

  test('focus is not pulled back to a settled removal when the roster renders again', async () => {
    const rae = aUser({id: 'rae', friends: ['sol']});
    const sol = aUser({id: 'sol', friends: ['rae']});
    const unfriended = [{...rae, friends: []}, {...sol, friends: []}];
    setupUsersResponse([rae, sol]);
    setupUserUpdatedResponse(rae.id, unfriended);
    setupUserUpdatedResponse(sol.id, unfriended);
    render(<TestApp at={Paths.users}/>);
    const raesRow = await usersTable.rowOf(fullNameOf(rae));
    await userEvent.click(within(raesRow).getByRole('button', {name: `remove ${fullNameOf(sol)}`}));
    await waitFor(() => expect(within(raesRow).getByRole('combobox', {name: 'Add a friend'})).toHaveFocus());
    await usersTable.edit(fullNameOf(sol));

    await userForm.update();

    await waitFor(() => expect(screen.getByRole('status', {name: 'url search'})).not.toHaveTextContent('mode='));
    expect(within(raesRow).getByRole('combobox', {name: 'Add a friend'})).not.toHaveFocus();
  });
});
