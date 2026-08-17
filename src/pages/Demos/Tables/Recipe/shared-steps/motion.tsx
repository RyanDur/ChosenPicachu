import {ReactNode} from 'react';
import {MotionDial} from '../../../Controls';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, aside, plain} from '../../../Recipe';
import {unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {frameMarks, gap, settlesSource} from './sources';

export const animatedMotion = (world: World, tableSource: string, cssSource: string): ReactNode =>
  <Step title="Slide the drawing, not the layout" dial={<MotionDial name="step-motion"/>}>
    <Words want="The trader must be able to follow which column went where. A teleport is honest but unreadable, and animating the layout itself would bounce the whole table, because layout is load-bearing.">
      <Says>The reorder has to land instantly for the drag math to stay true, so only the
        drawing can move: commit the swap at once, then draw the displaced column where it used
        to be, sliding home on a <Mdn path="Web/CSS/transform">transform</Mdn>. The <Term word="survey">survey</Term>
        supplies the one number CSS cannot know: the distance home.</Says>
    </Words>
    <Reveal>
      <Says>A swap commits instantly: the carried column already sits at full width in its new
        slot, hidden or under the ghost, and the layout underneath is final. The displaced
        column is drawn where it used to be and slides home. Transforms cannot move layout, so
        nothing else can shift: a bounce is impossible by construction.</Says>
      {world === 'react'
        ? <Says>The three languages split the work. JavaScript marks who was displaced and
          hands over two lengths it already owns, both measured by the survey: the carried
          column’s width and each row’s drop. The markup carries the mark as a class that arrives
          exactly as the reorder moves the node. CSS does the moving:
          a <Mdn path="Web/CSS/@keyframes">keyframe</Mdn>’s from is the old position, a pixel
          length the survey measured at the lift; applying the class starts the slide fresh,
          and <Mdn path="Web/API/Element/animationend_event">animationend</Mdn> hands the class
          back.</Says>
        : <Says>The three languages split the work. JavaScript marks who was displaced and
          hands over two lengths it already owns, both measured by the survey: the carried
          column’s width and each row’s drop. The settle writes the mark as a class the moment it
          moves the node. CSS does the moving:
          a <Mdn path="Web/CSS/@keyframes">keyframe</Mdn>’s from is the old position, a pixel
          length the survey measured at the lift; applying the class starts the slide fresh,
          and <Mdn path="Web/API/Element/animationend_event">animationend</Mdn> hands the class
          back.</Says>}
      <Says>Rows are the same trick turned vertical: heights measured once, in whatever event
        reorders them, become per-row pixel offsets, and every displaced row starts at
        translateY(var(--drop)) and slides home. None of this uses a view transition; every
        motion is a keyframe starting from where things used to be.</Says>
      {world === 'react'
        ? <Says>The animated variant is its own file, marking its slides inline in its settles. The dial above chooses which of eight tables you are reading,
          and the readout under the dials names it.</Says>
        : <Says>The animated variant is its own file, marking its slides inline in its commits. The dial above chooses which of eight builds you are reading,
          and the readout under the dials names it.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(tableSource, 'const settleColumn = '),
            aside('// a direction and a share per displaced key; javascript is done')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(settlesSource, 'export const animatedSettleColumn'), gap,
            ...unit(frameMarks, 'const markCell = '),
            aside('// a direction and a share per displaced key; javascript is done')
          ]}/>}
        {world === 'react'
          ? <Snippet label="HTML" lines={[
            plain("<th className={displaced && `displaced-${toward}`} ... >"),
            plain("<tr className={drop && 'shifted'} style={{'--drop': `${drop}px`}}>"),
            aside('{/* the reorder moves the node; the class rides along */}')
          ]}/>
          : undefined}
        <Snippet label="CSS" lines={[
          ...unit(cssSource, '.sortable .displaced {'), gap,
          ...unit(cssSource, '.sortable .shifted {'), gap,
          ...unit(cssSource, '@keyframes displaced'),
          aside('/* --toward flips the sign; direction is data, not a name */'), gap,
          ...unit(cssSource, '@keyframes shifted')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

export const staticMotion = (world: World, tableSource: string): ReactNode =>
  <Step title="Leave the motion out" dial={<MotionDial name="step-motion"/>}>
    <Words want="Motion is not free: it competes with the pointer, costs a frame budget, and some traders ask for none at all.">
      <Says>No motion should mean no motion code: not the animated table with its slides
        switched off, but a file with nothing to switch. Its settle should read as the whole
        story.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>The static table is a different file with no marking code in it. Its settle
          moves the key and lets React paint; nothing else exists in the file. There is real
          value beyond taste: nothing competes with the pointer, and no motion for
          prefers-reduced-motion users to endure.</Says>
        : <Says>The static build is a different file with no marking code in it. Its commit
          writes a new order, the reconcile moves the cells; nothing else exists in the file.
          There is real value beyond taste: nothing competes with the pointer, and no motion
          for prefers-reduced-motion users to endure.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(tableSource, 'const settleColumn = '),
            aside('// the whole settle; no marking code exists in this table')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(settlesSource, 'export const staticSettleColumn'),
            aside('// the whole settle; no marking code exists in this build')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;
