import {ComponentProps, FC} from 'react';
import Handle from '@components/grip.svg';
import {gripLabel} from './survey';
import './RowGrip.css';

export const RowGrip: FC<ComponentProps<'button'> & {position: number}> = ({position, ...button}) =>
  <button {...button}
    type="button"
    tabIndex={0}
    className="grip grabbable"
    aria-label={gripLabel(position)}>
    <Handle/>
  </button>;
