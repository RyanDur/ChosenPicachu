import {ChangeEvent, ReactNode, useState} from 'react';
import {has} from '@ryandur/sand';
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

type Geometry = {
  left: number;
  width: number;
};

export const PillGlider = <T extends string>({label, name, options, chosen, onChoose}: Props<T>) => {
  const [geometry, setGeometry] = useState<Geometry>();

  const choose = (value: T) => (event: ChangeEvent<HTMLInputElement>): void => {
    const pill = event.currentTarget.closest('label');
    if (has(pill)) {
      setGeometry({left: pill.offsetLeft, width: pill.offsetWidth});
    }
    onChoose(value);
  };

  return <fieldset className="pill-glider">
    <legend className="off-screen">{label}</legend>
    <article className="pills">
      {has(geometry) &&
        <article className="glider"
                 style={{'--glider-width': `${geometry.width}px`, '--glider-x': `${geometry.left}px`}}/>}
      {options.map(({display, value}) =>
        <label className="pill"
               key={value}>
          {display}
          <input type="radio"
                 className="off-screen"
                 name={name}
                 value={value}
                 checked={chosen === value}
                 onChange={choose(value)}/>
        </label>)}
    </article>
  </fieldset>;
};
