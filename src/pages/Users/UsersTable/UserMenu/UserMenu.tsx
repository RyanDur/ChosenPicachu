import {Entry, Item, ItemLink, Menu} from '@components/Menu';
import {FC} from 'react';
import {maybe} from '@ryandur/sand';
import {User} from '@components/Users/UserInfo/user';
import {copyingAt, userAt} from '../../mode';

type Props = {
  user: User;
  name: string;
  onRemoved: () => void;
};

export const UserMenu: FC<Props> = ({user, name, onRemoved}) => {
  const id = `menu-${user.id}`;
  const dismissed = (): void => {
    maybe(document.getElementById(id)).map(menu => {
      if (menu.matches(':popover-open')) {
        menu.hidePopover();
      }
    });
  };

  return <>
    <button type="button" className="menu-toggle borderless field three-dotted rounded-corners raisable reachable"
      popoverTarget={id}
      aria-label={`Actions for ${name}`}/>
    <Menu id={id} tabIndex={-1} popover="auto" className="card rounded-corners lifted" aria-label={`Actions for ${name}, chosen`}>
      <Entry>
        <ItemLink to={userAt(user.id, 'view')}
          onClick={dismissed} className="sub-title">View</ItemLink>
      </Entry>
      <Entry>
        <ItemLink to={userAt(user.id, 'edit')}
          onClick={dismissed} className="sub-title">Edit</ItemLink>
      </Entry>
      <Entry>
        <Item className="sub-title"
          popoverTarget={id} popoverTargetAction="hide"
          onClick={onRemoved}>Remove</Item>
      </Entry>
      <Entry>
        <ItemLink to={copyingAt(user.id)}
          onClick={dismissed} className="sub-title">Clone</ItemLink>
      </Entry>
    </Menu>
  </>;
};
