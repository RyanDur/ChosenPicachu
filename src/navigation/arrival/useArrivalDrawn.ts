import {useLayoutEffect} from 'react';
import {useLocation} from 'react-router';
import {arrival} from './arrival';

export const useArrivalDrawn = (): void => {
  const location = useLocation();
  useLayoutEffect(() => arrival.drawn(location), [location]);
};
