import {join} from '@components/class-names';
import './Picks.css';

type Option<T extends string> = {
  display: string;
  value: T;
};

type Props<T extends string> = {
  label: string;
  className?: string;
  options: readonly Option<T>[];
  chosen: T;
  onPick: (value: T) => void;
};

export const Picks = <T extends string>({label, className, options, chosen, onPick}: Props<T>) =>
  <nav className={join('picks', className)} aria-label={label}>
    {options.map(({display, value}) =>
      <button type="button"
              key={value}
              className={join('pick', chosen === value && 'current')}
              aria-pressed={chosen === value}
              onClick={() => onPick(value)}>{display}</button>)}
  </nav>;
