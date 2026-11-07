import {FC, PropsWithChildren, useMemo, useReducer} from 'react';
import {nothing} from '@ryandur/sand';
import {standingOf} from '@pages/Gallery/museums';
import {Wall, WallChange, Walls} from './walls';

const changed = (wall: Wall, change: WallChange): Wall => {
  switch (change.type) {
    case 'asked': return {reply: 'asked', standing: standingOf(wall)};
    case 'answered': return {reply: 'answered', answer: change.answer};
    case 'refused': return {reply: 'refused'};
    case 'abandoned': return {reply: 'unasked', standing: standingOf(wall)};
  }
};

export const GalleryContext: FC<PropsWithChildren> = ({children}) => {
  const [wall, dispatch] = useReducer(changed, {reply: 'unasked', standing: nothing()});
  return <Walls.Provider value={useMemo(() => ({wall, dispatch}), [wall])}>
    {children}
  </Walls.Provider>;
};
