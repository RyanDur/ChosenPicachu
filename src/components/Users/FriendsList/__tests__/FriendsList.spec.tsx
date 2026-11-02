import {render} from '@testing-library/react';
import {FC, useState} from 'react';
import {FriendsList} from '@components/Users/FriendsList';
import {befriended, fullNameOf, unfriended, User} from '@components/Users/UserInfo/user';
import {someUsers} from '@components/Users/__test_support';
import {friendsList} from '../__test_support';

const Befriending: FC<{user: User; among?: readonly User[]}> = ({user: first, among = someUsers}) => {
  const [user, update] = useState(first);
  return <FriendsList users={among} user={user}
    onFriendAdded={friend => update(befriended(user, friend))}
    onFriendRemoved={friend => update(unfriended(user, friend))}/>;
};

describe('the friends list', () => {
  const friendAdded = (): void => undefined;
  const friendRemoved = (): void => undefined;
  const firstUser = someUsers[0];
  const secondUser = someUsers[1];
  const thirdUser = someUsers[2];

  it('should be able to add friends', async () => {
    render(<Befriending user={firstUser}/>);
    await friendsList.add(fullNameOf(secondUser));

    expect(friendsList.friendsOf(fullNameOf(firstUser))).toHaveTextContent(fullNameOf(secondUser));
  });

  it('adding a friend says who was added once they are on the list', async () => {
    render(<Befriending user={firstUser}/>);
    await friendsList.add(fullNameOf(secondUser));

    expect(friendsList.report()).toHaveTextContent(`${fullNameOf(secondUser)} added.`);
  });

  it('while a change is still on its way nothing is said', async () => {
    render(<FriendsList users={someUsers} user={{...firstUser, friends: [secondUser.id]}}
      onFriendAdded={friendAdded} onFriendRemoved={friendRemoved}/>);
    await friendsList.remove(fullNameOf(secondUser));

    expect(friendsList.report()).toBeEmptyDOMElement();
  });

  it('the friends of a user are a group that says whose friends they are', () => {
    render(<FriendsList users={someUsers} user={firstUser}
      onFriendAdded={friendAdded} onFriendRemoved={friendRemoved}/>);

    expect(friendsList.friendsOf(fullNameOf(firstUser))).toBeInTheDocument();
  });

  it('should not allow you to pick yourself', () => {
    render(<FriendsList users={someUsers} user={firstUser}
      onFriendAdded={friendAdded} onFriendRemoved={friendRemoved}/>);
    expect(friendsList.chooser()).not.toHaveTextContent(fullNameOf(firstUser));
  });

  it('should display the friends the user already has', () => {
    const userWithFriends = {...firstUser, friends: [secondUser.id, thirdUser.id]};
    render(<FriendsList users={someUsers} user={userWithFriends}
      onFriendAdded={friendAdded} onFriendRemoved={friendRemoved}/>);
    expect(friendsList.friends()).toHaveTextContent(fullNameOf(thirdUser));
    expect(friendsList.friends()).toHaveTextContent(fullNameOf(secondUser));
  });

  it('should display friends by their current name, not a snapshot', () => {
    const renamedSecond = {
      ...secondUser,
      info: {...secondUser.info, firstName: 'Renamed', lastName: 'Person'}
    };
    const userWithFriends = {...firstUser, friends: [secondUser.id]};
    render(<FriendsList users={[firstUser, renamedSecond, thirdUser]} user={userWithFriends}
      onFriendAdded={friendAdded} onFriendRemoved={friendRemoved}/>);
    expect(friendsList.friends()).toHaveTextContent('Renamed Person');
  });

  describe('removing a friend from the list', () => {
    beforeEach(() => {
      render(<Befriending user={{...firstUser, friends: [secondUser.id, thirdUser.id]}}/>);
    });

    test('clicking a friend removes them', async () => {
      await friendsList.remove(fullNameOf(thirdUser));

      expect(friendsList.removalIfAny(fullNameOf(thirdUser))).not.toBeInTheDocument();
    });

    test('pressing enter on a friend removes them', async () => {
      await friendsList.removeByKey(fullNameOf(thirdUser), '{enter}');

      expect(friendsList.removalIfAny(fullNameOf(thirdUser))).not.toBeInTheDocument();
    });

    test('pressing space on a friend removes them', async () => {
      await friendsList.removeByKey(fullNameOf(thirdUser), ' ');

      expect(friendsList.removalIfAny(fullNameOf(thirdUser))).not.toBeInTheDocument();
    });

  });

  describe('once a removal has arrived', () => {
    const withTwoFriends = {...firstUser, friends: [secondUser.id, thirdUser.id]};

    test('the list says who was removed', async () => {
      render(<Befriending user={withTwoFriends}/>);

      await friendsList.remove(fullNameOf(thirdUser));

      expect(friendsList.removalIfAny(fullNameOf(thirdUser))).not.toBeInTheDocument();
      expect(friendsList.report()).toHaveTextContent(`${fullNameOf(thirdUser)} removed.`);
    });

    test("focus lands on the next friend's remove button", async () => {
      render(<Befriending user={withTwoFriends}/>);

      await friendsList.remove(fullNameOf(secondUser));

      expect(friendsList.removal(fullNameOf(thirdUser))).toHaveFocus();
    });

    test('focus lands on the friend before when the last one goes', async () => {
      render(<Befriending user={withTwoFriends}/>);

      await friendsList.remove(fullNameOf(thirdUser));

      expect(friendsList.removal(fullNameOf(secondUser))).toHaveFocus();
    });

    test('focus lands on Add a friend when the only friend goes', async () => {
      render(<Befriending user={{...firstUser, friends: [secondUser.id]}}/>);

      await friendsList.remove(fullNameOf(secondUser));

      expect(friendsList.chooser()).toHaveFocus();
    });

    test('focus lands on Add a friend even when it only appears once the friend is gone', async () => {
      render(<Befriending user={{...firstUser, friends: [secondUser.id]}} among={[firstUser, secondUser]}/>);
      expect(friendsList.chooserIfAny()).not.toBeInTheDocument();

      await friendsList.remove(fullNameOf(secondUser));

      expect(friendsList.chooser()).toHaveFocus();
    });
  });

  it('should not allow a user to select something twice', () => {
    const userWithFriends = {...firstUser, friends: [secondUser.id]};
    render(<FriendsList users={someUsers} user={userWithFriends}
      onFriendAdded={friendAdded} onFriendRemoved={friendRemoved}/>);
    expect(friendsList.chooser()).not.toHaveTextContent(fullNameOf(secondUser));
  });

  it('should not allow to select a friend if no more friends are left', () => {
    const userWithFriends = {...firstUser, friends: [secondUser.id, thirdUser.id]};
    render(<FriendsList users={[firstUser, secondUser, thirdUser]} user={userWithFriends}
      onFriendAdded={friendAdded} onFriendRemoved={friendRemoved}/>);

    expect(friendsList.chooserIfAny()).not.toBeInTheDocument();
  });
});
