import {FC, PropsWithChildren, useMemo, useReducer} from 'react';
import {AllArt, museumReply} from '@pages/Gallery/museums';
import {Walls} from './walls';

export const GalleryContext: FC<PropsWithChildren> = ({children}) => {
  const [wall, dispatch] = useReducer(museumReply.reduce<AllArt>, museumReply.initial);
  return <Walls.Provider value={useMemo(() => ({wall, dispatch}), [wall])}>
    {children}
  </Walls.Provider>;
};
