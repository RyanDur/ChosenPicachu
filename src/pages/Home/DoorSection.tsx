import {createContext, FC, PropsWithChildren} from 'react';
import {Door, doorId} from './door';

export const CurrentDoor = createContext<Door>('Structure');

export const DoorSection: FC<PropsWithChildren<{door: Door}>> = ({door, children}) =>
  <section className="door trim-rule-above" aria-labelledby={doorId(door)}>
    <h2 className="door-title title" id={doorId(door)}>{door}</h2>
    <CurrentDoor.Provider value={door}>{children}</CurrentDoor.Provider>
  </section>;
