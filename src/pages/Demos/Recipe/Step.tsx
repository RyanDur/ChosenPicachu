import {FC, PropsWithChildren, ReactNode} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';

type Props = PropsWithChildren<{
  title: string;
  dial?: ReactNode;
  id?: string;
}>;

export const Step: FC<Props> = ({title, dial, id, children}) =>
  <li className={classNames('step', has(dial) && 'tuned')} id={id}>
    <article className="step-body">
      <header className="step-heading">
        <h4 className="step-title">{title}</h4>
        {dial}
      </header>
      {children}
    </article>
  </li>;
