import {ChangeEvent, FC} from 'react';
import {has, Maybe, maybe} from '@ryandur/sand';
import {profile, User} from '../profile';
import {Membership, memberships} from '../memberships';
import {usersActions} from '../usersActions';
import {usersSelectors} from '../usersSelectors';
import {useUsersDispatch} from '../useUsersDispatch';
import {useUsersSelector} from '../useUsersSelector';
import cancelIcon from '../../../assets/icons/cancel.svg?url';
import './friends-list.css';

const toldFor = (user: User, users: readonly User[], report: Maybe<Membership>): string =>
  report
    .mBind(membership => maybe(membership, asked => memberships.reached(user.friends, asked)))
    .mBind(membership => maybe(users.find(({id}) => id === membership.friendId))
      .map(friend => memberships.told(profile.fullName(friend), membership)))
    .orElse('');

const Friends: FC<{user: User}> = ({user}) => {
  const dispatch = useUsersDispatch();
  const users = useUsersSelector(usersSelectors.users);
  const report = useUsersSelector(usersSelectors.friendsReportOf(user.id));

  const friends = user.friends
    .flatMap(friendId => users.filter(({id}) => id === friendId));
  const potentialFriends = users
    .filter(candidate => candidate.id !== user.id)
    .filter(candidate => !user.friends.includes(candidate.id));

  const add = (event: ChangeEvent<HTMLSelectElement>) =>
    dispatch(usersActions.friendAdded(user.id, event.currentTarget.value));

  return <fieldset className="friends-list shrinkable">
    <legend className="off-screen">friends of {profile.fullName(user)}</legend>
    <ul className="friends" aria-label="friends">{friends.map(friend =>
      <li className="friend warmed" key={friend.id}>
        <span className="ellipsis">{profile.fullName(friend)}</span>
        <button className="remove borderless unfilled" type="button"
          onClick={() => dispatch(usersActions.friendRemoved(user.id, friend.id))}>
          <img className="icon" src={cancelIcon} width="24" height="24"
            alt={`remove ${profile.fullName(friend)}`}/>
        </button>
      </li>
    )}</ul>
    {has(potentialFriends) &&
        <select className="select-friend bare rounded-corners lifted pressable" value=""
          aria-label="Add a friend" onChange={add}>{[
            <option key="placeholder" value="" disabled hidden>Add a Friend</option>,
            ...potentialFriends.map(potentialFriend =>
              <option key={potentialFriend.id} value={potentialFriend.id}>{
                profile.fullName(potentialFriend)
              }</option>)
          ]}</select>}
    <output className="off-screen" aria-label="friends report">{toldFor(user, users, report)}</output>
  </fieldset>;
};

export const FriendsList: FC<{userId: string}> = ({userId}) =>
  useUsersSelector(usersSelectors.withId(userId)).map(user => <Friends key={user.id} user={user}/>).orNull();
