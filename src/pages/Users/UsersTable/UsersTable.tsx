import {FC} from 'react';
import {maybe} from '@ryandur/sand';
import {age} from '../age';
import {FriendsList} from '../FriendsList';
import {UserMenu} from './UserMenu';
import {
  Body, Cell, Column, DraggableColumn, DragSortable, Headers, ResizeHandle, Row, RowHeader, SortMenu, useDragSortable
} from '@components/DragSortableTable';
import {useUsersDispatch} from '../useUsersDispatch';
import {useUsersSelector} from '../useUsersSelector';
import {usersActions} from '../usersActions';
import {usersSelectors} from '../usersSelectors';
import {userColumns} from '../columns';
import {arrangements, tableReports, tableSelectors} from '@components/DragSortableTable/model';
import {profile} from '@pages/Users/profile';

export const UsersTable: FC = () => {
  const dispatch = useUsersDispatch();
  const users = useUsersSelector(usersSelectors.users);
  const columns = useUsersSelector(usersSelectors.columns);

  const sortable = useDragSortable(columns, userColumns.seated(users), {origin: 'hide', motion: 'animated'});

  return <DragSortable value={sortable}>
    <table id="users-table" className={sortable.className}>
      <caption className="off-screen">User candidates</caption>
      <thead>
        <Headers
          onColumnMoved={({column, to}) => dispatch(arrangements.columnMoved(column, to))}
          onSorted={({column, direction}) => dispatch(arrangements.sorted(column, direction))}>
          <Column column="full-name" className="full-name">Full Name<ResizeHandle column="full-name"/></Column>
          <DraggableColumn column="home-city" className="home-city">Home
            City<ResizeHandle column="home-city"/></DraggableColumn>
          <DraggableColumn column="age" className="age">Age<SortMenu column="age"/><ResizeHandle column="age"/></DraggableColumn>
          <DraggableColumn column="friends" className="friends">Friends<ResizeHandle column="friends"/></DraggableColumn>
          <Column column="works-from-home" className="works-from-home">Works from
            Home<SortMenu column="works-from-home"/><ResizeHandle column="works-from-home"/></Column>
        </Headers>
      </thead>
      <Body
        onRowMoved={({row, to, standing}) => dispatch(arrangements.rowMoved(row, to, standing))}>
        {users.map(user => {
          const name = profile.fullName(user);
          return <Row key={user.id}>
            <RowHeader column="full-name" row={user.id} label={name}/>
            <Cell column="home-city" row={user.id}>{user.homeAddress.city}</Cell>
            <Cell column="age" row={user.id}>{maybe(user.info.dob).map(age.of).map(age.worded).orElse('')}</Cell>
            <Cell column="friends" row={user.id}>
              <FriendsList user={user} users={users}
                onFriendAdded={friend => dispatch(usersActions.friendAdded(user.id, friend))}
                onFriendRemoved={friend => dispatch(usersActions.friendRemoved(user.id, friend))}/>
            </Cell>
            <Cell column="works-from-home" row={user.id} className="last-column">
              {userColumns.worksFromHome(user)}
              <UserMenu user={user} name={name} onRemoved={() => dispatch(usersActions.userRemoved(user))}/>
            </Cell>
          </Row>;
        })}
      </Body>
    </table>
    <output className="off-screen" htmlFor="users-table" aria-label="move report">{tableReports.of(tableSelectors.report(sortable))}</output>
  </DragSortable>;
};
