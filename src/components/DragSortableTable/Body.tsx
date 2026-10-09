import {ComponentProps, FC} from 'react';
import {classNames} from '@components/class-names';
import {Body as BodyEventsContext, BodyEvents} from './context';

export const Body: FC<ComponentProps<'tbody'> & BodyEvents> = ({onRowMoved, className, children, ...tbody}) =>
  <BodyEventsContext.Provider value={{onRowMoved}}>
    <tbody {...tbody} className={classNames('body', className)}>{children}</tbody>
  </BodyEventsContext.Provider>;
