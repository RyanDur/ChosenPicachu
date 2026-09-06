import {ReactNode} from 'react';
import {MotionDial} from '../../../Controls';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, aside, plain} from '../../../Recipe';
import {unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {gap, glideCss, glideSource, settlesSource, stateSource} from './sources';

export const animatedMotion = (world: World, tableSource: string): ReactNode =>
  <Step title="Let the platform draw the move" dial={<MotionDial name="step-motion"/>} id="step-motion">
    <Words want="The trader must be able to follow which column went where. A teleport is honest but unreadable, and animating the layout itself would bounce the whole table, because layout is load-bearing.">
      <Says>The reorder has to land instantly for the drag math to stay true, so only the
        drawing can move. The old trick was to measure where everything stood, dispatch, and
        then draw each displaced cell sliding home from a remembered offset. The platform now
        does the remembering: a <Mdn path="Web/API/View_Transition_API">view transition</Mdn> snapshots
        the cells before the dispatch and after it, and animates each one between the two on
        its own. Nothing is measured, nothing is marked, and no receipt of where anything
        was is kept in state.</Says>
    </Words>
    <Reveal>
      <Says>Each cell tells the transition who it is with
        a <Mdn path="Web/CSS/view-transition-name">view-transition-name</Mdn>, so the browser can
        pair the old snapshot with the new one even after the node has moved. The dispatch
        never learns any of this: it is just state. The table is a subscriber, and a subscriber
        decides how to show what it heard. When the store speaks, the animated table compares
        what it is showing with what the store now holds; if the seating changed, the order,
        the seats or the rule, it shows the new state inside startViewTransition. Every other
        change, the lift, each drift, the drop, is shown plainly. The animation is still
        theater: the swap has already happened, and the slide only tells you what did.</Says>
      {world === 'react'
        ? <Says>The three languages split the work cleanly here. JavaScript names the moment,
          and only the moment: the subscription that shows a reseat. The markup carries each
          cell’s name. CSS owns how the move looks, tuning the transition group the platform
          creates. The static table’s subscription shows every change plainly, and has nothing
          else to switch.</Says>
        : <Says>The three languages split the work cleanly here. JavaScript names the moment,
          and only the moment: wrap the reconcile. The markup carries each cell’s name, written
          at mount. CSS owns how the move looks, tuning the transition group the platform
          creates. The static build differs by one word: it shows the reconcile
          directly.</Says>}
      <Says>Rows are the same move turned vertical, and cost nothing extra: a row’s cells are
        named too, so a sort or a grip nudge draws every row sliding to its new seat.</Says>
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(glideSource, 'export const glide'), gap,
            ...unit(stateSource, 'export const reseated'), gap,
            ...unit(tableSource, 'useEffect(() => {'),
            aside('// a reseat glides through the platform; the state never learns it moved')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(settlesSource, 'export const glided'), gap,
            ...unit(settlesSource, 'export const settleColumn'),
            aside('// a reorder settles through the platform; the state never learns it moved')
          ]}/>}
        {world === 'react'
          ? <Snippet label="HTML" lines={[
            plain("<th style={{viewTransitionName: `header-${name}`}} ... >"),
            plain("<td style={{viewTransitionName: `cell-${row}-${column}`}} ... >"),
            aside('{/* the name survives the node moving; the platform pairs old and new */}')
          ]}/>
          : undefined}
        <Snippet label="CSS" lines={[
          ...unit(glideCss, '::view-transition-old(root)'),
          aside('/* the root must not cross-fade; only named cells move */'), gap,
          ...unit(glideCss, '::view-transition-group(*)')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

export const staticMotion = (world: World, tableSource: string): ReactNode =>
  <Step title="Leave the motion out" dial={<MotionDial name="step-motion"/>} id="step-motion">
    <Words want="Motion is not free: it competes with the pointer, costs a frame budget, and some traders ask for none at all.">
      <Says>No motion should mean no motion code: not the animated table with its transition
        switched off, but a file with nothing to switch. Its settle should read as the whole
        story.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>The static table is a different file. Its subscription shows every change as
          it arrives, and no motion code exists in the file to switch off. There is real value
          beyond taste: nothing competes with the pointer, and no motion for
          prefers-reduced-motion users to endure.</Says>
        : <Says>The static build is a different file. Its show is the reconcile itself, which
          moves the cells, and nothing else exists in the file. There is real
          value beyond taste: nothing competes with the pointer, and no motion for
          prefers-reduced-motion users to endure.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(tableSource, 'useEffect(() => {'),
            aside('// the whole subscription; no motion code exists in this table')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(settlesSource, 'export const cut'),
            aside('// the whole settle; no motion code exists in this build')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;
