import {Context, createContext} from 'react';
import {DataRouter, Location} from 'react-router';

type CurrentLocation = {
  Read: Context<() => Location>;
  of: (router: DataRouter) => () => Location;
};

const Read = createContext<() => Location>(() => {
  throw new Error('the current location is read from a router, and none provides it');
});

const of: CurrentLocation['of'] = router => () => router.state.location;

export const currentLocation: CurrentLocation = {Read, of};
