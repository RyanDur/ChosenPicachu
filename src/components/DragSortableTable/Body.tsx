import {ComponentProps, FC} from 'react';
import {Body as BodyEventsContext, BodyEvents} from './context';

export const Body: FC<ComponentProps<'tbody'> & BodyEvents> = ({onRowMoved, children, ...tbody}) =>
  <BodyEventsContext.Provider value={{onRowMoved}}>
    <tbody {...tbody}>{children}</tbody>
  </BodyEventsContext.Provider>;
