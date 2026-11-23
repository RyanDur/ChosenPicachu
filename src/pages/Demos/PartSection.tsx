import {FC, PropsWithChildren} from 'react';
import {PartsBeside} from './PartsBeside';
import {useThePart} from './useThePart';
import './PartPage.css';

export const PartSection: FC<PropsWithChildren> = ({children}) =>
  <section aria-labelledby={useThePart().headingId} className="part-page">
    <PartsBeside>{children}</PartsBeside>
  </section>;
