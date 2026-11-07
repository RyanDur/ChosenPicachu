import {FC, PropsWithChildren, useMemo, useReducer} from 'react';
import {Art, replies} from '@pages/Gallery/museums';
import {Easels} from './easels';

const easelReplies = replies<Art>();

export const ArtPieceContext: FC<PropsWithChildren> = ({children}) => {
  const [easel, dispatch] = useReducer(easelReplies.reduce, easelReplies.initial);
  return <Easels.Provider value={useMemo(() => ({easel, dispatch}), [easel])}>
    {children}
  </Easels.Provider>;
};
