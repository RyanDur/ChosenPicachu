import {FC} from 'react';

type Props = {
  onRemove: () => void;
};

export const Dismissal: FC<Props> = ({onRemove}) =>
  <button type="button" className="remove-chart" aria-label="remove chart" tabIndex={-1}
          onClick={onRemove}>×</button>;
