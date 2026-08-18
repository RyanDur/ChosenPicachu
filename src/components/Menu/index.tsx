import {Children, FC, PropsWithChildren, ReactNode} from 'react';
import {classNames} from '@components/class-names';
import './Menu.css';

type Props = PropsWithChildren<{
  id: string;
  label: string;
  toggle?: ReactNode;
  toggleClassName?: string;
}>;

export const Menu: FC<Props> = ({id, label, toggle, toggleClassName, children}) =>
  <>
    <button type="button"
            className={classNames('menu-toggle', 'rounded-corners', toggleClassName)}
            popoverTarget={id}
            onPointerDown={event => event.stopPropagation()}
            onMouseDown={event => event.stopPropagation()}
            aria-label={label}>{toggle}</button>
    <menu id={id} popover="auto" className="menu white rounded-corners drop-shadow"
          onPointerDown={event => event.stopPropagation()}
          onMouseDown={event => event.stopPropagation()}>
      {Children.map(children, child => <li className="entry">{child}</li>)}
    </menu>
  </>;
