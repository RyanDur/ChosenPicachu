import {ChangeEvent, FC, useEffect, useState} from 'react';
import {User} from '@components/Users/UserInfo/user';
import {classNames} from '@components/class-names';
import {Consumer, has} from '@ryandur/sand';
import {addFriendId, arrived, friendsReport, fullNameOf, Membership, placeAfterRemoval, removeButtonId} from './report';
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

export const FriendsList: FC<Props> = ({users, user, onChange}) => {
  const [report, tell] = useState<Report>({stage: 'quiet'});
  const friends = user.friends
    .flatMap(friendId => users.filter(({id}) => id === friendId));
  const potentialFriends = users
    .filter(candidate => candidate.id !== user.id)
    .filter(candidate => !user.friends.includes(candidate.id));

  useEffect(() => {
    if (report.stage !== 'asked' || !arrived(user.friends, report.of)) return;
    if (report.of.change === 'removed') {
      document.getElementById(placeAfterRemoval(user.id, friends, report.of.at))?.focus();
    }
    tell({stage: 'settled', of: report.of});
  }, [report, user.id, user.friends, friends]);

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

  return <fieldset className={classNames('friends-list', 'shrinkable', has(friends) && 'not-empty')}>
    <legend className="off-screen">friends of {fullNameOf(user)}</legend>
    <ul className="friends" aria-label="friends">{friends.map((friend, at) =>
      <li className="friend" key={friend.id}>
        <label className="friend-title ellipsis"
          htmlFor={removeButtonId(user.id, friend.id)}>{fullNameOf(friend)}</label>
        <button id={removeButtonId(user.id, friend.id)} className="remove" type="button"
          onClick={remove(friend, at)}>
          <img className="icon" src={cancelIcon} width="24" height="24"
            alt="remove"/>
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
