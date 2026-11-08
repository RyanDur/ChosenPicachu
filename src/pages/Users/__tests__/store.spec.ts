import {usersApi} from '@pages/Users/resource';
import {
  setupUserAddedResponse,
  setupUserRemovedResponse,
  setupUsersResponse,
  setupUserUpdatedResponse,
  someUsers
} from '@pages/Users/__test_support';
import {syncing} from '../syncing';
import {usersActions} from '../usersActions';
import {usersSelectors} from '../usersSelectors';
import {usersStore} from '../usersStore';
import {arrangements} from '@components/DragSortableTable/model';
import {User} from '@pages/Users/profile';

describe('the users store', () => {
  const [first, second, third] = someUsers;
  const openedStore = async (roster: readonly User[] = someUsers) => {
    setupUsersResponse([...roster]);
    const store = usersStore(syncing(usersApi, () => undefined, () => undefined));
    store.dispatch(usersActions.opened());
    await vi.waitFor(() => expect(store.state.users).toHaveLength(roster.length));
    return store;
  };

  it('holds the roster as the backend answers it', () => {
    const store = usersStore();

    store.dispatch(usersActions.usersArrived(someUsers));

    expect(store.state.users).toEqual(someUsers);
  });

  it('a row moved to a new seat stays there when the roster arrives again', () => {
    const store = usersStore();
    const ids = someUsers.map(({id}) => id);
    store.dispatch(usersActions.usersArrived(someUsers));

    store.dispatch(arrangements.rowMoved(first.id, 2, ids));
    store.dispatch(usersActions.usersArrived(someUsers));

    expect(usersSelectors.users(store.state).map(({id}) => id)).toEqual([ids[1], ids[2], first.id, ...ids.slice(3)]);
  });

  it('opening fills the roster with everyone the backend has', async () => {
    setupUsersResponse(someUsers);
    const store = usersStore(syncing(usersApi, () => undefined, () => undefined));

    store.dispatch(usersActions.opened());

    await vi.waitFor(() =>
      expect(store.state.users.map(({id}) => id)).toEqual(someUsers.map(({id}) => id)));
  });

  it('adding a user sends the backend who they are, and holds the roster it answers', async () => {
    const store = await openedStore();
    const {id: _id, ...newcomer} = someUsers[2];
    const sent = setupUserAddedResponse([...someUsers, {...newcomer, id: 'newcomer'}]);

    store.dispatch(usersActions.userAdded(newcomer));

    await vi.waitFor(() => expect(usersSelectors.withId('newcomer')(store.state).isNothing).toBe(false));
    expect(sent()).toMatchObject({person: {firstName: newcomer.person.firstName}, homeAddress: newcomer.homeAddress});
  });

  it('a user is found by id in the roster', async () => {
    const store = await openedStore();

    expect(usersSelectors.withId(first.id)(store.state).map(({id}) => id).orNull()).toBe(first.id);
  });

  it('a user found by id shows the friends the roster now has', async () => {
    const store = await openedStore();
    setupUserUpdatedResponse(first.id, [{...first, friends: [second.id]}, ...someUsers.slice(1)]);

    store.dispatch(usersActions.friendAdded(first.id, second.id));

    await vi.waitFor(() =>
      expect(usersSelectors.withId(first.id)(store.state).map(({friends}) => friends).orNull()).toEqual([second.id]));
  });

  it('an added friend sends the backend the person as the roster has them, with the friend after the ones they had', async () => {
    const store = await openedStore([{...first, friends: [third.id]}, second, third]);
    const sent = setupUserUpdatedResponse(first.id, someUsers);

    store.dispatch(usersActions.friendAdded(first.id, second.id));

    await vi.waitFor(() => expect(sent()).toMatchObject({id: first.id, friends: [third.id, second.id]}));
  });

  it('a removed friend sends the backend the person as the roster has them, without that friend', async () => {
    const store = await openedStore([{...first, friends: [second.id, third.id]}, second, third]);
    const sent = setupUserUpdatedResponse(first.id, someUsers);

    store.dispatch(usersActions.friendRemoved(first.id, second.id));

    await vi.waitFor(() => expect(sent()).toMatchObject({id: first.id, friends: [third.id]}));
  });

  it('no id finds no user', () => {
    expect(usersSelectors.withId(undefined)(usersStore().state).isNothing).toBe(true);
  });

  it('a removed user leaves the roster the backend answers', async () => {
    const store = await openedStore();
    setupUserRemovedResponse(second.id, someUsers.filter(user => user.id !== second.id));

    store.dispatch(usersActions.userRemoved(second));

    await vi.waitFor(() => expect(usersSelectors.withId(second.id)(store.state).isNothing).toBe(true));
  });

  it('an update sends the backend the friends the roster already holds', async () => {
    const befriended = {...first, friends: [second.id]};
    setupUsersResponse([befriended, ...someUsers.slice(1)]);
    const store = usersStore(syncing(usersApi, () => undefined, () => undefined));
    store.dispatch(usersActions.opened());
    await vi.waitFor(() =>
      expect(usersSelectors.withId(first.id)(store.state).map(({friends}) => friends).orNull()).toEqual([second.id]));
    const sent = setupUserUpdatedResponse(first.id, [befriended, ...someUsers.slice(1)]);

    store.dispatch(usersActions.userUpdated({...first, person: {...first.person, firstName: 'Renamed'}}));

    await vi.waitFor(() => expect(sent()).toMatchObject({person: {firstName: 'Renamed'}, friends: [second.id]}));
  });
});
