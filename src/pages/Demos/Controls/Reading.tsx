import {FC, PropsWithChildren} from 'react';
import './DialRow.css';

export const Reading: FC<PropsWithChildren> = ({children}) =>
  <output className="reading paragraph">{children}</output>;
