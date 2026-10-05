import {createContext, FC, PropsWithChildren, useContext, useState} from 'react';

type OpeningFragment = {readonly landed: boolean; readonly land: () => void};

const OpeningFragmentContext = createContext<OpeningFragment>({landed: false, land: () => undefined});

export const OpeningFragmentProvider: FC<PropsWithChildren> = ({children}) => {
  const [landed, setLanded] = useState(false);
  return <OpeningFragmentContext.Provider value={{landed, land: () => setLanded(true)}}>
    {children}
  </OpeningFragmentContext.Provider>;
};

export const useOpeningFragment = (): OpeningFragment => useContext(OpeningFragmentContext);
