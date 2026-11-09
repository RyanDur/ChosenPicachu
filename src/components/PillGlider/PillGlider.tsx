import {useHydrated} from '../useHydrated';
import {not} from '@ryandur/sand';
import './PillGlider.css';

export type Choice<T extends string> = {
  words: string;
  value: T;
};

type Props<T extends string> = {
  label: string;
  name: string;
  choices: readonly Choice<T>[];
  chosen: T;
  onChosen: (value: T) => void;
};

export const PillGlider = <T extends string>({label, name, choices, chosen, onChosen}: Props<T>) => {
  const hydrated = useHydrated();
  return <fieldset className="pill-glider rounded-corners ringed hover-veiled">
    <legend className="off-screen">{label}</legend>
    {choices.map(({words, value}) =>
      <label className="pill rounded-corners reachable unfilled focus-haloed hover-inverse-ink choice-filled-before choice-inverse-ink"
        key={value}>
        {words}
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
