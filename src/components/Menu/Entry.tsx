import {ComponentProps, FC} from 'react';
import {classNames} from '@components';

export const Entry: FC<ComponentProps<'li'>> = ({className, ...li}) =>
  <li {...li} className={classNames('entry', className)}/>;
