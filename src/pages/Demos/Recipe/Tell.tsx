import {FC, PropsWithChildren} from 'react';

export const Tell: FC<PropsWithChildren> = ({children}) =>
  <p className="approach paragraph">{children}</p>;
