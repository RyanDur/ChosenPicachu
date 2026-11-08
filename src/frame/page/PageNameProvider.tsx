import {FC, PropsWithChildren, useState} from 'react';
import {pageNaming} from './pageNaming';

export const PageNameProvider: FC<PropsWithChildren> = ({children}) => {
  const [name, setName] = useState(pageNaming.unnamed);
  return <pageNaming.Namer.Provider value={setName}>
    <pageNaming.Name.Provider value={name}>{children}</pageNaming.Name.Provider>
  </pageNaming.Namer.Provider>;
};
