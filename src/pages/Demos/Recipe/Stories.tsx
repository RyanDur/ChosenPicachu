import {FC, PropsWithChildren} from 'react';

export const Stories: FC<PropsWithChildren> = ({children}) =>
  <ol className="arcs">{children}</ol>;
