import React, {FC, useEffect, useState} from 'react';
import {Consumer, has, maybe} from '@ryandur/sand';
import {UserInfo, User} from '../UserInfo/types';
import './fiends-list.scss';

interface Props {
    users: User[];
    onChange: Consumer<UserInfo[]>
    friends?: UserInfo[];
}

export const FriendsList: FC<Props> = ({users, onChange, friends = []}) => {
    const displayFullName = (user: { firstName: string, lastName: string }) => `${user.firstName} ${user.lastName}`;
    const [newFriends, updateFriends] = useState<UserInfo[]>(friends);

    useEffect(() => onChange(newFriends), [newFriends]);

    const remove = (friend: UserInfo) => () =>
        updateFriends(newFriends.filter(newFriend => friend !== newFriend));

    return <article className='friends-list'>
        <ul className="friends" data-testid="friends-list">{
            newFriends.map((friend) =>
                <li tabIndex={0} className="friend" key={friend.email} onKeyPress={event => {
                    event.preventDefault();
                    if (event.code === 'Enter') remove(friend)();
                }} onClick={remove(friend)} data-testid={friend.email}>
                    <label className="friend-title" htmlFor={friend.email}>{displayFullName(friend)}</label>
                    <img id={friend.email} className="remove"
                         src="https://img.icons8.com/material-outlined/24/000000/cancel--v1.png"
                         alt="remove"/>
                </li>
            )
        }</ul>
        {has(users.filter(({info}) => !newFriends.includes(info))) && <select className="select-friend" defaultValue="" onChange={event => {
            updateFriends([...newFriends, ...maybe.of(
                users.find(({info}) => info.email === event.currentTarget.value)
            ).map(({info}) => [info]).orElse([])]);
            event.currentTarget.selectedIndex = 0;
        }} data-testid="select-friend">{[
            <option key="placeholder" value="" disabled hidden>Select Friend</option>,
            ...users.filter(({info}) => !newFriends.includes(info)).map(({info}, index) =>
                <option key={info.email} value={info.email} data-testid={`friend-option-${index}`}>{
                    displayFullName(info)
                }</option>)
        ]}</select>}
    </article>;
};