import {FC, ReactElement} from 'react';
import {User, age, formatAge, FriendsList, UserMenu} from '@components/Users';
import {
  Cell, Column, DraggableColumn, ResizeHandle, RowHeader, SortMenu, useStanding, useSelector
} from '@components/DragSortableTable/EagerHideAnimatedTable';
import {Values} from '@components/DragSortableTable/sorting';
import {has} from '@ryandur/sand';
import {equalAddresses} from './addresses';

export const columns = ['fullName', 'homeCity', 'age', 'friends', 'worksFromHome'];

export const worksFromHome = (user: User): string =>
  equalAddresses(user.homeAddress, user.workAddress) ? 'Yes' : 'No';

export const candidateValues = (user: User): Values => ({
  age: has(user.info.dob) ? -user.info.dob.getTime() : undefined,
  worksFromHome: worksFromHome(user)
});

type Props = {
  users: User[];
  onFriends: (user: User) => (friends: string[]) => void;
  onRemove: (user: User) => void;
};

export const CandidatesTable: FC<Props> = ({users, onFriends, onRemove}) => {
  const order = useSelector(state => state.order);
  const standing = useStanding();
  const headers: Record<string, ReactElement> = {
    fullName: <Column key="fullName" name="fullName" className="full-name">Full Name<ResizeHandle/></Column>,
    homeCity: <DraggableColumn key="homeCity" name="homeCity" className="home-city">Home City<ResizeHandle/></DraggableColumn>,
    age: <DraggableColumn key="age" name="age" className="age">Age<SortMenu/><ResizeHandle/></DraggableColumn>,
    friends: <DraggableColumn key="friends" name="friends" className="friends">Friends<ResizeHandle/></DraggableColumn>,
    worksFromHome: <Column key="worksFromHome" name="worksFromHome" className="works-from-home">Works from Home<SortMenu/><ResizeHandle/></Column>
  };

  return <table id="users-table" className="fancy-table sortable apportioned">
    <thead className="header">
    <tr className="row">{order.map(name => headers[name])}</tr>
    </thead>
    <tbody className="body">
    {standing.map(seat => {
      const user = users[seat];
      const name = `${user.info.firstName} ${user.info.lastName}`;
      const cells: Record<string, ReactElement> = {
        fullName: <RowHeader key="fullName" seat={seat} column="fullName">{name}</RowHeader>,
        homeCity: <Cell key="homeCity" seat={seat} column="homeCity">{user.homeAddress.city}</Cell>,
        age: <Cell key="age" seat={seat} column="age">{formatAge(age(user.info.dob))}</Cell>,
        friends: <Cell key="friends" seat={seat} column="friends">
          <FriendsList user={user} users={users} onChange={onFriends(user)}/>
        </Cell>,
        worksFromHome: <Cell key="worksFromHome" seat={seat} column="worksFromHome">
          <section className="last-column">
            {worksFromHome(user)}
            <UserMenu user={user} name={name} onRemove={() => onRemove(user)}/>
          </section>
        </Cell>
      };

      return <tr key={user.id} className="row">{order.map(column => cells[column])}</tr>;
    })}
    </tbody>
  </table>;
};
