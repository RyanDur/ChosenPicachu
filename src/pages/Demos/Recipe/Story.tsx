import {FC, MouseEvent, PropsWithChildren, SyntheticEvent} from 'react';
import {useOpenStories} from './useOpenStories';
import {StoryShell} from './StoryShell';
import {storyKeys} from './storyKeys';

type Props = PropsWithChildren<{
  param: string;
  id: string;
  can: string;
  soThat: string;
}>;

export const Story: FC<Props> = ({param, id, can, soThat, children}) => {
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
