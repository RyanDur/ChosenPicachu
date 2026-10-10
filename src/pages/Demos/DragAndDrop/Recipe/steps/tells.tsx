import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {DemoTopics} from '../../../types';
import {Tell} from '../../../Recipe';

export const platformCurrency =
  <Tell>The tables build their drag from pointer events and draw every pixel themselves; this list uses the
    browser’s own drag and drop instead. Mark a card draggable and the browser does the rest: the drag image, a
    picture of the card that follows the pointer, the cursor, the cancel. What it asks in return is a set of handlers
    that answer at the right moments, and the steps below are those handlers.</Tell>;

export const neverOurs =
  <Tell>Three things stay the browser’s with its own drag and drop: the drag image, the cursor, the macOS cancel.
    The steps name them instead of faking them, and the <Link className="signpost"
    to={`${Paths.demos}?tab=${DemoTopics.tables}`}>Tables demo</Link> shows the pointer-events drag that
    owns them.</Tell>;
