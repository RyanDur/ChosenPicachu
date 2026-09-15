import {users} from '@components/Users';
import {
  setupUserAddedResponse,
  setupUserRemovedResponse,
  setupUsersResponse,
  setupUserUpdatedResponse,
  someUsers
} from '@components/Users/__test_support';
import {syncing} from '../syncing';
import {friendsChanged, opened, selectUsers, userAdded, userRemoved, userUpdated, userWithId, usersArrived, usersStore} from '../store';
import {rowMoved} from '@components/DragSortableTable/arrangement';

describe('the users store', () => {
  const [first, second] = someUsers;
  const openedStore = async () => {
    setupUsersResponse(someUsers);
    const store = usersStore(syncing(users, () => undefined, () => undefined));
    store.dispatch(opened());
    await vi.waitFor(() => expect(store.state.users).toHaveLength(someUsers.length));
    return store;
  };

  it('holds the roster as the backend answers it', () => {
    const store = usersStore();

    store.dispatch(usersArrived(someUsers));

    expect(store.state.users).toEqual(someUsers);
  });

  it('a row moved to a new seat stays there when the roster arrives again', () => {
    const store = usersStore();
    const ids = someUsers.map(({id}) => id);
    store.dispatch(usersArrived(someUsers));

    store.dispatch(rowMoved(first.id, 2, ids));
    store.dispatch(usersArrived(someUsers));

    expect(selectUsers(store.state).map(({id}) => id)).toEqual([ids[1], ids[2], first.id, ...ids.slice(3)]);
  });

  it('opening fills the roster with everyone the backend has', async () => {
    setupUsersResponse(someUsers);
    const store = usersStore(syncing(users, () => undefined, () => undefined));

    store.dispatch(opened());

    await vi.waitFor(() =>
      expect(store.state.users.map(({id}) => id)).toEqual(someUsers.map(({id}) => id)));
  });

  it('adding a user sends the backend who they are, and holds the roster it answers', async () => {
    const store = await openedStore();
    const {id: _id, ...newcomer} = someUsers[2];
    const sent = setupUserAddedResponse([...someUsers, {...newcomer, id: 'newcomer'}]);

    store.dispatch(userAdded(newcomer));

    await vi.waitFor(() => expect(userWithId('newcomer')(store.state)).toBeDefined());
    expect(sent()).toMatchObject({info: {firstName: newcomer.info.firstName}, homeAddress: newcomer.homeAddress});
  });

  it('a user is found by id in the roster', async () => {
    const store = await openedStore();

    expect(userWithId(first.id)(store.state)?.id).toBe(first.id);
  });

  it('a user found by id shows the friends the roster now has', async () => {
    const store = await openedStore();
    setupUserUpdatedResponse(first.id, [{...first, friends: [second.id]}, ...someUsers.slice(1)]);

    store.dispatch(friendsChanged(first, [second.id]));

    await vi.waitFor(() => expect(userWithId(first.id)(store.state)?.friends).toEqual([second.id]));
  });

  it('a change of friends sends the backend the person with their new friends', async () => {
    const store = await openedStore();
    const sent = setupUserUpdatedResponse(first.id, someUsers);

    store.dispatch(friendsChanged(first, [second.id]));

    await vi.waitFor(() => expect(sent()).toMatchObject({id: first.id, friends: [second.id]}));
  });

  it('no id finds no user', () => {
    expect(userWithId(undefined)(usersStore().state)).toBeUndefined();
  });

  it('a removed user leaves the roster the backend answers', async () => {
    const store = await openedStore();
    setupUserRemovedResponse(second.id, someUsers.filter(user => user.id !== second.id));

    store.dispatch(userRemoved(second));

    await vi.waitFor(() => expect(userWithId(second.id)(store.state)).toBeUndefined());
  });

  it('an update sends the backend the friends the roster already holds', async () => {
    const befriended = {...first, friends: [second.id]};
    setupUsersResponse([befriended, ...someUsers.slice(1)]);
    const store = usersStore(syncing(users, () => undefined, () => undefined));
    store.dispatch(opened());
    await vi.waitFor(() => expect(userWithId(first.id)(store.state)?.friends).toEqual([second.id]));
    const sent = setupUserUpdatedResponse(first.id, [befriended, ...someUsers.slice(1)]);

    store.dispatch(userUpdated({...first, info: {...first.info, firstName: 'Renamed'}}));

    await vi.waitFor(() => expect(sent()).toMatchObject({info: {firstName: 'Renamed'}, friends: [second.id]}));
  });

  it('an update says once when it is saved', async () => {
    const saved = vi.fn();
    setupUsersResponse(someUsers);
    const store = usersStore(syncing(users, saved, () => undefined));
    store.dispatch(opened());
    await vi.waitFor(() => expect(store.state.users).toHaveLength(someUsers.length));
    setupUserUpdatedResponse(first.id, [{...first, info: {...first.info, firstName: 'Renamed'}}, ...someUsers.slice(1)]);

    store.dispatch(userUpdated({...first, info: {...first.info, firstName: 'Renamed'}}));

    await vi.waitFor(() => expect(userWithId(first.id)(store.state)?.info.firstName).toBe('Renamed'));
    expect(saved).toHaveBeenCalledTimes(1);
  });
});
