import {users as someUsers} from '@__test_support/fixtures';
import {users} from '@components/Users';
import {usersServed} from '@__test_support/server';
import {syncing} from '../syncing';
import {friendsChanged, opened, selectUsers, userRemoved, userUpdated, userWithId, usersArrived, usersStore} from '../store';
import {rowMoved} from '@components/DragSortableTable/arrangement';

describe('the users store', () => {
  const [first, second] = someUsers;
  const openedStore = async () => {
    usersServed(someUsers);
    const store = usersStore(syncing(users, () => undefined, () => undefined));
    store.dispatch(opened());
    await vi.waitFor(() => expect(store.state.users).toHaveLength(someUsers.length));
    return store;
  };
  const friendsOf = (store: ReturnType<typeof usersStore>) => (id: string) => userWithId(id)(store.state)?.friends;

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
    usersServed(someUsers);
    const store = usersStore(syncing(users, () => undefined, () => undefined));

    store.dispatch(opened());

    await vi.waitFor(() =>
      expect(store.state.users.map(({id}) => id)).toEqual(someUsers.map(({id}) => id)));
  });

  it('a user is found by id in the roster', async () => {
    const store = await openedStore();

    expect(userWithId(first.id)(store.state)?.id).toBe(first.id);
  });

  it('a user found by id shows the friends the roster now has', async () => {
    const store = await openedStore();

    store.dispatch(friendsChanged(first, [second.id]));

    await vi.waitFor(() => expect(userWithId(first.id)(store.state)?.friends).toEqual([second.id]));
  });

  it('no id finds no user', () => {
    expect(userWithId(undefined)(usersStore().state)).toBeUndefined();
  });

  it('a friendship is mutual, as the backend keeps it', async () => {
    const store = await openedStore();

    store.dispatch(friendsChanged(first, [second.id]));

    await vi.waitFor(() => expect(friendsOf(store)(first.id)).toEqual([second.id]));
    expect(friendsOf(store)(second.id)).toContain(first.id);
  });

  it('dropping a friendship clears both sides', async () => {
    const store = await openedStore();
    store.dispatch(friendsChanged(first, [second.id]));
    await vi.waitFor(() => expect(friendsOf(store)(second.id)).toContain(first.id));

    store.dispatch(friendsChanged(first, []));

    await vi.waitFor(() => expect(friendsOf(store)(first.id)).toEqual([]));
    expect(friendsOf(store)(second.id)).not.toContain(first.id);
  });

  it('a removed user leaves their friends\' lists', async () => {
    const store = await openedStore();
    store.dispatch(friendsChanged(second, [first.id]));
    await vi.waitFor(() => expect(friendsOf(store)(first.id)).toContain(second.id));

    store.dispatch(userRemoved(second));

    await vi.waitFor(() => expect(userWithId(second.id)(store.state)).toBeUndefined());
    expect(friendsOf(store)(first.id)).not.toContain(second.id);
  });

  it('an update keeps the friends the table already changed', async () => {
    const store = await openedStore();
    store.dispatch(friendsChanged(first, [second.id]));
    await vi.waitFor(() => expect(userWithId(first.id)(store.state)?.friends).toEqual([second.id]));

    store.dispatch(userUpdated({...first, info: {...first.info, firstName: 'Renamed'}}));

    await vi.waitFor(() => {
      const renamed = userWithId(first.id)(store.state);
      expect(renamed?.info.firstName).toBe('Renamed');
      expect(renamed?.friends).toEqual([second.id]);
    });
  });

  it('an update says once when it is saved', async () => {
    const saved = vi.fn();
    usersServed(someUsers);
    const store = usersStore(syncing(users, saved, () => undefined));
    store.dispatch(opened());
    await vi.waitFor(() => expect(store.state.users).toHaveLength(someUsers.length));

    store.dispatch(userUpdated({...first, info: {...first.info, firstName: 'Renamed'}}));

    await vi.waitFor(() => expect(userWithId(first.id)(store.state)?.info.firstName).toBe('Renamed'));
    expect(saved).toHaveBeenCalledTimes(1);
  });
});
