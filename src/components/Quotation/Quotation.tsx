import {FC, PropsWithChildren} from 'react';
import './Quotation.css';

export const Quotation: FC<PropsWithChildren> = ({children}) =>
  <figure className="quotation">{children}</figure>;
