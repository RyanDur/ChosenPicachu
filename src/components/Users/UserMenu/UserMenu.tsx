import {FC} from 'react';
import {Link} from 'react-router';
import {maybe} from '@ryandur/sand';
import {copyingAt, userAt} from '@pages/Users/mode';
import {User} from '../UserInfo/user';

type Props = {
  user: User;
  name: string;
  onRemove: () => void;
};

export const UserMenu: FC<Props> = ({user, name, onRemove}) => {
  const id = `menu-${user.id}`;
  const dismissed = (): void => {
    maybe(document.getElementById(id)).map(menu => {
      if (menu.matches(':popover-open')) {
        menu.hidePopover();
      }
    });
  };

  return <>
    <button type="button" className="menu-toggle rounded-corners raisable"
      popoverTarget={id}
      aria-label={`Actions for ${name}`}/>
    <menu id={id} tabIndex={-1} popover="auto" className="menu card rounded-corners lifted" aria-label={`Actions for ${name}, chosen`}>
      <li className="entry">
        <Link to={userAt(user.id, 'view')}
          onClick={dismissed} className="item sub-title">View</Link>
      </li>
      <li className="entry">
        <Link to={userAt(user.id, 'edit')}
          onClick={dismissed} className="item sub-title">Edit</Link>
      </li>
      <li className="entry">
        <button type="button" className="item sub-title"
          popoverTarget={id} popoverTargetAction="hide"
          onClick={onRemove}>Remove</button>
      </li>
      <li className="entry">
        <Link to={copyingAt(user.id)}
          onClick={dismissed} className="item sub-title">Clone</Link>
      </li>
    </menu>
  </>;
};
