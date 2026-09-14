import userEvent from '@testing-library/user-event';
import {render, screen} from '@testing-library/react';
import {FC, useState} from 'react';
import {FriendsList} from '@components/Users/FriendsList';
import {User} from '@components/Users/UserInfo/user';
import {users} from '@test-support/fixtures';

const Befriending: FC<{user: User; among?: readonly User[]}> = ({user: first, among = users}) => {
  const [user, update] = useState(first);
  return <FriendsList users={among} user={user} onChange={friends => update({...user, friends})}/>;
};

describe('the friends list', () => {
  const consumer = vi.fn();
  const firstUser = users[0];
  const secondUser = users[1];
  const thirdUser = users[2];
  const fullName = ({info}: typeof firstUser) => `${info.firstName} ${info.lastName}`;

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should be able to add friends', async () => {
    render(<FriendsList users={users} user={firstUser} onChange={consumer}/>);
    await userEvent.selectOptions(screen.getByRole('combobox', {name: 'Add a friend'}), [fullName(secondUser)]);

    expect(consumer).toHaveBeenCalledWith([secondUser.id]);
  });

  it('adding a friend says who was added once they are on the list', async () => {
    render(<Befriending user={firstUser}/>);
    await userEvent.selectOptions(screen.getByRole('combobox', {name: 'Add a friend'}), [fullName(secondUser)]);

    expect(screen.getByRole('status', {name: 'friends report'})).toHaveTextContent(`${fullName(secondUser)} added.`);
  });

  it('while a change is still on its way nothing is said', async () => {
    render(<FriendsList users={users} user={{...firstUser, friends: [secondUser.id]}} onChange={consumer}/>);
    await userEvent.click(screen.getByRole('button', {name: `remove ${fullName(secondUser)}`}));

    expect(screen.getByRole('status', {name: 'friends report'})).toBeEmptyDOMElement();
  });

  it('the friends of a user are a group that says whose friends they are', () => {
    render(<FriendsList users={users} user={firstUser} onChange={consumer}/>);

    expect(screen.getByRole('group', {name: `friends of ${fullName(firstUser)}`})).toBeInTheDocument();
  });

  it('should not allow you to pick yourself', () => {
    render(<FriendsList users={users} user={firstUser} onChange={consumer}/>);
    expect(screen.getByRole('combobox', {name: 'Add a friend'})).not.toHaveTextContent(fullName(firstUser));
  });

  it('should display the friends the user already has', () => {
    const userWithFriends = {...firstUser, friends: [secondUser.id, thirdUser.id]};
    render(<FriendsList users={users} user={userWithFriends} onChange={consumer}/>);
    expect(screen.getByRole('list', {name: 'friends'})).toHaveTextContent(fullName(thirdUser));
    expect(screen.getByRole('list', {name: 'friends'})).toHaveTextContent(fullName(secondUser));
  });

  it('should display friends by their current name, not a snapshot', () => {
    const renamedSecond = {
      ...secondUser,
      info: {...secondUser.info, firstName: 'Renamed', lastName: 'Person'}
    };
    const userWithFriends = {...firstUser, friends: [secondUser.id]};
    render(<FriendsList users={[firstUser, renamedSecond, thirdUser]} user={userWithFriends}
      onChange={consumer}/>);
    expect(screen.getByRole('list', {name: 'friends'})).toHaveTextContent('Renamed Person');
  });

  describe('removing a friend from the list', () => {
    beforeEach(() => {
      const userWithFriends = {...firstUser, friends: [secondUser.id, thirdUser.id]};
      render(<FriendsList users={users} user={userWithFriends} onChange={consumer}/>);
    });

    test('clicking a friend removes them', async () => {
      await userEvent.click(screen.getByRole('button', {name: `remove ${fullName(thirdUser)}`}));

      expect(consumer).toHaveBeenCalledWith([secondUser.id]);
    });

    test('pressing enter on a friend removes them', async () => {
      screen.getByRole('button', {name: `remove ${fullName(thirdUser)}`}).focus();
      await userEvent.keyboard('{enter}');

      expect(consumer).toHaveBeenCalledWith([secondUser.id]);
    });

    test('pressing space on a friend removes them', async () => {
      screen.getByRole('button', {name: `remove ${fullName(thirdUser)}`}).focus();
      await userEvent.keyboard(' ');

      expect(consumer).toHaveBeenCalledWith([secondUser.id]);
    });

  });

  describe('once a removal has arrived', () => {
    const withTwoFriends = {...firstUser, friends: [secondUser.id, thirdUser.id]};

    test('the list says who was removed', async () => {
      render(<Befriending user={withTwoFriends}/>);

      await userEvent.click(screen.getByRole('button', {name: `remove ${fullName(thirdUser)}`}));

      expect(screen.queryByRole('button', {name: `remove ${fullName(thirdUser)}`})).not.toBeInTheDocument();
      expect(screen.getByRole('status', {name: 'friends report'})).toHaveTextContent(`${fullName(thirdUser)} removed.`);
    });

    test("focus lands on the next friend's remove button", async () => {
      render(<Befriending user={withTwoFriends}/>);

      await userEvent.click(screen.getByRole('button', {name: `remove ${fullName(secondUser)}`}));

      expect(screen.getByRole('button', {name: `remove ${fullName(thirdUser)}`})).toHaveFocus();
    });

    test('focus lands on the friend before when the last one goes', async () => {
      render(<Befriending user={withTwoFriends}/>);

      await userEvent.click(screen.getByRole('button', {name: `remove ${fullName(thirdUser)}`}));

      expect(screen.getByRole('button', {name: `remove ${fullName(secondUser)}`})).toHaveFocus();
    });

    test('focus lands on Add a friend when the only friend goes', async () => {
      render(<Befriending user={{...firstUser, friends: [secondUser.id]}}/>);

      await userEvent.click(screen.getByRole('button', {name: `remove ${fullName(secondUser)}`}));

      expect(screen.getByRole('combobox', {name: 'Add a friend'})).toHaveFocus();
    });

    test('focus lands on Add a friend even when it only appears once the friend is gone', async () => {
      render(<Befriending user={{...firstUser, friends: [secondUser.id]}} among={[firstUser, secondUser]}/>);
      expect(screen.queryByRole('combobox', {name: 'Add a friend'})).not.toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', {name: `remove ${fullName(secondUser)}`}));

      expect(screen.getByRole('combobox', {name: 'Add a friend'})).toHaveFocus();
    });
  });

  it('should not allow a user to select something twice', () => {
    const userWithFriends = {...firstUser, friends: [secondUser.id]};
    render(<FriendsList users={users} user={userWithFriends} onChange={consumer}/>);
    expect(screen.getByRole('combobox', {name: 'Add a friend'})).not.toHaveTextContent(fullName(secondUser));
  });

  it('should not allow to select a friend if no more friends are left', () => {
    const userWithFriends = {...firstUser, friends: [secondUser.id, thirdUser.id]};
    render(<FriendsList users={[firstUser, secondUser, thirdUser]} user={userWithFriends}
      onChange={consumer}/>);

    expect(screen.queryByRole('combobox', {name: 'Add a friend'})).not.toBeInTheDocument();
  });
});
