import {FC, PropsWithChildren, useEffect, useReducer} from 'react';
import {art, museums} from '@pages/Gallery/museums';
import {doors} from '@pages/Gallery/doors';
import {KnownDoors} from '@pages/Gallery/Context';

export const MuseumDoors: FC<PropsWithChildren> = ({children}) => {
  const [known, dispatch] = useReducer(doors.reduce, doors.initial);

  useEffect(() => {
    const asked = museums.all.map(({param}) => art.open(param)
      .onComplete(answer => dispatch(doors.answered(param, answer.orElse('closed')))));
    return () => asked.forEach(asked => asked.cancel());
  }, []);

  return <KnownDoors.Provider value={known}>{children}</KnownDoors.Provider>;
};
