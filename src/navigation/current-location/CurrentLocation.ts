import {createContext} from 'react';
import {Location} from 'react-router';

export const CurrentLocation = createContext<() => Location>(() => {
  throw new Error('the current location is read from a router, and none provides it');
});
