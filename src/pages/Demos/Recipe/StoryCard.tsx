import {Children, FC, isValidElement, PropsWithChildren, ReactNode} from 'react';
import {useRanks} from './useRanks';
import {Steps} from './Steps';

export type Told = PropsWithChildren<{
  param: string;
  id: string;
  can: string;
  soThat: string;
}>;

const stepsIn = (children: ReactNode): number =>
  Children.toArray(children).reduce<number>((count, child) => {
    if (isValidElement<PropsWithChildren>(child)) {
      return child.type === Steps
        ? count + Children.toArray(child.props.children).filter(isValidElement).length
        : count + stepsIn(child.props.children);
    }
    return count;
  }, 0);

export const StoryCard: FC<{titleId: string; can: string; soThat: string; body: ReactNode}> = ({
  titleId,
  can,
  soThat,
  body
}) => {
  const {story: Can} = useRanks();
  const steps = stepsIn(body);
  return <hgroup className="story card rounded-corners lifted">
    <Can className="can paragraph bold" id={titleId}>{can}</Can>
    <p className="so-that paragraph italic muted-ink">so that {soThat}</p>
    {steps > 0 && <p className="step-tally caption muted-ink">{steps === 1 ? '1 step' : `${steps} steps`}</p>}
  </hgroup>;
};
