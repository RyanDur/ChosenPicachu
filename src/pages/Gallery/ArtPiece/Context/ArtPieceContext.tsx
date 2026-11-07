import {FC, PropsWithChildren, useMemo, useReducer} from 'react';
import {Art, museumReply} from '@pages/Gallery/museums';
import {Easel} from './easel';

export const ArtPieceContext: FC<PropsWithChildren> = ({children}) => {
  const [easel, dispatch] = useReducer(museumReply.reduce<Art>, museumReply.initial);
  return <Easel.Provider value={useMemo(() => ({easel, dispatch}), [easel])}>
    {children}
  </Easel.Provider>;
};
