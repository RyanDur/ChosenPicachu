import {ComponentProps, FC} from 'react';
import Handle from '@components/grip.svg';
import {grip} from './model';
import {useHydrated} from '../useHydrated';
import './RowGrip.css';

export const RowGrip: FC<ComponentProps<'button'> & {position: number}> = ({position, ...button}) =>
  <button {...button}
    type="button"
    tabIndex={0}
    disabled={!useHydrated()}
    className="grip grabbable borderless unfilled focus-ringed"
    aria-label={grip.label(position)}>
    <Handle aria-hidden/>
  </button>;
