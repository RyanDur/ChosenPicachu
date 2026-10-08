import {ReactNode} from 'react';
import {OriginDial} from '../../../Controls';
import {aside, Codes, Mdn, Reveal, Says, Snippet, Step, Words} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {frameCarry, frameSettle, gap, looksSource, selectorsSource, stateSource, surfaceCss} from './sources';
import {Sample} from '@pages/Demos/Recipe/sample';
import {Line} from '@pages/Demos/Recipe/Snippet';

const whatACustomPropertyIs = <>values set by name on the cell and read back in the stylesheet with <code>var()</code></>;

const theSheetDeclaresSeatAndDrift = <>
  The sheet declares the seat and the drift with <code>@property</code>, a rule that gives a custom property a type
  and a starting value: each is a length that starts at 0px
</>;

const carriedProperties = (cssSource: Sample): Line[] => [
  ...unit(cssSource, '@property --seat-x {'), gap,
  ...unit(cssSource, '@property --seat-y {'), gap,
  ...unit(cssSource, '@property --drift-x {'), gap,
  ...unit(cssSource, '@property --drift-y {'), gap
];

export const hideOrigin = (world: World, headerSource: Sample, cssSource: Sample, buildSrc: Sample): ReactNode =>
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
        numbers every carried cell wears as custom properties, {whatACustomPropertyIs}: the seat, where the grab box sits
        against where the column rests in the order as it stands now, and the drift. That
        subtraction is why a settle mid-drag never makes the carried column jump: the order
        changes, the home moves, the seat moves with it. The stylesheet adds the two and does
        the moving, and only the hide sheet adds them: the same cells wear the same numbers
        under keep and never leave their seat. {theSheetDeclaresSeatAndDrift}, so a carried cell with no numbers on it
        yet stays in its seat.</Says>
      {world === 'react'
        ? <>
          <Says>There is no flag anywhere in the table: each cell asks the selectors whether its
            column or its row is carried, and where its seat and its drift are, and sets the class
            and the properties from the answer. The table wears the word hide, and the sheet reads
            it.</Says>
          <Says>A cell wears <code>paper-in-motion</code>, a shared class, a look that lives in the site’s shared sheet
            and that an element wears by name, while it is carried, settling or shoved: it grounds the cell in the page’s
            paper, so a cell in motion is opaque.</Says>
          <Says>The sheet also raises the carried cells with a <Mdn path="Web/CSS/z-index">z-index</Mdn> of 1.
            z-index orders boxes that overlap, the higher on top, and it works only on a positioned box, so the sheet
            gives the carried cell position: relative as well. Raised, the carried cells ride over whatever they pass,
            and the paper keeps what is beneath from showing through.</Says>
        </>
        : <>
          <Says>There is no flag anywhere in the build: when the drag in the store changes, the
            reconcile dresses the carried cells with the class and the properties, and undresses
            them when the drag is gone. The table wears the word hide, and the sheet reads it.</Says>
          <Says>A cell wears <code>paper-in-motion</code>, a shared class, a look that lives in the site’s shared sheet
            and that an element wears by name, while it is carried, settling or shoved: it grounds the cell in the page’s
            paper, so a cell in motion is opaque.</Says>
          <Says>The sheet also raises the carried cells with a <Mdn path="Web/CSS/z-index">z-index</Mdn> of 1.
            z-index orders boxes that overlap, the higher on top, and it works only on a positioned box, so the sheet
            gives the carried cell position: relative as well. Raised, the carried cells ride over whatever they pass,
            and the paper keeps what is beneath from showing through.</Says>
          <Says>Every motion class changes through <code>changeMotion</code>, which adds or removes the class and
            keeps <code>paper-in-motion</code> on while any motion class is present.</Says>
        </>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(headerSource, 'const moved = '), gap,
            ...span(headerSource, '...motionLooks(carried', '...motionLooks(carried'), gap,
            ...unit(looksSource, 'export const motionLooks'), gap,
            ...span(headerSource, "'--seat-x': pixels(seat?.x)", "'--drift-x': pixels(drift?.x)")
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(buildSrc, 'const moved = '), gap,
            ...unit(frameCarry, 'export const dressCarried'), gap,
            ...span(frameSettle, 'type Toward', 'const motions'), gap,
            ...unit(frameSettle, 'export const changeMotion'),
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
          ...carriedProperties(cssSource),
          ...unit(cssSource, '.sortable .carried {'), gap,
          ...unit(cssSource, '.sortable.hide .carried {'), gap,
          ...unit(surfaceCss, '.paper-in-motion {'),
          aside('/* the real cells ride the pointer; their layout box stays as the gap; the sheet adds seat and drift */')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

export const keepOrigin = (world: World, cssSource: Sample): ReactNode =>
  <Step title="Leave the origin in place while it is aloft" dial={<OriginDial name="step-origin"/>}>
    <Words want="A moving column can disorient; some traders want the table to hold its shape while they decide, and only the order to answer.">
      <Says>Keeping the origin should be the stylesheet’s decision, not a second table: the
        carried cells still wear their seat and their drift as custom properties, {whatACustomPropertyIs}, and the keep
        sheet simply never adds them up. {theSheetDeclaresSeatAndDrift}.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <>
          <Says>The lifted column stays exactly where it stands and the cursor says grabbing.
            What answers the hand is the order: the neighbours move around it as it is struck, or
            at the drop. The table dispatches the same drift and the cells wear the same numbers;
            the table wears the word keep, and no rule in the sheet translates a carried cell
            under it.</Says>
          <Says>A cell wears <code>paper-in-motion</code>, a shared class, a look that lives in the site’s shared
            sheet and that an element wears by name, while it is carried, settling or shoved: it grounds the cell in
            the page’s paper, so a cell in motion is opaque and shows nothing through it.</Says>
          <Says>Under keep the carried cells stay put, and the sheet raises them with
            a <Mdn path="Web/CSS/z-index">z-index</Mdn> of 1: z-index orders boxes that overlap, the higher on top,
            and it works only on a positioned box, which is why the carried cell is also position: relative. So the
            neighbours slide beneath the carried cells, and the paper keeps either from showing through the
            other.</Says>
        </>
        : <>
          <Says>The lifted column stays exactly where it stands and the cursor says grabbing.
            What answers the hand is the order: the neighbours move around it as it is struck, or
            at the drop. The build dispatches the same drift and dresses the same cells; the table
            wears the word keep, and no rule in the sheet translates a carried cell under it.</Says>
          <Says>A cell wears <code>paper-in-motion</code>, a shared class, a look that lives in the site’s shared
            sheet and that an element wears by name, while it is carried, settling or shoved: it grounds the cell in
            the page’s paper, so a cell in motion is opaque and shows nothing through it.</Says>
          <Says>Under keep the carried cells stay put, and the sheet raises them with
            a <Mdn path="Web/CSS/z-index">z-index</Mdn> of 1: z-index orders boxes that overlap, the higher on top,
            and it works only on a positioned box, which is why the carried cell is also position: relative. So the
            neighbours slide beneath the carried cells, and the paper keeps either from showing through the
            other.</Says>
        </>}
      <Codes>
        <Snippet label="CSS" lines={[
          ...carriedProperties(cssSource),
          ...unit(cssSource, '.sortable .carried {'), gap,
          ...unit(cssSource, '.sortable.hide .carried {'), gap,
          ...unit(surfaceCss, '.paper-in-motion {'),
          aside('/* the carried cell rises above its neighbours in every table; only under hide does it move */')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
