import React, {ChangeEvent, FC, useEffect, useState} from 'react';
import {Consumer, has, maybe} from '@ryandur/sand';
import {User} from '../UserInfo/types';
import './fiends-list.scss';
import {join} from '../util';

interface Props {
    users: User[];
    user: User;
    onChange: Consumer<User[]>
}

export const FriendsList: FC<Props> = ({users, user, onChange}) => {
    const displayFullName = ({info}: User) => `${info.firstName} ${info.lastName}`;
    const [newFriends, updateFriends] = useState<User[]>(user.friends);

    useEffect(() => onChange(newFriends), [newFriends]);

    const remove = (friend: User) => () =>
        updateFriends(newFriends.filter(newFriend => friend !== newFriend));

    const hasFriendsToChooseFrom = has(users.filter(user => !newFriends.includes(user)));

    const add = (event: ChangeEvent<HTMLSelectElement>) => {
        maybe.of(users.find(({info}) => info.email === event.currentTarget.value))
            .map(friend => updateFriends([...newFriends, friend]));
        event.currentTarget.selectedIndex = 0;
    };
    return <article className={join('friends-list', has(newFriends) && 'not-empty')}>
        <ul className="friends" data-testid="friends-list">{
            newFriends.map(friend =>
                <li className="friend" key={friend.info.email} data-testid={friend.info.email}>
                    <label className="friend-title ellipsis"
                           htmlFor={friend.info.email}>{displayFullName(friend)}</label>
                    <img id={friend.info.email} className="remove"
                         src="https://img.icons8.com/material-outlined/24/000000/cancel--v1.png"
                         alt="remove"
                         tabIndex={0}
                         onKeyPress={event => {
                             event.preventDefault();
                             if (event.code === 'Enter') remove(friend)();
                         }} onClick={remove(friend)} data-testid={`remove-${friend.info.email}`}/>
                </li>
            )
        }</ul>
        {hasFriendsToChooseFrom &&
        <select className="select-friend button" defaultValue="" onChange={add} data-testid="select-friend">{[
            <option key="placeholder" value="" disabled hidden>Add a Friend</option>,
            ...users.filter(aUser => user !== aUser).filter(aUser => !newFriends.includes(aUser)).map((user, index) =>
                <option key={user.info.email} value={user.info.email} data-testid={`friend-option-${index}`}>{
                    displayFullName(user)
                }</option>)
        ]}</select>}
    </article>;
};