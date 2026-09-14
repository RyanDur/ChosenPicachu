import {ChangeEvent, FC, MouseEvent, useState} from 'react';
import {User} from '@components/Users/UserInfo/user';
import {classNames} from '@components/class-names';
import {Consumer, has} from '@ryandur/sand';
import cancelIcon from '../../../assets/icons/cancel.svg?url';
import './friends-list.css';

type Props = {
  users: readonly User[];
  user: User;
  onChange: Consumer<string[]>
}

export const FriendsList: FC<Props> = ({users, user, onChange}) => {
  const [said, say] = useState('');
  const friends = user.friends
    .flatMap(friendId => users.filter(({id}) => id === friendId));
  const potentialFriends = users
    .filter(candidate => candidate.id !== user.id)
    .filter(candidate => !user.friends.includes(candidate.id));

  const displayFullName = ({info}: User) => `${info.firstName} ${info.lastName}`;

  const add = (event: ChangeEvent<HTMLSelectElement>) => {
    const chosen = users.find(({id}) => id === event.currentTarget.value);
    if (has(chosen)) say(`${displayFullName(chosen)} added.`);
    onChange([...user.friends, event.currentTarget.value]);
  };

  const remove = (friend: User) => (event: MouseEvent<HTMLButtonElement>) => {
    const row = event.currentTarget.closest('li');
    const neighbour = row?.nextElementSibling ?? row?.previousElementSibling;
    (neighbour?.querySelector('button') ?? row?.closest('fieldset')?.querySelector('select'))?.focus();
    say(`${displayFullName(friend)} removed.`);
    onChange(user.friends.filter(id => id !== friend.id));
  };

  return <fieldset className={classNames('friends-list', 'shrinkable', has(friends) && 'not-empty')}>
    <legend className="off-screen">friends of {displayFullName(user)}</legend>
    <ul className="friends" aria-label="friends">{friends.map(friend =>
      <li className="friend" key={friend.id}>
        <label className="friend-title ellipsis"
               htmlFor={`remove-${friend.id}`}>{displayFullName(friend)}</label>
        <button id={`remove-${friend.id}`} className="remove" type="button"
                onClick={remove(friend)}>
          <img className="icon" src={cancelIcon} width="24" height="24"
               alt="remove"/>
        </button>
      </li>
    )}</ul>
    {has(potentialFriends) &&
        <select className="select-friend bare rounded-corners lifted pressable" value="" aria-label="Add a friend"
                onChange={add}>{[
          <option key="placeholder" value="" disabled hidden>Add a Friend</option>,
          ...potentialFriends.map(potentialFriend =>
            <option key={potentialFriend.id} value={potentialFriend.id}>{
              displayFullName(potentialFriend)
            }</option>)
        ]}</select>}
    <output className="off-screen" aria-label="friends report">{said}</output>
  </fieldset>;
};
