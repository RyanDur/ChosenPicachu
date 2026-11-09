import {Location} from 'react-router';
import * as schema from 'schemawax';
import {Maybe, maybe, not} from '@ryandur/sand';

type KeptPlace = {place: string};

type ScrollPlace = {
  of: (location: Location) => string;
  keptFrom: (location: Location) => KeptPlace;
  keeps: (location: Location) => boolean;
};

const keptPlace: schema.Decoder<KeptPlace> = schema.object({required: {place: schema.string}});

// the router keys every entry opened by its address 'default', so those entries would all share one scroll place
const ownPlaceOf = ({key, pathname, search}: Location): string => key === 'default' ? pathname + search : key;

const placeKeptIn = ({state}: Location): Maybe<string> => maybe(keptPlace.decode(state)).map(({place}) => place);

const of = (location: Location): string => placeKeptIn(location).orElse(ownPlaceOf(location));

const keptFrom = (location: Location): KeptPlace => ({place: of(location)});

const keeps = (location: Location): boolean => not(placeKeptIn(location).isNothing);

export const scrollPlace: ScrollPlace = {of, keptFrom, keeps};
