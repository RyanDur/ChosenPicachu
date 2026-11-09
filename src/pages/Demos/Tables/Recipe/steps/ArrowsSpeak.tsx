import {FC} from 'react';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, lines, carve, Sample} from '../../../Recipe';
import type {World} from '../../../Controls';
import {sources} from './sources';

export const ArrowsSpeak: FC<{world: World; headerSource: Sample; buildSrc: Sample}> =
  ({world, headerSource, buildSrc}) =>
    <Step title="The arrows give the direction">
      <Words want="The trader’s focus can reach a column, but the platform ships no verb for “swap left”; they need one.">
        <Says>A <Mdn path="Web/API/Element/keydown_event">keydown</Mdn> listener claims the verb.
          It takes the two arrows and nothing else: every other key falls through,
          and <Mdn path="Web/API/Event/preventDefault">preventDefault</Mdn> fires only on what it
          claims, so the page does not scroll. The walk itself is the same seat arithmetic the
          pointer track built.</Says>
      </Words>
      <Reveal>
        <Says>The handler claims the left and right arrows; tabbing and the sort menu keep working
          because nothing else is touched. The walk clamps inside the anchored edges: the first
          and last columns hold the table, so the nudge stops beside them. Rows stop at the table’s ends, but any row
          may move; only columns have anchors. The grip’s keys are up and down.</Says>
        <Codes>
          {world === 'react'
            ? <Snippet label="TS" lines={[
              ...carve.unit(headerSource, 'onKeyDown={travels')
            ]}/>
            : <Snippet label="TS" lines={[
              ...carve.unit(buildSrc, "th.addEventListener('keydown'")
            ]}/>}
          <Snippet label="TS" lines={[
            ...carve.unit(sources.survey, 'const nudgedColumn'), lines.blank,
            ...carve.unit(sources.survey, 'const nudgedRow'),
            lines.aside('// the anchors hold and the walk stops beside them; both worlds call the same walk')
          ]}/>
        </Codes>
      </Reveal>
    </Step>;
