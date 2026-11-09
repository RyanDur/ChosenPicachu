import {Children, FC, MouseEvent, PropsWithChildren, ReactNode, SyntheticEvent, isValidElement} from 'react';
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

type Props = PropsWithChildren<{
  param: string;
  id: string;
  can: string;
  soThat: string;
}>;

export const Story: FC<Props> = ({param, id, can, soThat, children}) => {
  const stories = useOpenStories(param);
  const {story: Can} = useRanks();
  const steps = stepsIn(children);
  const toggled = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    stories.toggle(id);
  };
  const matchAddressToFold = ({currentTarget}: SyntheticEvent<HTMLDetailsElement>) => {
    if (currentTarget.open !== stories.isOpen(id)) stories.toggle(id);
  };
  return <li tabIndex={-1}>
    <details className="arc" open={stories.isOpen(id)} aria-labelledby={storyKeys.anchorOf({param, id})}
      onToggle={matchAddressToFold}>
      <summary className="opener sub-title-glyph-before" onClick={toggled}>
        <hgroup className="story card rounded-corners lifted">
          <Can className="can paragraph bold" id={storyKeys.anchorOf({param, id})}>{can}</Can>
          <p className="so-that paragraph italic muted-ink">so that {soThat}</p>
          {steps > 0 && <p className="step-tally caption muted-ink">{steps === 1 ? '1 step' : `${steps} steps`}</p>}
        </hgroup>
      </summary>
      {children}
    </details>
  </li>;
};
