import {FC} from 'react';
import {OriginDial} from '../../../Controls';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, lines, carve, Sample} from '../../../Recipe';
import type {World} from '../../../Controls';
import {Term} from '../Term';
import {sources} from './sources';
import {gap} from './gap';
import {WhatACustomPropertyIs} from '../WhatACustomPropertyIs';
import {SheetDeclaresSeatAndDrift} from './SheetDeclaresSeatAndDrift';
import {carriedProperties} from './carriedProperties';

export const HideOrigin: FC<{world: World; headerSource: Sample; cssSource: Sample; buildSrc: Sample}> =
  ({world, headerSource, cssSource, buildSrc}) =>
    <Step title="Carry the real thing" dial={<OriginDial name="step-origin"/>}>
      <Words want="The trader wants the column they grabbed in their hand, buttons and all, and a gap where it came from that says where the drop will land.">
        <Says>Copying the column would go stale on the next trade, and a copy never has
          the real buttons in it. So nothing is copied: the carried cells themselves move with the
          pointer by <Mdn path="Web/CSS/translate">translate</Mdn>, and the layout box they left
          behind stays exactly where it was, empty, as the gap. Nothing unmounts and nothing is
          hidden.</Says>
      </Words>
      <Reveal>
        <Says>The <Term word="drift">drift</Term> is a field of the drag, written by the dragging reducer’s drifted
          case. The drag holds the survey from the lift, the box the thing was grabbed in, and how far the
          pointer has moved since. Every move dispatches the pointer. Two selectors turn the drag
          into two numbers, and every carried cell wears them as custom properties: <WhatACustomPropertyIs/>. The first
          is the seat, where the grab box sits against where the column rests in the order as it stands now. The second
          is the drift. That
          subtraction is why a settle mid-drag never makes the carried column jump: the order
          changes, the gap moves by the crossed neighbor’s width, and the seat number changes by that width the
          other way, so the carried
          cells stay under the pointer. The style sheet adds the two and does
          the moving, but only when the table wears hide. Under keep the same cells wear the same numbers
          and never leave their place. <SheetDeclaresSeatAndDrift/>, so a carried cell with no numbers on it
          yet stays in its place.</Says>
        {world === 'react'
          ? <>
            <Says>There is no flag anywhere in the table: each cell asks the selectors whether its
              column or its row is carried, and where its seat and its drift are, and sets the class
              and the properties from the answer. The table wears the word hide, and the style sheet reads
              it.</Says>
            <Says>A cell wears <code className="monospaced">paper-in-motion</code>, a shared class, a look from the
              site’s shared style sheet that an element wears by name, while it is carried, settling or shoved: it
              grounds the cell in the page’s paper, so a cell in motion is opaque.</Says>
            <Says>The style sheet also raises the carried cells with a <Mdn path="Web/CSS/z-index">z-index</Mdn> of 1.
              z-index orders boxes that overlap, the higher on top. A table cell takes one only once it is positioned,
              given a <code className="monospaced">position</code> other than static, so the style sheet gives the
              carried cell <code className="monospaced">position: relative</code> as well. Raised, the carried cells
              pass over whatever they cross, and the paper keeps what is beneath from showing through.</Says>
          </>
          : <>
            <Says>There is no flag anywhere in the build: when the drag in the store changes, the
              reconcile adds the class and the properties to the carried cells, and removes
              them when the drag is gone. The table wears the word hide, and the style sheet reads it.</Says>
            <Says>A cell wears <code className="monospaced">paper-in-motion</code>, a shared class, a look from the
              site’s shared style sheet that an element wears by name, while it is carried, settling or shoved: it
              grounds the cell in the page’s paper, so a cell in motion is opaque.</Says>
            <Says>The style sheet also raises the carried cells with a <Mdn path="Web/CSS/z-index">z-index</Mdn> of 1.
              z-index orders boxes that overlap, the higher on top. A table cell takes one only once it is positioned,
              given a <code className="monospaced">position</code> other than static, so the style sheet gives the
              carried cell <code className="monospaced">position: relative</code> as well. Raised, the carried cells
              pass over whatever they cross, and the paper keeps what is beneath from showing through.</Says>
            <Says>Every motion class changes through <code className="monospaced">changeMotion</code>, which adds or
              removes the class and keeps <code className="monospaced">paper-in-motion</code> on while any motion class
              is present.</Says>
          </>}
        <Codes>
          {world === 'react'
            ? <Snippet label="TS" lines={[
              ...carve.unit(headerSource, 'const moved = '), gap,
              ...carve.span(headerSource, 'className={classNames(', '...looks.motionStates(carried'), gap,
              ...carve.unit(sources.looks, 'const motionStates'), gap,
              ...carve.span(headerSource, "'--seat-x': looks.pixels(seat?.x)", "'--drift-x': looks.pixels(drift?.x)")
            ]}/>
            : <Snippet label="TS" lines={[
              ...carve.unit(buildSrc, 'const moved = '), gap,
              ...carve.unit(sources.frameCarry, 'const dress'), gap,
              ...carve.span(sources.frameSettle, 'type Toward', 'const motions'), gap,
              ...carve.unit(sources.frameSettle, 'export const changeMotion'),
              lines.aside('// the reconcile sets the carried cells’ classes; the style sheet moves them')
            ]}/>}
          <Snippet label="TS" lines={[
            ...carve.unit(sources.state, 'const drift'), gap,
            ...carve.unit(sources.state, 'const seatOffset'), gap,
            ...carve.unit(sources.selectors, 'const seatOfColumn'), gap,
            ...carve.unit(sources.selectors, 'const driftOfColumn'),
            lines.aside('// the drift is carried in the drag; the seat is a selector over it and the order')
          ]}/>
          <Snippet label="CSS" lines={[
            ...carriedProperties(cssSource),
            ...carve.unit(cssSource, '.sortable .carried {'), gap,
            ...carve.unit(cssSource, '.sortable.hide .carried {'), gap,
            ...carve.unit(sources.surfaceCss, '.paper-in-motion {'),
            lines.aside('/* the real cells move with the pointer; their layout box stays as the gap; the style sheet adds seat and drift */')
          ]}/>
        </Codes>
      </Reveal>
    </Step>;
