import {classNames} from '@components/class-names';
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
  <fieldset className={classNames('picks', className)}>
    <legend className="off-screen">{label}</legend>
    {options.map(({display, value}) =>
      <label key={value} className="pick">
        {display}
        <input type="radio"
          className="off-screen"
          name={label}
          value={value}
          checked={chosen === value}
          onChange={() => onPick(value)}/>
      </label>)}
  </fieldset>;
