import {FC, PropsWithChildren, ReactNode} from 'react';
import {join} from '@components/class-names';
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
            className={join('menu-toggle', 'rounded-corners', toggleClassName)}
            popoverTarget={id}
            onPointerDown={event => event.stopPropagation()}
            onMouseDown={event => event.stopPropagation()}
            aria-label={label}>{toggle}</button>
    <nav id={id} popover="auto" aria-label={label} className="menu rounded-corners"
         onPointerDown={event => event.stopPropagation()}
         onMouseDown={event => event.stopPropagation()}
         onClick={event => event.currentTarget.hidePopover?.()}>
      {children}
    </nav>
  </>;
