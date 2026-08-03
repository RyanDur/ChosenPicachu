import {FC} from 'react';
import {DragStyle} from '@components/DragSortableTable';

const settling: Record<DragStyle, string> = {
  'eager-move':
    'Eager settles while you travel — reach a neighbor\'s inner half and the order updates under your ' +
    'hand, every crossing committed as it happens. Carrying the column back re-crosses the same ' +
    'centers, so home is always reachable.',
  'lazy-move':
    'Lazy only remembers where you are — each crossing records a landing, and the order changes once, ' +
    'at release. Drifting back over your own slot clears the landing, so dropping at home changes nothing.',
  'hide-eager-move':
    'Hide Eager settles like Eager — every inner-half crossing commits — but the carried column paints ' +
    'itself out while aloft: text and rules turn transparent, and only the right edge of its lane stays ' +
    'to mark the gap.',
  'hide-lazy-move':
    'Hide Lazy waits like Lazy — one settle, at release — while the carried column hides in place, ' +
    'transparent but for the right edge of its lane, until the drop brings it back.'
};

const still =
  'Static is React alone: the settle commits and the next render paints the new order in place. ' +
  'Nothing animates, so nothing fights the pointer.';

const gliding =
  'Animate hands the motion to the platform. The settle runs inside document.startViewTransition, ' +
  'each cell wears a view-transition-name, and the browser glides whatever geometry changed — which ' +
  'is only ever the neighbor whose space is being overtaken, since the carried column sheds its name ' +
  'while aloft and the ghost rides the overlay above the glide.';

type Props = {
  dragStyle: DragStyle;
  animated: boolean;
};

export const DragMechanics: FC<Props> = ({dragStyle, animated}) =>
  <details className="explainer">
    <summary className="prompt">how is the drag done?</summary>
    <article className="explanation">
      <p>
        No native drag and drop here — it is pointer events all the way down. A press on a header or a
        grip charts the table once, a full-viewport surface follows the pointer, and where you are is
        answered by arithmetic on that chart rather than by asking the DOM. The column in your hand is
        a second table rendered from the same data, carried on a transform. Neighbors yield only when
        the pointer reaches their inner half; the outer quarter holds still so the order never chatters.
      </p>
      <p>{settling[dragStyle]}</p>
      <p>{animated ? gliding : still}</p>
    </article>
  </details>;
