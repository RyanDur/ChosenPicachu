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
            aria-label={label}>{toggle}</button>
    <nav id={id} popover="auto" className="menu rounded-corners"
         onClick={event => event.currentTarget.hidePopover?.()}>
      {children}
    </nav>
  </>;
