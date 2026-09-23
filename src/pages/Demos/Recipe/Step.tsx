import {FC, PropsWithChildren, ReactNode} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {useRanks} from './ranks';

type Props = PropsWithChildren<{
  title: string;
  dial?: ReactNode;
  id?: string;
}>;

export const Step: FC<Props> = ({title, dial, id, children}) => {
  const {step: Title} = useRanks();
  return <li className={classNames('step', has(dial) && 'tuned')} id={id}>
    <article className="step-body">
      <header className="step-heading">
        <Title className="step-title">{title}</Title>
        {dial}
      </header>
      {children}
    </article>
  </li>;
};
