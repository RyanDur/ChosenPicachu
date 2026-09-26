import {FC} from 'react';
import Handle from '@components/grip.svg';

type Props = {
  onPressed: () => void;
  onLetGo: () => void;
};

export const Grip: FC<Props> = ({onPressed, onLetGo}) =>
  <button type="button" className="chart-grip" aria-label="move chart" tabIndex={-1}
    onPointerDown={onPressed}
    onPointerUp={onLetGo}
    onPointerCancel={onLetGo}>
    <Handle/>
  </button>;
