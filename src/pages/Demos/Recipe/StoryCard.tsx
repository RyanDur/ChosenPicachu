import {FC, PropsWithChildren} from 'react';
import {useRanks} from './useRanks';

export type Told = PropsWithChildren<{
  param: string;
  id: string;
  can: string;
  soThat: string;
}>;

export const StoryCard: FC<{titleId: string; can: string; soThat: string; steps: number}> = ({
  titleId,
  can,
  soThat,
  steps
}) => {
  const {story: Can} = useRanks();
  return <hgroup className="story card rounded-corners lifted">
    <Can className="can paragraph bold" id={titleId}>{can}</Can>
    <p className="so-that paragraph italic muted-ink">so that {soThat}</p>
    {steps > 0 && <p className="step-tally caption muted-ink">{steps === 1 ? '1 step' : `${steps} steps`}</p>}
  </hgroup>;
};
