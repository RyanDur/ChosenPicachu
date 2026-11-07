import {FC, PropsWithChildren, useMemo, useReducer} from 'react';
import {AllArt, museumReply} from '@pages/Gallery/museums';
import {Wall} from './wall';

export const GalleryContext: FC<PropsWithChildren> = ({children}) => {
  const [wall, dispatch] = useReducer(museumReply.reduce<AllArt>, museumReply.initial);
  return <Wall.Provider value={useMemo(() => ({wall, dispatch}), [wall])}>
    {children}
  </Wall.Provider>;
};
