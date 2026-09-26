import {FC, PropsWithChildren, ReactNode} from 'react';
import {classNames} from '@components/class-names';
import './Fold.css';

type Props = {
  label: string;
  prompt: ReactNode;
  open?: boolean;
  className?: string;
};

export const Fold: FC<PropsWithChildren<Props>> = ({label, prompt, open, className, children}) =>
  <details className={classNames('fold', className)} open={open} aria-label={label}>
    <summary className="prompt">{prompt}</summary>
    {children}
  </details>;
