import {FC, PropsWithChildren} from 'react';
import {classNames, PropsWithClassName} from '@components';
import './TabSidecar.css';

type Props = PropsWithClassName<PropsWithChildren<{label?: string}>>;

export const TabSidecar: FC<Props> = ({label, className, children}) =>
  <aside aria-label={label} className={classNames('tab-sidecar', className)}>{children}</aside>;
