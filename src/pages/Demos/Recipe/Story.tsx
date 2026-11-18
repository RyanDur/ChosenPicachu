import {FC, MouseEvent, SyntheticEvent} from 'react';
import {useOpenStories} from './useOpenStories';
import {Told} from './StoryCard';
import {StoryShell} from './StoryShell';

export const Story: FC<Told> = told => {
  const {param, id} = told;
  const stories = useOpenStories(param);
  const toggled = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    stories.toggle(id);
  };
  const matchAddressToFold = ({currentTarget}: SyntheticEvent<HTMLDetailsElement>) => {
    stories.setOpen(id, currentTarget.open);
  };
  return <StoryShell {...told} open={stories.isOpen(id)} onToggle={matchAddressToFold} onClick={toggled}/>;
};
