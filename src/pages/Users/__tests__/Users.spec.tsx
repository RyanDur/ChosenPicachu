import {Paths} from '@navigation';
import {TestApp} from '@__test_support/TestApp';
import {site} from '@pages/__test_support';
import {appAddress} from '@__test_support/address';
import {heldClock} from '@__test_support/heldClock';
import {render, waitFor} from '@testing-library/react';
import {createSearchParams} from 'react-router';
import {profile} from '../profile';
import {
  anAddress,
  aUser,
  setupUserAddedResponse,
  setupUserRemovedResponse,
  setupUsersAnswering,
  setupUsersResponse,
  setupUserUpdatedResponse,
  userAddRefused,
  userAddsHeard,
  userAddsHeld,
  userRemovalRefused,
  userUpdateRefused,
  usersUnreachable,
  lentToThePage,
  noWorkersOnThePage,
  rosterAsksHeard,
  rosterRefused,
  workersContainer
} from '@pages/Users/__test_support';
import {userForm} from '../UserInformation/__test_support';
import {friendsList} from '../FriendsList/__test_support';
import {usersPage, usersTable} from '../__test_support';
import {openings} from '../openings';

describe('the users page', () => {
  test('a users backend that cannot be reached says so', async () => {
    usersUnreachable();

    render(<TestApp at={Paths.users}/>);

    expect(await usersPage.says('the users server could not be reached')).toBeInTheDocument();
  });

  test('the roster is asked for only once the users server takes control of the page', async () => {
    const container = workersContainer();
    lentToThePage(container);
    const asks = rosterAsksHeard([aUser()], container.controlled);
    render(<TestApp at={Paths.users}/>);
    await waitFor(() => expect(container.registered()).toBe(1));

    container.takeControl();
    await usersTable.roster();

    expect(asks()).toEqual([true]);
  });

  test('a users server that takes control after the wait takes down the could-not-be-reached banner', async () => {
    heldClock.hold();
    onTestFinished(() => {
      vi.useRealTimers();
    });
    const container = workersContainer();
    lentToThePage(container);
    setupUsersResponse([aUser()]);
    render(<TestApp at={Paths.users}/>);
    await usersPage.waitsOut(10_000);
    await usersPage.says('the users server could not be reached');

    container.takeControl();
    await usersTable.roster();

    expect(usersPage.alertIfAny()).not.toBeInTheDocument();
  });

  test('a reader who leaves while the server is unreachable finds no such banner on coming back to it in control', async () => {
    heldClock.hold();
    onTestFinished(() => {
      vi.useRealTimers();
    });
    const container = workersContainer();
    lentToThePage(container);
    setupUsersResponse([aUser()]);
    render(<TestApp at={Paths.users}/>);
    await usersPage.waitsOut(10_000);
    await usersPage.says('the users server could not be reached');
    await site.followRail('Practice');
    container.takeControl();

    await site.followRail('Users');
    await usersTable.roster();

    expect(usersPage.alertIfAny()).not.toBeInTheDocument();
  });

  test('a browser without service workers says the users server could not be reached, and Add waits', async () => {
    noWorkersOnThePage();
    setupUsersResponse([aUser()]);

    render(<TestApp at={Paths.users}/>);

    expect(await usersPage.says('the users server could not be reached')).toBeInTheDocument();
    expect(userForm.addButton()).toHaveAttribute('aria-disabled', 'true');
  });

  test('a request that could not reach the server leaves no such banner once the server takes control', async () => {
    heldClock.hold();
    onTestFinished(() => {
      vi.useRealTimers();
    });
    usersUnreachable();
    render(<TestApp at={Paths.users}/>);
    await usersPage.says('the users server could not be reached');
    await site.followRail('Practice');
    const container = workersContainer();
    lentToThePage(container);
    setupUsersResponse([aUser()]);
    await site.followRail('Users');
    await usersPage.waitsOut(10_000);

    container.takeControl();
    await usersTable.roster();

    expect(usersPage.alertIfAny()).not.toBeInTheDocument();
  });

  test('a users server that cannot take control of the page says it could not be reached', async () => {
    lentToThePage(workersContainer({registering: Promise.reject(new Error('refused'))}));
    setupUsersResponse([aUser()]);

    render(<TestApp at={Paths.users}/>);

    expect(await usersPage.says('the users server could not be reached')).toBeInTheDocument();
  });

  describe('ranking the users', () => {
    it('the roster is a named table in a named region', async () => {
      setupUsersResponse([aUser()]);
      render(<TestApp at={Paths.users}/>);
      await usersTable.roster();

      expect(usersTable.titled('User candidates')).toBeInTheDocument();
      expect(usersPage.region('User Candidates')).toBeInTheDocument();
    });

    it('a person without a birthday shows no age', async () => {
      const ageless = aUser();
      setupUsersResponse([{...ageless, person: {...ageless.person, dateOfBirth: undefined}}]);
      render(<TestApp at={Paths.users}/>);

      expect(await usersTable.rowOf(profile.fullName(ageless))).not.toHaveTextContent(/old/);
    });

    it('a birthday the backend cannot spell shows no age', async () => {
      const user = aUser();
      setupUsersAnswering([{...user, person: {...user.person, dateOfBirth: 'yesterday'}}]);
      render(<TestApp at={Paths.users}/>);

      expect(await usersTable.rowOf(profile.fullName(user))).not.toHaveTextContent(/old/);
    });

    it('sorting works-from-home ascending puts every No before every Yes', async () => {
      setupUsersResponse([aUser(), aUser({work: 'home'}), aUser(), aUser({work: 'home'})]);
      render(<TestApp at={Paths.users}/>);
      await usersTable.roster();

      await usersTable.sortWorksFromHome('ascending');

      expect(usersTable.worksFromHomeColumn()).toContain('Yes');
      expect(usersTable.worksFromHomeColumn()).toContain('No');
      expect(usersTable.worksFromHomeColumn())
        .toEqual([...usersTable.worksFromHomeColumn()].sort((left, right) => left.localeCompare(right)));
    });

    it('every row can be lifted by its grip', async () => {
      setupUsersResponse([aUser(), aUser(), aUser()]);
      render(<TestApp at={Paths.users}/>);
      await usersTable.roster();

      expect(usersTable.grips()).toHaveLength(3);
    });

    it('a person moved down a row is said by name', async () => {
      const kai = aUser();
      setupUsersResponse([kai, aUser(), aUser()]);
      render(<TestApp at={Paths.users}/>);
      await usersTable.roster();

      await usersTable.moveByKey(profile.fullName(kai), '{ArrowDown}');

      expect(usersTable.moveReport()).toHaveTextContent(`${profile.fullName(kai)} moved to 2 of 3`);
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
      expect(usersTable.sortMenu('full-name')).not.toBeInTheDocument();
      expect(usersTable.sortMenu('home-city')).not.toBeInTheDocument();
      expect(usersTable.sortMenu('friends')).not.toBeInTheDocument();
    });
  });

  describe('adding a user', () => {
    it('Add says it cannot save yet while the roster has not arrived', async () => {
      const container = workersContainer();
      lentToThePage(container);
      setupUsersResponse([aUser()]);

      render(<TestApp at={Paths.users}/>);
      await waitFor(() => expect(container.registered()).toBe(1));

      expect(userForm.addButton()).toHaveAttribute('aria-disabled', 'true');
    });

    it('an Add pressed before the roster arrives sends nothing', async () => {
      const container = workersContainer();
      lentToThePage(container);
      setupUsersResponse([aUser()]);
      const adds = userAddsHeard();
      render(<TestApp at={Paths.users}/>);
      await waitFor(() => expect(container.registered()).toBe(1));
      await userForm.addWhoWorksFromHome(aUser({work: 'home'}));

      container.takeControl();
      await usersTable.roster();

      expect(adds()).toEqual([]);
    });

    it('an Add pressed after the roster was refused is sent', async () => {
      rosterRefused();
      const adds = userAddsHeard();
      render(<TestApp at={Paths.users}/>);
      await usersPage.says('the users server is having trouble');

      await userForm.addWhoWorksFromHome(aUser({work: 'home'}));

      await waitFor(() => expect(adds()).toHaveLength(1));
    });

    it('an edit address for someone not in the roster opens the form to add, not to update', async () => {
      setupUsersResponse([aUser()]);

      render(<TestApp at={openings.at('nobody', 'edit')}/>);
      await usersTable.roster();

      expect(userForm.addButton()).toBeVisible();
      expect(userForm.updateButtonIfAny()).not.toBeInTheDocument();
    });

    it('Clone opens the form to add a copy of the person', async () => {
      const kai = aUser();
      setupUsersResponse([kai]);
      render(<TestApp at={Paths.users}/>);
      await usersTable.roster();

      await usersTable.clone(profile.fullName(kai));

      expect(userForm.addButton()).toBeVisible();
      expect(userForm.field('First Name')).toHaveDisplayValue(kai.person.firstName);
    });

    it('adding a user who works from home sends the backend home as their work', async () => {
      const aiko = aUser({work: 'home'});
      setupUsersResponse([aUser()]);
      const sent = setupUserAddedResponse([]);
      render(<TestApp at={Paths.users}/>);

      await userForm.addWhoWorksFromHome(aiko);

      await waitFor(() => expect(sent()).toMatchObject({work: 'home'}));
    });

    it('a person the backend cannot take says so, and the roster stands', async () => {
      const standing = aUser();
      setupUsersResponse([standing]);
      userAddRefused();
      render(<TestApp at={Paths.users}/>);
      await usersTable.roster();

      await userForm.addWhoWorksFromHome(aUser({work: 'home'}));

      expect(await usersPage.says('the users server is having trouble')).toBeInTheDocument();
      expect(usersTable.names()).toEqual([profile.fullName(standing)]);
    });

    it('a refused add keeps what the reader typed', async () => {
      const aiko = aUser({work: 'home'});
      setupUsersResponse([aUser()]);
      userAddRefused();
      render(<TestApp at={Paths.users}/>);
      await usersTable.roster();

      await userForm.addWhoWorksFromHome(aiko);

      expect(await usersPage.says('the users server is having trouble')).toBeInTheDocument();
      expect(userForm.field('First Name')).toHaveDisplayValue(aiko.person.firstName);
    });

    it('after a refused add, Add sends the user again', async () => {
      const aiko = aUser({work: 'home'});
      setupUsersResponse([]);
      userAddRefused();
      render(<TestApp at={Paths.users}/>);
      await userForm.addWhoWorksFromHome(aiko);
      await usersPage.says('the users server is having trouble');
      setupUserAddedResponse([aiko]);

      await userForm.add();

      expect(await usersTable.rowOf(profile.fullName(aiko))).toBeInTheDocument();
    });

    it('an edit under way survives another user\'s confirmed add', async () => {
      const kai = aUser();
      const aiko = aUser({work: 'home'});
      setupUsersResponse([kai]);
      const adds = userAddsHeld([kai, aiko]);
      render(<TestApp at={Paths.users}/>);
      await userForm.addWhoWorksFromHome(aiko);
      await usersTable.edit(profile.fullName(kai));
      await userForm.showing(kai);
      await userForm.typeInto('First Name', ' typed');

      adds.answer();

      await usersTable.rowOf(profile.fullName(aiko));
      expect(userForm.field('First Name')).toHaveDisplayValue(`${kai.person.firstName} typed`);
    });

    it('a clone under way survives another user\'s confirmed add', async () => {
      const kai = aUser();
      const aiko = aUser({work: 'home'});
      setupUsersResponse([kai]);
      const adds = userAddsHeld([kai, aiko]);
      render(<TestApp at={Paths.users}/>);
      await userForm.addWhoWorksFromHome(aiko);
      await usersTable.clone(profile.fullName(kai));
      await userForm.showing(kai);
      await userForm.typeInto('First Name', ' typed');

      adds.answer();

      await usersTable.rowOf(profile.fullName(aiko));
      expect(userForm.field('First Name')).toHaveDisplayValue(`${kai.person.firstName} typed`);
    });

    it('a clone added while another add is in flight keeps what the reader typed', async () => {
      const kai = aUser();
      const aiko = aUser({work: 'home'});
      setupUsersResponse([kai]);
      const adds = userAddsHeld([kai, aiko]);
      render(<TestApp at={Paths.users}/>);
      await userForm.addWhoWorksFromHome(aiko);
      await usersTable.clone(profile.fullName(kai));
      await userForm.showing(kai);
      await userForm.typeInto('First Name', ' typed');
      await userForm.add();

      adds.answer();

      await usersTable.rowOf(profile.fullName(aiko));
      expect(userForm.field('First Name')).toHaveDisplayValue(`${kai.person.firstName} typed`);
    });

    it('a reader who follows the Users link while adding keeps what they typed', async () => {
      setupUsersResponse([aUser()]);
      render(<TestApp at={Paths.users}/>);
      await usersTable.roster();
      await userForm.typeInto('First Name', 'Aiko');

      await site.followRail('Users');

      expect(userForm.field('First Name')).toHaveDisplayValue('Aiko');
    });
  });

  describe('viewing a user', () => {
    const jo = aUser({dateOfBirth: new Date(1984, 5, 2)});

    beforeEach(async () => {
      setupUsersResponse([jo]);
      render(<TestApp at={openings.at(jo.id, 'view')}/>);
      await userForm.showing(jo);
    });

    test('viewing a user shows their details in the form', () => {
      expect(userForm.field('Last Name')).toHaveDisplayValue(jo.person.lastName);
    });

    test('a user born on a day shows that day', () => {
      expect(userForm.field('Date Of Birth')).toHaveDisplayValue('1984-06-02');
    });

    test('the form cannot be typed into', () => {
      expect(userForm.field('First Name')).toHaveAttribute('readonly');
    });

    test('the date of birth reads as text that cannot be changed', () => {
      expect(userForm.field('Date Of Birth')).toHaveAttribute('type', 'text');
      expect(userForm.field('Date Of Birth')).toHaveAttribute('readonly');
    });

    test('the state reads as a field that cannot be chosen', () => {
      expect(userForm.addressField('home', 'State')).toHaveRole('textbox');
      expect(userForm.addressField('home', 'State')).toHaveAttribute('readonly');
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
    const kai = aUser({work: 'home', dateOfBirth: new Date(1984, 5, 2)});

    beforeEach(async () => {
      setupUsersResponse([kai]);
      render(<TestApp at={openings.at(kai.id, 'edit')}/>);
      await userForm.showing(kai);
    });

    it('should populate the form', () => {
      expect(userForm.field('First Name')).toHaveDisplayValue(kai.person.firstName);
      expect(userForm.field('Last Name')).toHaveDisplayValue(kai.person.lastName);
    });

    test('editing a user offers no door to add another', () => {
      expect(usersTable.addNewUserIfAny()).not.toBeInTheDocument();
    });

    test('the date of birth is picked from a date field', () => {
      expect(userForm.field('Date Of Birth')).toHaveAttribute('type', 'date');
    });

    test('a user born on a day shows that day', () => {
      expect(userForm.field('Date Of Birth')).toHaveDisplayValue('1984-06-02');
    });

    test('a user who works from home finds Same as Home ticked', () => {
      expect(userForm.sameAsHome()).toBeChecked();
    });

    test('the state is chosen from a list', () => {
      expect(userForm.addressField('home', 'State')).toHaveRole('combobox');
    });

    it('should be able to reset the form to the original information', async () => {
      await userForm.typeInto('First Name', ' with more text');

      expect(userForm.field('First Name')).toHaveDisplayValue(`${kai.person.firstName} with more text`);

      await userForm.reset();

      expect(userForm.field('First Name')).toHaveDisplayValue(kai.person.firstName);
    });

    it('canceling an edit returns to viewing the user', async () => {
      await userForm.cancel();
      expect(appAddress.shown()).toContain('mode=view');
    });

    test('canceling an edit shows the user as stored', async () => {
      await userForm.typeInto('First Name', ' unsaved');

      await userForm.cancel();

      await waitFor(() => expect(userForm.field('First Name')).toHaveDisplayValue(kai.person.firstName));
    });

    test('a refused update keeps what the reader typed', async () => {
      userUpdateRefused(kai.id);
      await userForm.typeInto('First Name', ' typed');

      await userForm.update();

      expect(await usersPage.says('the users server is having trouble')).toBeInTheDocument();
      expect(userForm.field('First Name')).toHaveDisplayValue(`${kai.person.firstName} typed`);
    });
  });

  test('editing a user with a work address shows that address', async () => {
    const work = anAddress();
    const person = aUser({work});
    setupUsersResponse([person]);

    render(<TestApp at={openings.at(person.id, 'edit')}/>);
    await userForm.showing(person);

    expect(userForm.addressField('work', 'Street')).toHaveValue(work.streetAddress);
  });

  test('Update sends the backend the work address the user already had', async () => {
    const work = anAddress();
    const person = aUser({work});
    setupUsersResponse([person]);
    const sent = setupUserUpdatedResponse(person.id, [person]);
    render(<TestApp at={openings.at(person.id, 'edit')}/>);
    await userForm.showing(person);

    await userForm.update();

    await waitFor(() => expect(sent()).toMatchObject({work}));
  });

  test('an updated user shows their new name in the roster', async () => {
    const user = aUser();
    setupUsersResponse([user]);
    setupUserUpdatedResponse(user.id, [{...user, person: {...user.person, lastName: `${user.person.lastName} Jr`}}]);
    render(<TestApp at={openings.at(user.id, 'edit')}/>);
    await userForm.showing(user);

    await userForm.typeInto('Last Name', ' Jr');
    await userForm.update();

    expect(await usersTable.rowOf(`${profile.fullName(user)} Jr`)).toBeInTheDocument();
  });

  test('a removed user leaves the roster', async () => {
    const person = aUser();
    setupUsersResponse([person]);
    setupUserRemovedResponse(person.id, []);
    render(<TestApp at={Paths.users}/>);

    await usersTable.remove(profile.fullName(person));

    await waitFor(() => expect(usersTable.names()).not.toContain(profile.fullName(person)));
  });

  test('a person the backend cannot remove stays in the roster, and the page says so', async () => {
    const person = aUser();
    setupUsersResponse([person]);
    userRemovalRefused(person.id);
    render(<TestApp at={Paths.users}/>);
    await usersTable.roster();

    await usersTable.remove(profile.fullName(person));

    expect(await usersPage.says('the users server is having trouble')).toBeInTheDocument();
    expect(usersTable.names()).toContain(profile.fullName(person));
  });

  test('removing the chosen user clears them from the address', async () => {
    const person = aUser();
    setupUsersResponse([person]);
    setupUserRemovedResponse(person.id, []);
    render(<TestApp at={openings.at(person.id, 'view')}/>);
    await userForm.showing(person);

    await usersTable.remove(profile.fullName(person));

    await waitFor(() => expect(appAddress.shown()).not.toContain('id='));
  });

  test('a cloned user stands once more in the roster', async () => {
    const person = aUser();
    setupUsersResponse([person]);
    setupUserAddedResponse([{...person, id: 'the clone'}, person]);
    render(<TestApp at={`${Paths.users}?${createSearchParams({id: person.id})}`}/>);
    await userForm.showing(person);

    await userForm.add();

    await waitFor(() => expect(usersTable.names().filter(name => name === profile.fullName(person))).toHaveLength(2));
  });

  test("removing a friend in a person's row sends the backend that person without the friend", async () => {
    const vic = aUser({id: 'vic', friends: ['wen']});
    const wen = aUser({id: 'wen', friends: []});
    setupUsersResponse([vic, wen]);
    const sent = setupUserUpdatedResponse(vic.id, [{...vic, friends: []}, wen]);
    render(<TestApp at={Paths.users}/>);
    const vicsRow = await usersTable.rowOf(profile.fullName(vic));

    await friendsList(vicsRow).remove(profile.fullName(wen));

    await waitFor(() => expect(sent()).toMatchObject({id: vic.id, friends: []}));
  });

  test('a friend the backend refuses to remove is reported, and the row keeps the friend', async () => {
    const zed = aUser({id: 'zed', friends: ['amo']});
    const amo = aUser({id: 'amo', friends: []});
    setupUsersResponse([zed, amo]);
    userUpdateRefused(zed.id);
    render(<TestApp at={Paths.users}/>);
    const zedsRow = await usersTable.rowOf(profile.fullName(zed));

    await friendsList(zedsRow).remove(profile.fullName(amo));

    expect(await usersPage.says('the users server is having trouble')).toBeInTheDocument();
    expect(friendsList(zedsRow).removal(profile.fullName(amo))).toBeInTheDocument();
  });

  test('a friend the backend refuses to add is reported, and the row keeps the friends it had', async () => {
    const xia = aUser({id: 'xia', friends: []});
    const yul = aUser({id: 'yul', friends: []});
    setupUsersResponse([xia, yul]);
    userUpdateRefused(xia.id);
    render(<TestApp at={Paths.users}/>);
    const xiasRow = await usersTable.rowOf(profile.fullName(xia));

    await friendsList(xiasRow).add(profile.fullName(yul));

    expect(await usersPage.says('the users server is having trouble')).toBeInTheDocument();
    expect(friendsList(xiasRow).removalIfAny(profile.fullName(yul))).not.toBeInTheDocument();
  });

  test("choosing a friend in a person's row sends the backend that person with the friend added", async () => {
    const tam = aUser({id: 'tam', friends: []});
    const uma = aUser({id: 'uma', friends: []});
    setupUsersResponse([tam, uma]);
    const sent = setupUserUpdatedResponse(tam.id, [{...tam, friends: [uma.id]}, uma]);
    render(<TestApp at={Paths.users}/>);
    const tamsRow = await usersTable.rowOf(profile.fullName(tam));

    await friendsList(tamsRow).add(profile.fullName(uma));

    await waitFor(() => expect(sent()).toMatchObject({id: tam.id, friends: [uma.id]}));
  });
});
