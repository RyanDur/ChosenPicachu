import {FC, PropsWithChildren} from 'react';
import {ExhibitRank} from './Exhibit';
import {PartsBeside} from './PartsBeside';
import {useThePart} from './useThePart';
import './PartPage.css';

export const PartSection: FC<PropsWithChildren> = ({children}) =>
  <section aria-labelledby={useThePart().headingId} className="part-page">
    <ExhibitRank.Provider value={3}>
      <PartsBeside>{children}</PartsBeside>
    </ExhibitRank.Provider>
  </section>;
