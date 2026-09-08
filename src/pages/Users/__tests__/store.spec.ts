import {users as someUsers} from '@test-support/fixtures';
import {usersApi} from '@components/Users/resource/usersApi';
import {syncing} from '../syncing';
import {friendsChanged, opened, userRemoved, userUpdated, userWithId, usersArrived, usersStore} from '../store';

describe('the users store', () => {
  const [first, second] = someUsers;

  it('holds the roster as the backend answers it', () => {
    const store = usersStore();

    store.dispatch(usersArrived(someUsers));

    expect(store.state.users).toBe(someUsers);
  });

  it('opening asks the api for everyone, and they arrive through the middleware', async () => {
    const store = usersStore(syncing(usersApi(someUsers), () => undefined));

    store.dispatch(opened());

    await vi.waitFor(() =>
      expect(store.state.users.map(({id}) => id)).toEqual(someUsers.map(({id}) => id)));
  });

  it('a user is found by id in the roster, and reflects the roster as it refreshes', async () => {
    const store = usersStore(syncing(usersApi(someUsers), () => undefined));
    store.dispatch(opened());
    await vi.waitFor(() => expect(userWithId(first.id)(store.state)?.id).toBe(first.id));

    store.dispatch(friendsChanged(first, [second.id]));

    await vi.waitFor(() => expect(userWithId(first.id)(store.state)?.friends).toEqual([second.id]));
    expect(userWithId(undefined)(store.state)).toBeUndefined();
  });

  it('a friendship is mutual as the backend keeps it: the store shows what the backend answers', async () => {
    const store = usersStore(syncing(usersApi(someUsers), () => undefined));
    store.dispatch(opened());
    await vi.waitFor(() => expect(store.state.users).toHaveLength(someUsers.length));
    const friendsOf = (id: string) => userWithId(id)(store.state)?.friends;

    store.dispatch(friendsChanged(first, [second.id]));
    await vi.waitFor(() => expect(friendsOf(first.id)).toEqual([second.id]));
    expect(friendsOf(second.id)).toContain(first.id);

    store.dispatch(friendsChanged(first, []));
    await vi.waitFor(() => expect(friendsOf(first.id)).toEqual([]));
    expect(friendsOf(second.id)).not.toContain(first.id);

    store.dispatch(friendsChanged(second, [first.id]));
    await vi.waitFor(() => expect(friendsOf(first.id)).toContain(second.id));
    store.dispatch(userRemoved(second));
    await vi.waitFor(() => expect(userWithId(second.id)(store.state)).toBeUndefined());
    expect(friendsOf(first.id)).not.toContain(second.id);
  });

  it('an update keeps the friends the table already changed, and says when it is saved', async () => {
    const saved = vi.fn();
    const store = usersStore(syncing(usersApi(someUsers), saved));
    store.dispatch(opened());
    await vi.waitFor(() => expect(store.state.users).toHaveLength(someUsers.length));
    store.dispatch(friendsChanged(first, [second.id]));
    await vi.waitFor(() => expect(userWithId(first.id)(store.state)?.friends).toEqual([second.id]));

    store.dispatch(userUpdated({...first, info: {...first.info, firstName: 'Renamed'}}));

    await vi.waitFor(() => {
      const renamed = userWithId(first.id)(store.state);
      expect(renamed?.info.firstName).toBe('Renamed');
      expect(renamed?.friends).toEqual([second.id]);
    });
    expect(saved).toHaveBeenCalledTimes(1);
  });
});
