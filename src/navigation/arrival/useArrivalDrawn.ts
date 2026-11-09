import {useContext, useLayoutEffect} from 'react';
import {useLocation} from 'react-router';
import {ArrivalDrawn} from './ArrivalDrawn';

export const useArrivalDrawn = (): void => {
  const drawn = useContext(ArrivalDrawn);
  const location = useLocation();
  useLayoutEffect(() => drawn(location), [drawn, location]);
};
