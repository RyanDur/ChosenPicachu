import {FC, PropsWithChildren} from 'react';
import {Framed} from './Framed';

export const SketchFrame: FC<PropsWithChildren<{name: string}>> = ({name, children}) =>
  <Framed kind="Sketch" name={name}>{children}</Framed>;
