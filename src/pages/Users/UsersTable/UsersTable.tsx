import {FC} from 'react';
import {maybe} from '@ryandur/sand';
import {ResizeHandle} from '@components/DragSortableTable/ResizeHandle';
import {SortMenu} from '@components/DragSortableTable/SortMenu';
import {age, formatAge, FriendsList} from '@components/Users';
import {UserMenu} from './UserMenu';
import {
  Body,
  Cell,
  Column,
  DraggableColumn,
  DragSortableTable,
  Headers,
  Row,
  RowHeader
} from '@components/DragSortableTable';
import {useUsersDispatch, useUsersSelector} from '../Provider';
import {friendAdded, friendRemoved, selectColumns, selectUsers, userRemoved} from '../store';
import {seated, worksFromHome} from '../columns';
import {columnMoved, rowMoved, sorted} from '@components/DragSortableTable/arrangement';
import {fullNameOf} from '@components/Users/UserInfo/user';
import '@components/DragSortableTable/sortable.css';

export const UsersTable: FC = () => {
  const dispatch = useUsersDispatch();
  const users = useUsersSelector(selectUsers);
  const columns = useUsersSelector(selectColumns);

  return <DragSortableTable id="users-table" caption="User candidates" origin="hide" motion="animated" columns={columns} rows={seated(users)}>
    <thead>
      <Headers
        onColumnMoved={({column, to}) => dispatch(columnMoved(column, to))}
        onSorted={({column, direction}) => dispatch(sorted(column, direction))}>
        <Column column="full-name" className="full-name">Full Name<ResizeHandle column="full-name"/></Column>
        <DraggableColumn column="home-city" className="home-city">Home City<ResizeHandle column="home-city"/></DraggableColumn>
        <DraggableColumn column="age" className="age">Age<SortMenu column="age"/><ResizeHandle column="age"/></DraggableColumn>
        <DraggableColumn column="friends" className="friends">Friends<ResizeHandle column="friends"/></DraggableColumn>
        <Column column="works-from-home" className="works-from-home">Works from Home<SortMenu column="works-from-home"/><ResizeHandle column="works-from-home"/></Column>
      </Headers>
    </thead>
    <Body
      onRowMoved={({row, to, standing}) => dispatch(rowMoved(row, to, standing))}>
      {users.map(user => {
        const name = fullNameOf(user);
        return <Row key={user.id}>
          <RowHeader column="full-name" row={user.id} label={name}/>
          <Cell column="home-city" row={user.id}>{user.homeAddress.city}</Cell>
          <Cell column="age" row={user.id}>{maybe(user.info.dob).map(age).map(formatAge).orElse('')}</Cell>
          <Cell column="friends" row={user.id}>
            <FriendsList user={user} users={users}
              onFriendAdded={friend => dispatch(friendAdded(user.id, friend))}
              onFriendRemoved={friend => dispatch(friendRemoved(user.id, friend))}/>
          </Cell>
          <Cell column="works-from-home" row={user.id} className="last-column">
            {worksFromHome(user)}
            <UserMenu user={user} name={name} onRemoved={() => dispatch(userRemoved(user))}/>
          </Cell>
        </Row>;
      })}
    </Body>
  </DragSortableTable>;
};
