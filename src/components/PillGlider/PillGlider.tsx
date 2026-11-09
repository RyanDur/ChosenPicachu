import {ReactNode} from 'react';
import {useHydrated} from '../useHydrated';
import {not} from '@ryandur/sand';
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

export const PillGlider = <T extends string>({label, name, options, chosen, onChosen}: Props<T>) => {
  const hydrated = useHydrated();
  return <fieldset className="pill-glider rounded-corners ringed hover-veiled">
    <legend className="off-screen">{label}</legend>
    {options.map(({display, value}) =>
      <label className="pill rounded-corners reachable unfilled focus-haloed hover-inverse-ink field-inverse-before"
        key={value}>
        <span className="choice-inverted-words">{display}</span>
        <input type="radio"
          className="off-screen"
          name={name}
          value={value}
          checked={chosen === value}
          disabled={not(hydrated)}
          onChange={() => onChosen(value)}/>
      </label>)}
  </fieldset>;
};
