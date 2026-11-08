import {Entry, Item, ItemLink, Menu} from '@components/Menu';
import {FC, MouseEvent} from 'react';
import {maybe} from '@ryandur/sand';
import {User} from '@pages/Users/profile';
import {openings} from '../../openings';

type Props = {
  user: User;
  name: string;
  onRemoved: () => void;
};

export const UserMenu: FC<Props> = ({user, name, onRemoved}) => {
  const id = `menu-${user.id}`;
  const dismissed = ({currentTarget: followed}: MouseEvent<HTMLAnchorElement>): void => {
    maybe(followed.closest<HTMLElement>(':popover-open')).map(menu => menu.hidePopover());
  };

  return <>
    <button type="button" className="menu-toggle borderless field three-dotted rounded-corners raisable reachable"
      popoverTarget={id}
      aria-label={`Actions for ${name}`}/>
    <Menu id={id} tabIndex={-1} popover="auto" className="card rounded-corners lifted" aria-label={`Actions for ${name}, chosen`}>
      <Entry>
        <ItemLink to={openings.at(user.id, 'view')}
          onClick={dismissed} className="sub-title">View</ItemLink>
      </Entry>
      <Entry>
        <ItemLink to={openings.at(user.id, 'edit')}
          onClick={dismissed} className="sub-title">Edit</ItemLink>
      </Entry>
      <Entry>
        <Item className="sub-title"
          popoverTarget={id} popoverTargetAction="hide"
          onClick={onRemoved}>Remove</Item>
      </Entry>
      <Entry>
        <ItemLink to={openings.copying(user.id)}
          onClick={dismissed} className="sub-title">Clone</ItemLink>
      </Entry>
    </Menu>
  </>;
};
