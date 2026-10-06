import {createContext, FC, PropsWithChildren, useContext, useState} from 'react';

type OpeningFragment = {readonly landed: boolean; readonly onOpeningReached: () => void};

const noProviderMounted: OpeningFragment = {landed: false, onOpeningReached: () => undefined};

const OpeningFragmentContext = createContext<OpeningFragment>(noProviderMounted);

export const OpeningFragmentProvider: FC<PropsWithChildren> = ({children}) => {
  const [landed, setLanded] = useState(false);
  return <OpeningFragmentContext.Provider value={{landed, onOpeningReached: () => setLanded(true)}}>
    {children}
  </OpeningFragmentContext.Provider>;
};

export const useOpeningFragment = (): OpeningFragment => useContext(OpeningFragmentContext);
