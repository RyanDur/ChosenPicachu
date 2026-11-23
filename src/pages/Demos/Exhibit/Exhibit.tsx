import {FC, PropsWithChildren} from 'react';
import {Framed} from './Framed';

export const Exhibit: FC<PropsWithChildren<{name: string}>> = ({name, children}) =>
  <Framed caption="Exhibit" name={name}>{children}</Framed>;
