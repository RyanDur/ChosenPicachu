import {ReactNode} from 'react';
import './PillGlider.css';

type Option<T extends string> = {
  display: ReactNode;
  value: T;
};

type Props<T extends string> = {
  label: string;
  name: string;
  options: readonly Option<T>[];
  chosen: T;
  onChosen: (value: T) => void;
};

export const PillGlider = <T extends string>({label, name, options, chosen, onChosen}: Props<T>) =>
  <fieldset className="pill-glider">
    <legend className="off-screen">{label}</legend>
    {options.map(({display, value}) =>
      <label className="pill"
        key={value}>
        {display}
        <input type="radio"
          className="off-screen"
          name={name}
          value={value}
          checked={chosen === value}
          onChange={() => onChosen(value)}/>
      </label>)}
  </fieldset>;
