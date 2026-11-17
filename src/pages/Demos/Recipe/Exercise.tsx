import {FC, PropsWithChildren} from 'react';

export const Exercise: FC<PropsWithChildren> = ({children}) =>
  <p className="verdict sub-title">{children}</p>;
