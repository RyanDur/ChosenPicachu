import {FC, PropsWithChildren} from 'react';
import {ExhibitRank} from './Exhibit';
import {PageWithParts} from './PageWithParts';
import {useThePart} from './useThePart';
import './PartPage.css';

export const PartSection: FC<PropsWithChildren> = ({children}) =>
  <section aria-labelledby={useThePart().headingId} className="part-page">
    <ExhibitRank.Provider value={3}>
      <PageWithParts>{children}</PageWithParts>
    </ExhibitRank.Provider>
  </section>;
