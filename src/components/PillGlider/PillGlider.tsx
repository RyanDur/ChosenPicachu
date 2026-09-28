import {ReactNode} from 'react';
import './PillGlider.css';

type Option<T extends string> = {
  display: ReactNode;
  value: T;
};

type Chosen<T extends string> = {chosen: T; onChosen: (value: T) => void} | {defaultChosen: T};

type Props<T extends string> = Chosen<T> & {
  label: string;
  name: string;
  options: readonly Option<T>[];
};

const checkedFor = <T extends string>(choice: Chosen<T>, value: T) =>
  'chosen' in choice
    ? {checked: choice.chosen === value, onChange: () => choice.onChosen(value)}
    : {defaultChecked: choice.defaultChosen === value};

export const PillGlider = <T extends string>({label, name, options, ...choice}: Props<T>) =>
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
          {...checkedFor(choice, value)}/>
      </label>)}
  </fieldset>;
