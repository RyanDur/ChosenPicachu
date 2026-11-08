import {ComponentProps, FC} from 'react';
import Handle from '@components/grip.svg';
import {survey} from './model';
import {useHydrated} from '@frame/page';
import './RowGrip.css';

export const RowGrip: FC<ComponentProps<'button'> & {position: number}> = ({position, ...button}) =>
  <button {...button}
    type="button"
    tabIndex={0}
    disabled={!useHydrated()}
    className="grip grabbable borderless unfilled focus-ringed"
    aria-label={survey.gripLabel(position)}>
    <Handle aria-hidden/>
  </button>;
