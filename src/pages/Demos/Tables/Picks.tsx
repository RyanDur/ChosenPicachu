import {not} from '@ryandur/sand';
import {classNames, PropsWithClassName, useHydrated} from '@components';
import './Picks.css';

type Choice<T extends string> = {
  wording: string;
  value: T;
};

type Props<T extends string> = PropsWithClassName<{
  label: string;
  choices: readonly Choice<T>[];
  chosen: T;
  onPicked: (value: T) => void;
  size?: 'sub-title' | 'paragraph';
}>;

export const Picks = <T extends string>({
  label,
  className,
  choices,
  chosen,
  onPicked,
  size = 'sub-title'
}: Props<T>) => {
  const hydrated = useHydrated();
  return <fieldset className={classNames('picks', 'borderless', 'veiled-rule-below', className)}>
    <legend className="off-screen">{label}</legend>
    {choices.map(({wording, value}) =>
      <label key={value} className={classNames('pick', size, 'choice-underlined', 'focus-ringed')}>
        {wording}
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
