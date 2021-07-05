import {FC, useState} from 'react';
import {UserInfo} from '../UserInfo/types';
import {UserInformation} from '../UserInfo';
import {Table} from '../Table';

export const Users: FC = () => {
    const [newUsers, updateNewUsers] = useState<UserInfo[]>([]);
    return <>
        <section id="user-info-page" className="card overhang gutter">
            <UserInformation onAdd={user => updateNewUsers([...newUsers, user])}/>
        </section>

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
            rows={newUsers.map(({user, homeAddress, workAddress}) => ({
                fullName: {display: `${user.firstName} ${user.lastName}`},
                homeCity: {display: homeAddress.city},
                worksFromHome: {display: homeAddress === workAddress ? 'Yes' : 'No'}
            }))}
        />
    </>;
};