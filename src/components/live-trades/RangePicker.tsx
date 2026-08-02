import {FC} from 'react';
import {DateRange} from './period';

type Props = {
  value: DateRange | null;
  onPick: (range: DateRange) => void;
};

export const RangePicker: FC<Props> = ({value, onPick}) => {
  const from = value?.from ?? '';
  const to = value?.to ?? '';
  return <fieldset className="range-picker">
    <label>from
      <input type="date" value={from}
             onChange={event => onPick({from: event.target.value, to: to === '' ? event.target.value : to})}/>
    </label>
    <label>to
      <input type="date" value={to}
             onChange={event => onPick({from: from === '' ? event.target.value : from, to: event.target.value})}/>
    </label>
  </fieldset>;
};
