import {ReactNode} from 'react';
import {PillGlider} from '@components/PillGlider';
import './Dial.css';

type Props<T extends string> = {
  label: string;
  name: string;
  options: readonly {display: ReactNode; value: T}[];
  chosen: T;
  onChosen: (value: T) => void;
  reading: string;
};

export const Dial = <T extends string>({label, reading, ...pills}: Props<T>) =>
  <li className="control">
    <span className="axis caption uppercase" aria-hidden>{label}</span>
    <PillGlider label={label} {...pills}/>
    <output className="reading paragraph">{reading}</output>
  </li>;
