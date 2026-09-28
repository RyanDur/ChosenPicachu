import {FC} from 'react';
import Handle from '@components/grip.svg';

type Props = {
  onPressed: () => void;
  onReleased: () => void;
};

export const Grip: FC<Props> = ({onPressed, onReleased}) =>
  <button type="button" className="chart-grip" aria-label="move chart" tabIndex={-1}
    onPointerDown={onPressed}
    onPointerUp={onReleased}
    onPointerCancel={onReleased}>
    <Handle/>
  </button>;
