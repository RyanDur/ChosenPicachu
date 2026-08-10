import {FC, PropsWithChildren} from 'react';

export const Says: FC<PropsWithChildren> = ({children}) =>
  <p className="step-says">{children}</p>;
