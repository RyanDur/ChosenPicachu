import {ComponentProps, FC} from 'react';
import {classNames} from '@components/class-names';
import {BodyEvents, tableContexts} from './tableContexts';

export const Body: FC<ComponentProps<'tbody'> & BodyEvents> = ({onRowMoved, className, children, ...tbody}) =>
  <tableContexts.Body.Provider value={{onRowMoved}}>
    <tbody {...tbody} className={classNames('body', className)}>{children}</tbody>
  </tableContexts.Body.Provider>;
