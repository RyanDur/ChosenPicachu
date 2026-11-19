import {FC, PropsWithChildren} from 'react';
import {classNames} from '@components';
import './TabSidecar.css';

type Props = PropsWithChildren<{label: string; className?: string}>;

export const TabSidecar: FC<Props> = ({label, className, children}) =>
  <aside aria-label={label} className={classNames('tab-sidecar', className)}>{children}</aside>;
