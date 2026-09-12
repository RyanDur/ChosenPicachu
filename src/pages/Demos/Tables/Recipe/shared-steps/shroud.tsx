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
        since. Every move dispatches the pointer, and two selectors turn the drag into two
        numbers every carried cell wears as custom properties: the seat, where the grab box sits
        against where the column rests in the order as it stands now, and the drift. That
        subtraction is why a settle mid-drag never makes the carried column jump: the order
        changes, the home moves, the seat moves with it. The stylesheet adds the two and does
        the moving, and only the hide sheet adds them: the same cells wear the same numbers
        under keep and never leave their seat.</Says>
      {world === 'react'
        ? <Says>There is no flag anywhere in the table: each cell asks the selectors whether its
          column or its row is carried, and where its seat and its drift are, and sets the class
          and the properties from the answer. The table wears the word hide, and the sheet reads
          it.</Says>
        : <Says>There is no flag anywhere in the build: when the drag in the store changes, the
          reconcile dresses the carried cells with the class and the properties, and undresses
          them when the drag is gone. The table wears the word hide, and the sheet reads it.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(headerSource, 'const moved = '), gap,
            ...span(headerSource, "carried && 'carried'", "carried && 'carried'"), gap,
            ...span(headerSource, "'--seat-x': pixels(seat?.x)", "'--drift-x': pixels(drift?.x)")
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(buildSrc, 'const moved = '), gap,
            ...unit(frameCarry, 'export const dressCarried'),
            aside('// the reconcile dresses the carried cells; the stylesheet moves them')
          ]}/>}
        <Snippet label="TS" lines={[
          ...unit(stateSource, 'export const drift'), gap,
          ...unit(stateSource, 'export const seatOffset'), gap,
          ...unit(selectorsSource, 'export const seatOfColumn'), gap,
          ...unit(selectorsSource, 'export const driftOfColumn'),
          aside('// the drift rides in the drag; the seat is a selector over it and the order')
        ]}/>
        <Snippet label="CSS" lines={[
          ...unit(cssSource, '.sortable .carried {'), gap,
          ...unit(cssSource, '.sortable.hide .carried {'),
          aside('/* the real cells ride the pointer; their layout box stays as the gap; the sheet adds seat and drift */')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

export const keepOrigin = (world: World, cssSource: string): ReactNode =>
  <Step title="Leave the origin in place while it is aloft" dial={<OriginDial name="step-origin"/>}>
    <Words want="A moving column can disorient; some traders want the table to hold its shape while they decide, and only the order to answer.">
      <Says>Keeping the origin should be the stylesheet’s decision, not a second table: the
        carried cells still wear their seat and their drift, and the keep sheet simply never adds
        them up.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>The lifted column stays exactly where it stands and the cursor says grabbing.
          What answers the hand is the order: the neighbours move around it as it is struck, or
          at the drop. The table dispatches the same drift and the cells wear the same numbers;
          the table wears the word keep, and no rule in the sheet translates a carried cell
          under it.</Says>
        : <Says>The lifted column stays exactly where it stands and the cursor says grabbing.
          What answers the hand is the order: the neighbours move around it as it is struck, or
          at the drop. The build dispatches the same drift and dresses the same cells; the table
          wears the word keep, and no rule in the sheet translates a carried cell under it.</Says>}
      <Codes>
        <Snippet label="CSS" lines={[
          ...unit(cssSource, '.sortable .carried {'), gap,
          ...unit(cssSource, '.sortable.hide .carried {'),
          aside('/* the carried cell rises above its neighbours in every table; only under hide does it move */')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
