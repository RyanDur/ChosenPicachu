import {FC, PropsWithChildren, ReactNode} from 'react';
import {classNames} from '../classNames';
import './Disclosure.css';

type Props = {
  label: string;
  prompt: ReactNode;
  className?: string;
};

export const Disclosure: FC<PropsWithChildren<Props>> = ({label, prompt, className, children}) =>
  <details className={classNames('disclosure', className)} aria-label={label}>
    <summary className="prompt">{prompt}</summary>
    {children}
  </details>;
