import {FC, MouseEvent, SyntheticEvent} from 'react';
import {storyKeys} from './storyKeys';
import {useOpenStories} from './useOpenStories';
import {StoryCard, Told} from './StoryCard';

export const Story: FC<Told> = ({param, id, can, soThat, children}) => {
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
        <StoryCard titleId={titleId} can={can} soThat={soThat} body={children}/>
      </summary>
      {children}
    </details>
  </li>;
};
