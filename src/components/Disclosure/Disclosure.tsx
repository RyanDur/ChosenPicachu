import {FC, PropsWithChildren, ReactNode} from 'react';
import {classNames} from '@components/class-names';
import './Disclosure.css';

type Props = {
  label: string;
  prompt: ReactNode;
  open?: boolean;
  className?: string;
};

export const Disclosure: FC<PropsWithChildren<Props>> = ({label, prompt, open, className, children}) =>
  <details className={classNames('disclosure', className)} open={open} aria-label={label}>
    <summary className="prompt">{prompt}</summary>
    {children}
  </details>;
