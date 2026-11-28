import {FC, PropsWithChildren} from 'react';

export const Piece: FC<PropsWithChildren> = ({children}) =>
  <li className="piece muted-rule-above">{children}</li>;
