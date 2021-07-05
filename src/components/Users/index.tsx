import React, {FC, useState} from 'react';
import {UserInfo} from '../UserInfo/types';
import {UserInformation} from '../UserInfo';
import {Table} from '../Table';
import {createRandomUsers} from '../../__tests__/util';
import './Users.css';

export const Users: FC = () => {
    const [users, updateNewUsers] = useState<UserInfo[]>(createRandomUsers());
    return <>
        <section id="user-info" className="card overhang gutter">
            <h2 className="title">User Information</h2>
            <UserInformation onAdd={user => updateNewUsers([user, ...users])}/>
        </section>

        <section id="users" className="card overhang gutter">
            <h2 className="title">Users</h2>
            <Table
                tableClassName="fancy-table home-table"
                theadClassName="header"
                trClassName="row"
                tbodyClassName="body"
                cellClassName="cell"
                columns={{
                    fullName: {display: 'Full Name', key: 'fullName'},
                    homeCity: {display: 'Home City', key: 'homeCity'},
                    worksFromHome: {display: 'Works from Home', key: 'worksFromHome'}
                }}
                rows={users.map(({user, homeAddress, workAddress}) => ({
                    fullName: {display: `${user.firstName} ${user.lastName}`},
                    homeCity: {display: homeAddress.city},
                    worksFromHome: {display: <section className="last-column">
                            {homeAddress === workAddress ? 'Yes' : 'No'}
                            <article tabIndex={0} className="menu card"/>
                    </section>}
                }))}
            />
        </section>
    </>;
};