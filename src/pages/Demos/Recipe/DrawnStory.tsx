import {FC} from 'react';
import {Told} from './StoryCard';
import {StoryShell} from './StoryShell';

export const DrawnStory: FC<Told & {open: boolean}> = drawn => <StoryShell {...drawn}/>;
