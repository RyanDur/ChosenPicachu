import {FC, PropsWithChildren, ReactNode} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Feedback} from '@components/Feedback';
import {SideNav} from './SideNav';

type PageProps = PropsWithChildren<{
  header: ReactNode;
  filters?: ReactNode;
  footer?: ReactNode;
  inView?: boolean;
  pageUnknown?: boolean;
}>;

export const Page: FC<PageProps> = ({header, filters, footer, inView = true, pageUnknown, children}) => <>
  {header}
  <section className="rail backdrop backdrop-below" aria-label="pages and feedback">
    <SideNav pageUnknown={pageUnknown}/>
    <Feedback/>
  </section>
  {filters}
  <main className={classNames('app-main', 'field', inView && 'in-view')}>{children}</main>
  {has(footer) && <footer id="app-footer" className="app-footer stick-to-bottom field backdrop-above">{footer}</footer>}
</>;
