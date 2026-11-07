import {FC, PropsWithChildren, useMemo, useReducer} from 'react';
import {AllArt, replies} from '@pages/Gallery/museums';
import {Walls} from './walls';

const wallReplies = replies<AllArt>();

export const GalleryContext: FC<PropsWithChildren> = ({children}) => {
  const [wall, dispatch] = useReducer(wallReplies.reduce, wallReplies.initial);
  return <Walls.Provider value={useMemo(() => ({wall, dispatch}), [wall])}>
    {children}
  </Walls.Provider>;
};
