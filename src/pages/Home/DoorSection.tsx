import {createContext, FC, PropsWithChildren} from 'react';
import {Maybe, nothing, some} from '@ryandur/sand';
import {Door, doorId} from '@pages/Record/moments/doors';

const noDoorSectionMounted: Maybe<Door> = nothing();

export const CurrentDoor = createContext<Maybe<Door>>(noDoorSectionMounted);

export const DoorSection: FC<PropsWithChildren<{door: Door}>> = ({door, children}) =>
  <section className="door trim-rule-above" aria-labelledby={doorId(door)}>
    <h2 className="door-title title" id={doorId(door)}>{door}</h2>
    <CurrentDoor.Provider value={some(door)}>{children}</CurrentDoor.Provider>
  </section>;
