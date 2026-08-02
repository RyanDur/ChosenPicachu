import {ReactNode, useLayoutEffect, useRef, useState} from 'react';
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
  const pills = useRef(new Map<T, HTMLLabelElement>());
  const [geometry, setGeometry] = useState<Geometry>({left: 0, width: 0});

  useLayoutEffect(() => {
    const pill = pills.current.get(chosen);
    if (pill) {
      setGeometry({left: pill.offsetLeft, width: pill.offsetWidth});
    }
  }, [chosen]);

  return <fieldset className="pill-glider">
    <legend className="off-screen">{label}</legend>
    <article className="pills">
      <article className="glider"
               style={{width: `${geometry.width}px`, transform: `translateX(${geometry.left}px)`}}/>
      {options.map(({display, value}) =>
        <label className="pill"
               key={value}
               ref={pill => {
                 if (pill) {
                   pills.current.set(value, pill);
                 }
               }}>
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
