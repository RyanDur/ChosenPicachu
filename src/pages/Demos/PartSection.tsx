import {FC, PropsWithChildren} from 'react';
import {useThePart} from './useThePart';
import './PartPage.css';

export const PartSection: FC<PropsWithChildren> = ({children}) =>
  <section aria-labelledby={useThePart().headingId} className="part-page">{children}</section>;
