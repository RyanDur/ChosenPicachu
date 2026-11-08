import {FC, PropsWithChildren, useState} from 'react';
import {openingFragment} from './openingFragment';

export const OpeningFragmentProvider: FC<PropsWithChildren> = ({children}) => {
  const [openingReached, setOpeningReached] = useState(false);
  return <openingFragment.Provider value={{openingReached, onOpeningReached: () => setOpeningReached(true)}}>
    {children}
  </openingFragment.Provider>;
};
