import {FC, PropsWithChildren} from 'react';
import {useRanks} from './useRanks';

type Props = PropsWithChildren<{
  title: string;
}>;

export const StepHeading: FC<Props> = ({title, children}) => {
  const {step: Title} = useRanks();
  return <header className="step-heading">
    <Title className="sub-title">{title}</Title>
    {children}
  </header>;
};
