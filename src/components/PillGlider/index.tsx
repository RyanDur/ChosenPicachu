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
  onChoose: (value: T) => void;
};

export const PillGlider = <T extends string>({label, name, options, chosen, onChoose}: Props<T>) => {
  const at = Math.max(options.findIndex(({value}) => value === chosen), 0);
  return <fieldset className="pill-glider">
    <legend className="off-screen">{label}</legend>
    <article className="pills">
      <article className="glider" style={{transform: `translateX(${at * 100}%)`}}/>
      {options.map(({display, value}) =>
        <label className="pill" key={value}>
          {display}
          <input type="radio"
                 className="off-screen"
                 name={name}
                 value={value}
                 checked={value === chosen}
                 onChange={() => onChoose(value)}/>
        </label>)}
    </article>
  </fieldset>;
};
