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
    const [friends, updateFriends] = useState<User[]>([]);
    const [potentialFriends, updatePotentialFriends] = useState<User[]>([]);

    useEffect(() => updateFriends(user.friends), [user.friends]);

    useEffect(() => updatePotentialFriends(users
        .filter(possibleFriend => user.id !== possibleFriend.id)
        .filter(possibleFriend => !friends.map(friend => friend.id).includes(possibleFriend.id))), [friends]);

    const displayFullName = ({info}: User) => `${info.firstName} ${info.lastName}`;

    const add = (event: ChangeEvent<HTMLSelectElement>) => {
        maybe.of(potentialFriends.find(user => user.id === event.currentTarget.value))
            .map(friend => onChange([...friends, friend]));
        event.currentTarget.selectedIndex = 0;
    };

    const remove = (friend: User) => onChange(friends.filter(newFriend => friend.id !== newFriend.id));

    return <article className={join('friends-list', has(friends) && 'not-empty')}>
        <ul className="friends" data-testid="friends-list">{friends.map(friend =>
            <li className="friend" key={friend.id} data-testid={friend.id}>
                <label className="friend-title ellipsis"
                       htmlFor={friend.id}>{displayFullName(friend)}</label>
                <img id={friend.id} className="remove"
                     src="https://img.icons8.com/material-outlined/24/000000/cancel--v1.png"
                     alt="remove"
                     tabIndex={0}
                     onKeyPress={event => {
                         event.preventDefault();
                         if (event.code === 'Enter') remove(friend);
                     }} onClick={() => remove(friend)} data-testid={`remove-${friend.id}`}/>
            </li>
        )}</ul>
        {has(potentialFriends) &&
        <select className="select-friend button" defaultValue=""
                onChange={add}
                data-testid="select-friend">{[
            <option key="placeholder" value="" disabled hidden>Add a Friend</option>,
            ...potentialFriends.map((potentialFriend, index) =>
                <option key={index} value={potentialFriend.id} data-testid={`friend-option-${index}`}>{
                    displayFullName(potentialFriend)
                }</option>)
        ]}</select>}
    </article>;
};