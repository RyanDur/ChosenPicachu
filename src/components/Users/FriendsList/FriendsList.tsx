import {ChangeEvent, FC, useEffect, useState} from 'react';
import {fullNameOf, User} from '@components/Users/UserInfo/user';
import {Consumer, has} from '@ryandur/sand';
import {arrived, friendsReport, Membership} from './report';
import {addFriendId, placeAfterAddition, placeAfterRemoval, removeButtonId} from './focus';
import cancelIcon from '../../../assets/icons/cancel.svg?url';
import './friends-list.css';

type Props = {
  users: readonly User[];
  user: User;
  onChange: Consumer<string[]>;
};

type Report =
  | {stage: 'quiet'}
  | {stage: 'asked'; of: Membership}
  | {stage: 'settled'; of: Membership};

const placeAfter = (userId: string, friends: readonly User[], candidatesLeft: readonly User[], of: Membership): string =>
  of.change === 'removed'
    ? placeAfterRemoval(userId, friends, of.at)
    : placeAfterAddition(userId, candidatesLeft, of.friend.id);

export const FriendsList: FC<Props> = ({users, user, onChange}) => {
  const [report, tell] = useState<Report>({stage: 'quiet'});
  const friends = user.friends
    .flatMap(friendId => users.filter(({id}) => id === friendId));
  const potentialFriends = users
    .filter(candidate => candidate.id !== user.id)
    .filter(candidate => !user.friends.includes(candidate.id));

  useEffect(() => {
    if (report.stage !== 'asked' || !arrived(user.friends, report.of)) return;
    document.getElementById(placeAfter(user.id, friends, potentialFriends, report.of))?.focus();
    tell({stage: 'settled', of: report.of});
  }, [report, user.id, user.friends, friends, potentialFriends]);

  const said = report.stage === 'quiet' || !arrived(user.friends, report.of) ? '' : friendsReport(report.of);

  const add = (event: ChangeEvent<HTMLSelectElement>) => {
    const chosen = users.find(({id}) => id === event.currentTarget.value);
    if (has(chosen)) tell({stage: 'asked', of: {change: 'added', friend: chosen}});
    onChange([...user.friends, event.currentTarget.value]);
  };

  const remove = (friend: User, at: number) => () => {
    tell({stage: 'asked', of: {change: 'removed', friend, at}});
    onChange(user.friends.filter(id => id !== friend.id));
  };

  return <fieldset className="friends-list shrinkable">
    <legend className="off-screen">friends of {fullNameOf(user)}</legend>
    <ul className="friends" aria-label="friends">{friends.map((friend, at) =>
      <li className="friend" key={friend.id}>
        <span className="friend-title ellipsis">{fullNameOf(friend)}</span>
        <button id={removeButtonId(user.id, friend.id)} className="remove" type="button"
          onClick={remove(friend, at)}>
          <img className="icon" src={cancelIcon} width="24" height="24"
            alt={`remove ${fullNameOf(friend)}`}/>
        </button>
      </li>
    )}</ul>
    {has(potentialFriends) &&
        <select id={addFriendId(user.id)} className="select-friend bare rounded-corners lifted pressable" value=""
          aria-label="Add a friend" onChange={add}>{[
            <option key="placeholder" value="" disabled hidden>Add a Friend</option>,
            ...potentialFriends.map(potentialFriend =>
              <option key={potentialFriend.id} value={potentialFriend.id}>{
                fullNameOf(potentialFriend)
              }</option>)
          ]}</select>}
    <output className="off-screen" aria-label="friends report">{said}</output>
  </fieldset>;
};
