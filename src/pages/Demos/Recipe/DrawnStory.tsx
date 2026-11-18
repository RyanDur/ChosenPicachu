import {FC} from 'react';
import {storyKeys} from './storyKeys';
import {StoryCard, Told} from './StoryCard';

export const DrawnStory: FC<Told & {open: boolean}> = ({param, id, open, can, soThat, children}) => {
  const titleId = storyKeys.anchorOf({param, id});
  return <li tabIndex={-1}>
    <details className="arc" open={open} aria-labelledby={titleId}>
      <summary className="fold-bar sub-title-glyph-before">
        <StoryCard titleId={titleId} can={can} soThat={soThat} body={children}/>
      </summary>
      {children}
    </details>
  </li>;
};
