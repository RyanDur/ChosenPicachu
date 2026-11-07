import {FC, PropsWithChildren, useMemo, useReducer} from 'react';
import {Art, museumReply} from '@pages/Gallery/museums';
import {Easels} from './easels';

export const ArtPieceContext: FC<PropsWithChildren> = ({children}) => {
  const [easel, dispatch] = useReducer(museumReply.reduce<Art>, museumReply.initial);
  return <Easels.Provider value={useMemo(() => ({easel, dispatch}), [easel])}>
    {children}
  </Easels.Provider>;
};
