import {FC, PropsWithChildren} from 'react';

export const Attribution: FC<PropsWithChildren> = ({children}) =>
  <figcaption className="attribution caption">{children}</figcaption>;
