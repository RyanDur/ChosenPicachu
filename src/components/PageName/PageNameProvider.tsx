import {createContext, FC, PropsWithChildren, useContext, useEffect, useState} from 'react';

const unnamed = 'this page';

const PageName = createContext(unnamed);
const NamesThePage = createContext<(name: string) => void>(() => undefined);

export const PageNameProvider: FC<PropsWithChildren> = ({children}) => {
  const [name, setName] = useState(unnamed);
  return <NamesThePage.Provider value={setName}>
    <PageName.Provider value={name}>{children}</PageName.Provider>
  </NamesThePage.Provider>;
};

export const usePageName = (): string => useContext(PageName);

export const useNamingThePage = (name: string): void => {
  const names = useContext(NamesThePage);
  useEffect(() => names(name), [names, name]);
};
