import {FC, PropsWithChildren, useContext} from 'react';
import {useRanks} from './useRanks';
import {StepName} from './StepName';

type Props = PropsWithChildren<{
  title: string;
}>;

export const StepHeading: FC<Props> = ({title, children}) => {
  const {step: Title} = useRanks();
  return <header className="step-heading">
    <Title className="sub-title" id={useContext(StepName)}>{title}</Title>
    {children}
  </header>;
};
