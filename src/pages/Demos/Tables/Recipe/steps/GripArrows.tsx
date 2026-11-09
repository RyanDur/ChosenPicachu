import {FC} from 'react';
import {Codes, Reveal, Says, Snippet, Step, Words, lines, carve, Sample} from '../../../Recipe';
import type {World} from '../../../Controls';
import {sources} from './sources';

export const GripArrows: FC<{world: World; rowSource: Sample; buildSource: Sample}> =
  ({world, rowSource, buildSource}) =>
    <Step title="Turn the arrows vertical">
      <Words want="A row is the same walk turned vertical, and the grip is already a button.">
        <Says>Nothing new should be needed: the grip was focusable from its first appearance, so
          up and down make the vertical walk the way left and right make the horizontal one,
          except that rows have no anchors: any row may move, and a walk stops at the table’s ends.</Says>
      </Words>
      <Reveal>
        {world === 'react'
          ? <Says>The grip handles the arrows itself, and the walk is the column walk with the axis turned: the seats
            shuffle instead of the order, and a walk stops at the first and last seat.</Says>
          : <Says>The grip handles the arrows itself, and the walk is the column walk with the axis turned: the seats
            shuffle instead of the order, and a walk stops at the first and last seat.</Says>}
        <Codes>
          {world === 'react'
            ? <Snippet label="TS" lines={[
              ...carve.span(rowSource, 'onKeyDown={arrows.row(', '})}/>'),
              lines.aside('// the grip handles its own arrows; the walk is shared')
            ]}/>
            : <Snippet label="TS" lines={[
              ...carve.unit(sources.frameGrip, "grip.addEventListener('keydown'"), lines.blank,
              ...carve.unit(buildSource, 'const rowTo = '),
              lines.aside('// the grip handles its own arrows; the walk is shared')
            ]}/>}
          <Snippet label="TS" lines={[
            ...carve.unit(sources.arrows, 'const row: Arrows')
          ]}/>
        </Codes>
      </Reveal>
    </Step>;
