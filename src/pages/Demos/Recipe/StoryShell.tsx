import {FC, MouseEvent, SyntheticEvent} from 'react';
import {storyKeys} from './storyKeys';
import {StoryCard, Told} from './StoryCard';

type Folding = {
  open: boolean;
  onToggle?: (event: SyntheticEvent<HTMLDetailsElement>) => void;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

export const StoryShell: FC<Told & Folding> = ({param, id, can, soThat, children, open, onToggle, onClick}) => {
  const titleId = storyKeys.anchorOf({param, id});
  return <li tabIndex={-1}>
    <details className="arc" open={open} aria-labelledby={titleId} onToggle={onToggle}>
      <summary className="fold-bar sub-title-glyph-before" onClick={onClick}>
        <StoryCard titleId={titleId} can={can} soThat={soThat} body={children}/>
      </summary>
      {children}
    </details>
  </li>;
};
