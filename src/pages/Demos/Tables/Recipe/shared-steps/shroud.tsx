import {ReactNode} from 'react';
import {OriginDial} from '../../../Controls';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {frameCarry, gap, selectorsSource, stateSource} from './sources';

export const hideOrigin = (world: World, headerSource: string, cssSource: string, buildSrc: string): ReactNode =>
  <Step title="Carry the real thing" dial={<OriginDial name="step-origin"/>}>
    <Words want="The trader wants the column they grabbed in their hand, buttons and all, and a gap where it came from that says where the drop will land.">
      <Says>Copying the column would go stale on the next trade, and a copy never has
        the real buttons in it. So nothing is copied: the carried cells themselves ride the
        pointer with <Mdn path="Web/CSS/translate">translate</Mdn>, and the layout box they left
        behind stays exactly where it was, empty, as the gap. Nothing unmounts and nothing is
        hidden.</Says>
    </Words>
    <Reveal>
      <Says>The <Term word="drift">drift</Term> is state on the drag, with a reducer of its own: the survey
        from the lift, the box the thing was grabbed in, and how far the pointer has moved
        since. Every move dispatches the pointer, and one selector turns the drag into the
        offset from the cell’s home: the grab box plus the drift, minus where the column rests
        in the order as it stands now. That subtraction is why a settle mid-drag never makes
        the carried column jump: the order changes, the home moves, the offset moves with
        it. Every cell in the carried column, or the carried row, wears the offset as a custom
        property, and the stylesheet does the moving.</Says>
      {world === 'react'
        ? <Says>This is the hide table, so there is no flag anywhere: each cell asks one
          selector whether its column or its row is carried, and what the offset is, and sets
          the class and the property from the answer.</Says>
        : <Says>This is the hide build, so there is no flag anywhere: when the drag in the store
          changes, the reconcile dresses the carried cells with the class and the property, and
          undresses them when the drag is gone.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(headerSource, 'const moved = '), gap,
            ...span(headerSource, "carried && 'carried'", "carried && 'carried'"), gap,
            ...span(headerSource, "'--carried-by': translation(offset)", "'--carried-by': translation(offset)")
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(buildSrc, 'const moved = '), gap,
            ...unit(frameCarry, 'export const dressCarried'),
            aside('// the reconcile dresses the carried cells; the stylesheet moves them')
          ]}/>}
        <Snippet label="TS" lines={[
          ...unit(stateSource, 'export const drift'), gap,
          ...unit(stateSource, 'export const carriedOffset'), gap,
          ...unit(selectorsSource, 'export const offsetOfColumn'),
          aside('// the drift rides in the drag; the offset is a selector over it and the order')
        ]}/>
        <Snippet label="CSS" lines={[
          ...unit(cssSource, '.sortable .carried {'),
          aside('/* the real cells ride the pointer; their layout box stays as the gap */')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

export const keepOrigin = (world: World): ReactNode =>
  <Step title="Leave the origin in place while it is aloft" dial={<OriginDial name="step-origin"/>}>
    <Words want="A moving column can disorient; some traders want the table to hold its shape while they decide, and only the order to answer.">
      <Says>Keeping the origin is the absence of work: no drift to dispatch, no offset to
        wear, no copy in hand. The keep variant should simply contain nothing that moves the
        carried thing.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>The lifted column stays exactly where it stands and the cursor says grabbing.
          What answers the hand is the order: the neighbours move around it as it is struck, or
          at the drop. This is the keep table: no drift code exists in it, so there is nothing
          to erase.</Says>
        : <Says>The lifted column stays exactly where it stands and the cursor says grabbing.
          What answers the hand is the order: the neighbours move around it as it is struck, or
          at the drop. This is the keep build: no drift code exists in it, so there is nothing to
          erase.</Says>}
      <Codes>
        <Snippet label="HTML" lines={[
          aside(world === 'react'
            ? '{/* no drift wiring exists in this table; nothing to erase */}'
            : '<!-- no drift code exists in this build; nothing to erase -->')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
