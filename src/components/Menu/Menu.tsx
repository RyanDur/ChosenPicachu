import {Children, FC, PropsWithChildren} from 'react';
import './Menu.css';

type Props = PropsWithChildren<{
  id: string;
}>;

export const Menu: FC<Props> = ({id, children}) =>
  <menu id={id} popover="auto" className="menu card rounded-corners lifted"
        onPointerDown={event => event.stopPropagation()}
        onMouseDown={event => event.stopPropagation()}>
    {Children.map(children, child => <li className="entry">{child}</li>)}
  </menu>;
