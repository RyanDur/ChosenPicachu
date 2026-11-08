import {render, waitFor} from '@testing-library/react';
import {Paths} from '@frame/navigation';
import {TestApp} from '@__test_support/TestApp';
import {profile, User} from '@pages/Users/profile';
import {aUser, setupUsersResponse, setupUserUpdatedResponse, userUpdatePending, usersTable} from '@pages/Users/__test_support';
import {friendsList} from '../__test_support';

const nameOf = profile.fullName;

const rowOf = async (person: User, roster: readonly User[]): Promise<ReturnType<typeof friendsList>> => {
  setupUsersResponse(roster);
  render(<TestApp at={Paths.users}/>);
  return friendsList(await usersTable.rowOf(nameOf(person)));
};

describe('the friends list', () => {
  const ben = aUser({id: 'ben'});
  const cy = aUser({id: 'cy'});

  test('a chosen friend joins the list once the backend has them', async () => {
    const ana = aUser({id: 'ana'});
    setupUserUpdatedResponse(ana.id, [{...ana, friends: [ben.id]}, ben, cy]);
    const list = await rowOf(ana, [ana, ben, cy]);

    await list.add(nameOf(ben));

    await waitFor(() => expect(list.friends()).toHaveTextContent(nameOf(ben)));
  });

  test('adding a friend says who was added once they are on the list', async () => {
    const ana = aUser({id: 'ana'});
    setupUserUpdatedResponse(ana.id, [{...ana, friends: [ben.id]}, ben, cy]);
    const list = await rowOf(ana, [ana, ben, cy]);

    await list.add(nameOf(ben));

    await waitFor(() => expect(list.report()).toHaveTextContent(`${nameOf(ben)} added.`));
  });

  test('while a change is still on its way nothing is said', async () => {
    const ana = aUser({id: 'ana', friends: [ben.id]});
    userUpdatePending(ana.id);
    const list = await rowOf(ana, [ana, ben, cy]);

    await list.remove(nameOf(ben));

    expect(list.report()).toBeEmptyDOMElement();
  });

  test('the friends of a user are a group that says whose friends they are', async () => {
    const ana = aUser({id: 'ana'});
    const list = await rowOf(ana, [ana, ben, cy]);

    expect(list.friendsOf(nameOf(ana))).toBeInTheDocument();
  });

  test('a user cannot choose themselves', async () => {
    const ana = aUser({id: 'ana'});
    const list = await rowOf(ana, [ana, ben, cy]);

    expect(list.chooser()).not.toHaveTextContent(nameOf(ana));
  });

  test('the list shows the friends the user already has', async () => {
    const ana = aUser({id: 'ana', friends: [ben.id, cy.id]});
    const list = await rowOf(ana, [ana, ben, cy]);

    expect(list.friends()).toHaveTextContent(nameOf(ben));
    expect(list.friends()).toHaveTextContent(nameOf(cy));
  });

  test('a friend shows by their name in the roster', async () => {
    const renamed = {...ben, person: {...ben.person, firstName: 'Renamed', lastName: 'Person'}};
    const ana = aUser({id: 'ana', friends: [ben.id]});
    const list = await rowOf(ana, [ana, renamed, cy]);

    expect(list.friends()).toHaveTextContent('Renamed Person');
  });

  describe('removing a friend from the list', () => {
    const ana = aUser({id: 'ana', friends: [ben.id, cy.id]});
    const roster = [ana, ben, cy];

    beforeEach(() => {
      setupUserUpdatedResponse(ana.id, [{...ana, friends: [ben.id]}, ben, cy]);
    });

    test('clicking a friend removes them', async () => {
      const list = await rowOf(ana, roster);

      await list.remove(nameOf(cy));

      await waitFor(() => expect(list.removalIfAny(nameOf(cy))).not.toBeInTheDocument());
    });

    test('pressing enter on a friend removes them', async () => {
      const list = await rowOf(ana, roster);

      await list.removeByKey(nameOf(cy), '{enter}');

      await waitFor(() => expect(list.removalIfAny(nameOf(cy))).not.toBeInTheDocument());
    });

    test('pressing space on a friend removes them', async () => {
      const list = await rowOf(ana, roster);

      await list.removeByKey(nameOf(cy), ' ');

      await waitFor(() => expect(list.removalIfAny(nameOf(cy))).not.toBeInTheDocument());
    });

    test('once the removal has arrived the list says who was removed', async () => {
      const list = await rowOf(ana, roster);

      await list.remove(nameOf(cy));

      await waitFor(() => expect(list.report()).toHaveTextContent(`${nameOf(cy)} removed.`));
    });
  });

  test('a friend the user already has is not offered again', async () => {
    const ana = aUser({id: 'ana', friends: [ben.id]});
    const list = await rowOf(ana, [ana, ben, cy]);

    expect(list.chooser()).not.toHaveTextContent(nameOf(ben));
  });

  test('nobody is offered once everyone is a friend', async () => {
    const ana = aUser({id: 'ana', friends: [ben.id, cy.id]});
    const list = await rowOf(ana, [ana, ben, cy]);

    expect(list.chooserIfAny()).not.toBeInTheDocument();
  });
});
