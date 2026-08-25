import {FC} from 'react';
import {Link, useLocation} from 'react-router';
import * as schema from 'schemawax';
import {maybe} from '@ryandur/sand';
import {useSearchParamsObject} from '@components/search-params';
import {User} from '../UserInfo/types';

type Props = {
  user: User;
  name: string;
  onRemove: () => void;
};

export const UserMenu: FC<Props> = ({user, name, onRemove}) => {
  const {pathname: path} = useLocation();
  const {createSearchParams} = useSearchParamsObject({id: schema.string, mode: schema.string});
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
    <menu id={id} popover="auto" className="menu card rounded-corners lifted">
      <li className="entry">
        <Link to={`${path}${createSearchParams({id: user.id, mode: 'view'})}`}
              onClick={dismissed} className="item sub-title">View</Link>
      </li>
      <li className="entry">
        <Link to={`${path}${createSearchParams({id: user.id, mode: 'edit'})}`}
              onClick={dismissed} className="item sub-title">Edit</Link>
      </li>
      <li className="entry">
        <Link to={path} className="item sub-title"
              onClick={() => {
                dismissed();
                onRemove();
              }}>Remove</Link>
      </li>
      <li className="entry">
        <Link to={`${path}${createSearchParams({id: user.id})}`}
              onClick={dismissed} className="item sub-title">Clone</Link>
      </li>
    </menu>
  </>;
};
