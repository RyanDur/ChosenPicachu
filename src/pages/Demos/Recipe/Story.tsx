import {Children, FC, isValidElement, MouseEvent, PropsWithChildren, ReactNode, SyntheticEvent} from 'react';
import {maybe} from '@ryandur/sand';
import {storyKeys} from './storyKeys';
import {useOpenStories} from './useOpenStories';
import {useRanks} from './useRanks';
import {Steps} from './Steps';

const stepsIn = (children: ReactNode): number =>
  Children.toArray(children).reduce<number>((count, child) => {
    if (isValidElement<PropsWithChildren>(child)) {
      return child.type === Steps
        ? count + Children.toArray(child.props.children).filter(isValidElement).length
        : count + stepsIn(child.props.children);
    }
    return count;
  }, 0);

type Told = PropsWithChildren<{
  id: string;
  can: string;
  soThat: string;
}>;

type Props = Told & ({param: string; open?: never} | {param?: never; open?: boolean});

const StoryCard: FC<{titleId: string; can: string; soThat: string; steps: number}> = ({
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

const RecordedStory: FC<Told & {param: string}> = ({param, id, can, soThat, children}) => {
  const stories = useOpenStories(param);
  const titleId = storyKeys.anchorOf({param, id});
  const toggled = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    stories.toggle(id);
  };
  const matchAddressToFold = ({currentTarget}: SyntheticEvent<HTMLDetailsElement>) => {
    stories.setOpen(id, currentTarget.open);
  };
  return <li tabIndex={-1}>
    <details className="arc" open={stories.isOpen(id)} aria-labelledby={titleId} onToggle={matchAddressToFold}>
      <summary className="fold-bar sub-title-glyph-before" onClick={toggled}>
        <StoryCard titleId={titleId} can={can} soThat={soThat} steps={stepsIn(children)}/>
      </summary>
      {children}
    </details>
  </li>;
};

const OwnStory: FC<Told & {open?: boolean}> = ({id, open, can, soThat, children}) => {
  const titleId = `${id}-story`;
  return <li tabIndex={-1}>
    <details className="arc" open={open} aria-labelledby={titleId}>
      <summary className="fold-bar sub-title-glyph-before">
        <StoryCard titleId={titleId} can={can} soThat={soThat} steps={stepsIn(children)}/>
      </summary>
      {children}
    </details>
  </li>;
};

export const Story: FC<Props> = ({param, open, ...told}) => maybe(param).either(
  recordedIn => <RecordedStory param={recordedIn} {...told}/>,
  () => <OwnStory open={open} {...told}/>);
