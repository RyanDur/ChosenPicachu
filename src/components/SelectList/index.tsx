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
    const possibleFriends = users.filter(aUser => user !== aUser).filter(aUser => !user.friends.includes(aUser));
    const [friends, updateFriends] = useState<User[]>(user.friends);

    useEffect(() => onChange(friends), [friends]);

    const displayFullName = ({info}: User) => `${info.firstName} ${info.lastName}`;

    const add = (event: ChangeEvent<HTMLSelectElement>) => {
        maybe.of(users.find(({info}) => info.email === event.currentTarget.value))
            .map(friend => updateFriends([...friends, friend]));
        event.currentTarget.selectedIndex = 0;
    };

    const remove = (friend: User) => () =>
        updateFriends(friends.filter(newFriend => friend !== newFriend));

    const hasFriendsToChooseFrom = has(possibleFriends.filter(user => !friends.includes(user)));

    return <article className={join('friends-list', has(friends) && 'not-empty')}>
        <ul className="friends" data-testid="friends-list">{
            friends.map(friend =>
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
            ...possibleFriends.filter(friend => !friends.includes(friend)).map((user, index) =>
                <option key={user.info.email} value={user.info.email} data-testid={`friend-option-${index}`}>{
                    displayFullName(user)
                }</option>)
        ]}</select>}
    </article>;
};