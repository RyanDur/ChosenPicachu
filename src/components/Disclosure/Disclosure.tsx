import {FC, PropsWithChildren, ReactNode, useState} from 'react';
import {classNames} from '@components/class-names';
import './Disclosure.css';

type Props = {
  label: string;
  prompt: ReactNode;
  startsOpen?: boolean;
  className?: string;
};

export const Disclosure: FC<PropsWithChildren<Props>> = ({label, prompt, startsOpen, className, children}) => {
  const [open] = useState(startsOpen);
  return <details className={classNames('disclosure', className)} open={open} aria-label={label}>
    <summary className="prompt">{prompt}</summary>
    {children}
  </details>;
};
