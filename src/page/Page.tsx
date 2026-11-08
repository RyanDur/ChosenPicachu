import {FC, PropsWithChildren, ReactNode} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components';

type PageProps = PropsWithChildren<{
  header: ReactNode;
  filters?: ReactNode;
  footer?: ReactNode;
  inView?: boolean;
}>;

export const Page: FC<PageProps> = ({header, filters, footer, inView = true, children}) => <>
  {header}
  {filters}
  <main className={classNames('app-main', 'field', inView && 'in-view')}>{children}</main>
  {has(footer) && <footer id="app-footer" className="app-footer stick-to-bottom field backdrop-above">{footer}</footer>}
</>;
