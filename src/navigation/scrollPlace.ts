import {Location} from 'react-router';

type ScrollPlace = {
  named: (location: Location) => string;
};

// the router keys every entry opened by its address 'default', so those entries would all share one scroll place
const named = ({key, pathname, search}: Location): string => key === 'default' ? pathname + search : key;

export const scrollPlace: ScrollPlace = {named};
