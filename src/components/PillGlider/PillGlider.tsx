import {classNames, useHydrated} from '@components';
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
  wraps?: boolean;
};

export const PillGlider = <T extends string>({label, name, choices, chosen, onChosen, wraps = false}: Props<T>) => {
  const hydrated = useHydrated();
  return <fieldset key={String(hydrated)}
    className={classNames('pill-glider rounded-corners ringed hover-veiled choice-filled-before', wraps && 'wraps')}>
    <legend className="off-screen">{label}</legend>
    {choices.map(({words, value}) =>
      <label className="pill rounded-corners reachable unfilled focus-haloed hover-inverse-ink choice-inverse-ink choice-filled-without-anchors"
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
