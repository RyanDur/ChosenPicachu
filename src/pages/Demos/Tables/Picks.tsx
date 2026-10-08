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
  onPicked: (value: T) => void;
  size?: 'sub-title' | 'paragraph';
};

export const Picks = <T extends string>({label, className, options, chosen, onPicked, size = 'sub-title'}: Props<T>) =>
  <fieldset className={classNames('picks', 'borderless', 'veiled-rule-below', className)}>
    <legend className="off-screen">{label}</legend>
    {options.map(({display, value}) =>
      <label key={value} className={classNames('pick', size, 'choice-underlined', 'focus-ringed')}>
        {display}
        <input type="radio"
          className="off-screen"
          name={label}
          value={value}
          checked={chosen === value}
          onChange={() => onPicked(value)}/>
      </label>)}
  </fieldset>;
