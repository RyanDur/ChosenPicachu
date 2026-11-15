import {FC, PropsWithChildren} from 'react';
import {classNames} from '../classNames';
import './Disclosure.css';

type Props = {
  label: string;
  className?: string;
};

export const Disclosure: FC<PropsWithChildren<Props>> = ({label, className, children}) =>
  <details className={classNames('disclosure', className)} aria-label={label}>
    {children}
  </details>;
