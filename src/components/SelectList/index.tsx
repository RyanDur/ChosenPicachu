import React, {FC, useEffect, useState} from 'react';
import {Consumer, maybe} from '@ryandur/sand';
import {User, UserInfo} from '../UserInfo/types';
import './fiends-list.scss';

interface Props {
    users: UserInfo[];
    friends?: User[];
    onChange: Consumer<User[]>
}

export const FriendsList: FC<Props> = ({users, friends = [], onChange}) => {
    const displayFullName = (user: { firstName: string, lastName: string }) => `${user.firstName} ${user.lastName}`;
    const [newFriends, updateFriends] = useState<User[]>(friends);

    useEffect(() => onChange(newFriends), [newFriends]);

    const remove = (friend: User) => () =>
        updateFriends(newFriends.filter(newFriend => friend !== newFriend));

    return <article>
        <ul className="friends-list" data-testid="friends-list">{
            newFriends.map(friend =>
                <li className="friend" key={friend.email} data-testid={friend.email}>
                    <label htmlFor={friend.email}>{displayFullName(friend)}</label>
                    <button id={friend.email} className="remove" onClick={remove(friend)}
                            data-testid={`remove-${friend.email}`}>
                        <img src="https://img.icons8.com/material-outlined/24/000000/cancel--v1.png"
                             alt="remove"/>
                    </button>
                </li>
            )
        }</ul>
        <select data-testid="select-friend" defaultValue="" onChange={event => {
            updateFriends([...newFriends, ...maybe.of(
                users.find(({user}) => user.email === event.currentTarget.value)
            ).map(({user}) => [user]).orElse([])]);
            event.currentTarget.selectedIndex = 0;
        }}>{[
            <option key="placeholder" value="" disabled hidden>Select Friend</option>,
            ...users.filter(({user}) => !newFriends.includes(user)).map(({user}, index) =>
                <option key={user.email} value={user.email} data-testid={`friend-option-${index}`}>{
                    displayFullName(user)
                }</option>)
        ]}</select>
    </article>;
};