import {createContext, FC, PropsWithChildren, useContext, useState} from 'react';

type OpeningFragment = {readonly openingReached: boolean; readonly onOpeningReached: () => void};

const noProviderMounted: OpeningFragment = {openingReached: false, onOpeningReached: () => undefined};

const OpeningFragmentContext = createContext<OpeningFragment>(noProviderMounted);

export const OpeningFragmentProvider: FC<PropsWithChildren> = ({children}) => {
  const [openingReached, setOpeningReached] = useState(false);
  return <OpeningFragmentContext.Provider value={{openingReached, onOpeningReached: () => setOpeningReached(true)}}>
    {children}
  </OpeningFragmentContext.Provider>;
};

export const useOpeningFragment = (): OpeningFragment => useContext(OpeningFragmentContext);
