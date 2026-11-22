import {FC, PropsWithChildren} from 'react';
import {classNames} from '@components';

export const PartDemo: FC<PropsWithChildren<{readonly className?: string}>> = ({className, children}) =>
  <section className={classNames('part-demo', className)}>{children}</section>;
