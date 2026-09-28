import {FC} from 'react';

type Props = {
  onRemoved: () => void;
};

export const Dismissal: FC<Props> = ({onRemoved}) =>
  <button type="button" className="remove-chart" aria-label="remove chart" tabIndex={-1}
    onClick={onRemoved}>×</button>;
