import {FC, PropsWithChildren} from 'react';
import {classNames} from '@components';

export const PartDemo: FC<PropsWithChildren<{readonly wears?: string}>> = ({wears, children}) =>
  <section className={classNames('part-demo', wears)}>{children}</section>;
