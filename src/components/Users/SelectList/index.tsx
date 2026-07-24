import {ChangeEvent, FC} from 'react';
import {User} from '@components/Users/UserInfo/types';
import {join} from '@components/class-names';
import {Consumer, has} from '@ryandur/sand';
import './fiends-list.css';

type Props = {
  users: User[];
  user: User;
  onChange: Consumer<string[]>
}

export const FriendsList: FC<Props> = ({users, user, onChange}) => {
  const friends = user.friends
    .flatMap(friendId => users.filter(({id}) => id === friendId));
  const potentialFriends = users
    .filter(candidate => candidate.id !== user.id)
    .filter(candidate => !user.friends.includes(candidate.id ?? ''));

  const displayFullName = ({info}: User) => `${info.firstName} ${info.lastName}`;

  const add = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange([...user.friends, event.currentTarget.value]);
    event.currentTarget.selectedIndex = 0;
  };

  const remove = (friend: User) => onChange(user.friends.filter(id => id !== friend.id));

  return <article className={join('friends-list', has(friends) && 'not-empty')}>
    <ul className="friends" data-testid="friends-list">{friends.map(friend =>
      <li className="friend" key={friend.id} data-testid={friend.id}>
        <label className="friend-title ellipsis"
               htmlFor={`remove-${friend.id}`}>{displayFullName(friend)}</label>
        <button id={`remove-${friend.id}`} className="remove" type="button"
                onClick={() => remove(friend)} data-testid={`remove-${friend.id}`}>
          <img src="https://img.icons8.com/material-outlined/24/000000/cancel--v1.png"
               alt="remove"/>
        </button>
      </li>
    )}</ul>
    {has(potentialFriends) &&
      <select className="select-friend button" defaultValue="" aria-label="Add a friend"
              onChange={add}
              data-testid="select-friend">{[
        <option key="placeholder" value="" disabled hidden>Add a Friend</option>,
        ...potentialFriends.map(potentialFriend =>
          <option key={potentialFriend.id} value={potentialFriend.id}>{
            displayFullName(potentialFriend)
          }</option>)
      ]}</select>}
  </article>;
};
