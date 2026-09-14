import {FC} from 'react';
import {ResizeHandle} from '@components/DragSortableTable/ResizeHandle';
import {SortMenu} from '@components/DragSortableTable/SortMenu';
import {age, formatAge, FriendsList, UserMenu} from '@components/Users';
import {Body, Cell, Column, DraggableColumn, DragSortableTable, Headers, Row, RowHeader} from '@components/DragSortableTable';
import {useUsersDispatch, useUsersSelector} from '../Provider';
import {friendsChanged, selectColumns, selectUsers, userRemoved} from '../store';
import {seated, worksFromHome} from '../columns';
import {columnMoved, rowMoved, sorted} from '@components/DragSortableTable/arrangement';
import '@components/DragSortableTable/sortable.css';

export const UsersTable: FC = () => {
  const dispatch = useUsersDispatch();
  const users = useUsersSelector(selectUsers);
  const columns = useUsersSelector(selectColumns);

  return <DragSortableTable id="users-table" className="fancy-table sortable apportioned hide animated" columns={columns} rows={seated(users)}>
    <thead className="header">
      <Headers className="row"
        onColumnMoved={({column, to}) => dispatch(columnMoved(column, to))}
        onSorted={({column, direction}) => dispatch(sorted(column, direction))}>
        <Column column="full-name" className="cell full-name header-cell">Full Name<ResizeHandle column="full-name"/></Column>
        <DraggableColumn column="home-city" className="cell home-city header-cell">Home City<ResizeHandle column="home-city"/></DraggableColumn>
        <DraggableColumn column="age" className="cell age header-cell">Age<SortMenu column="age"/><ResizeHandle column="age"/></DraggableColumn>
        <DraggableColumn column="friends" className="cell friends header-cell">Friends<ResizeHandle column="friends"/></DraggableColumn>
        <Column column="works-from-home" className="cell works-from-home header-cell">Works from Home<SortMenu column="works-from-home"/><ResizeHandle column="works-from-home"/></Column>
      </Headers>
    </thead>
    <Body className="body"
      onRowMoved={({row, to, standing}) => dispatch(rowMoved(row, to, standing))}>
      {users.map(user => {
        const name = `${user.info.firstName} ${user.info.lastName}`;
        return <Row key={user.id} row={user.id} className="row">
          <RowHeader column="full-name" row={user.id} className="cell row-header" label={name}/>
          <Cell column="home-city" row={user.id} className="cell">{user.homeAddress.city}</Cell>
          <Cell column="age" row={user.id} className="cell">{formatAge(age(user.info.dob))}</Cell>
          <Cell column="friends" row={user.id} className="cell">
            <FriendsList user={user} users={users} onChange={friends => dispatch(friendsChanged(user, friends))}/>
          </Cell>
          <Cell column="works-from-home" row={user.id} className="cell last-column">
            {worksFromHome(user)}
            <UserMenu user={user} name={name} onRemove={() => dispatch(userRemoved(user))}/>
          </Cell>
        </Row>;
      })}
    </Body>
  </DragSortableTable>;
};
