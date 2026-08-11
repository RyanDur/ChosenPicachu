import {FC} from 'react';
import Handle from '@components/grip.svg';

type Props = {
  onArm: () => void;
};

export const Grip: FC<Props> = ({onArm}) =>
  <button type="button" className="chart-grip" aria-label="move chart" tabIndex={-1}
          onMouseDown={onArm}>
    <Handle/>
  </button>;
