import {not} from '@ryandur/sand';
import {classNames, PropsWithClassName, useHydrated} from '@components';
import {Choice} from '@components/PillGlider';
import './Picks.css';

type Props<T extends string> = PropsWithClassName<{
  label: string;
  choices: readonly Choice<T>[];
  chosen: T;
  onPicked: (value: T) => void;
  scale?: 'sub-title' | 'paragraph';
}>;

export const Picks = <T extends string>({
  label,
  className,
  choices,
  chosen,
  onPicked,
  scale = 'sub-title'
}: Props<T>) => {
  const hydrated = useHydrated();
  return <fieldset className={classNames('picks', 'borderless', 'veiled-rule-below', className)}>
    <legend className="off-screen">{label}</legend>
    {choices.map(({words, value}) =>
      <label key={value} className={classNames('pick', scale, 'choice-underlined', 'focus-ringed')}>
        {words}
        <input type="radio"
          className="off-screen"
          name={label}
          value={value}
          checked={chosen === value}
          disabled={not(hydrated)}
          onChange={() => onPicked(value)}/>
      </label>)}
  </fieldset>;
};
