import {FC} from 'react';
import {StoryShell, Titled} from './StoryShell';

export const DrawnStory: FC<Titled & {open: boolean}> = drawn => <StoryShell {...drawn}/>;
