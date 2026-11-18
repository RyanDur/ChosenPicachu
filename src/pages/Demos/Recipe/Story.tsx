import {FC, MouseEvent, SyntheticEvent} from 'react';
import {useOpenStories} from './useOpenStories';
import {Told} from './StoryCard';
import {StoryShell} from './StoryShell';
import {storyKeys} from './storyKeys';

export const Story: FC<Told> = ({param, id, can, soThat, children}) => {
  const stories = useOpenStories(param);
  const toggled = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    stories.toggle(id);
  };
  const matchAddressToFold = ({currentTarget}: SyntheticEvent<HTMLDetailsElement>) => {
    stories.setOpen(id, currentTarget.open);
  };
  return <StoryShell titleId={storyKeys.anchorOf({param, id})} can={can} soThat={soThat} open={stories.isOpen(id)}
    onToggle={matchAddressToFold} onClick={toggled}>{children}</StoryShell>;
};
