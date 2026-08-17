import {ReactNode} from 'react';
import {OriginDial} from '../../../Controls';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {frameHide, gap} from './sources';

export const hideOrigin = (world: World, tableSource: string, headerSource: string, cssSource: string): ReactNode =>
  <Step title="Blank the origin while it is aloft" dial={<OriginDial name="step-origin"/>}>
    <Words want="With the ghost in hand, the trader reads the origin column as a duplicate, and nothing says where the drop will land.">
      <Says>The origin should vanish without anything moving: unmounting it would collapse its
        space and shift the whole table. So we would reach for CSS that stops the painting and
        keeps the box, visibility rather than display, and then ask which world writes the
        signal: a comparison the markup makes, or a class the grab applies.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>We could unmount the origin while it travels, but its space would collapse and
          the whole table would shift; so the disappearance takes a component choice and one word
          of CSS instead. This is the hide table, so there is no flag anywhere: the markup compares the aloft key against each
          cell, and CSS does the
          vanishing: <Mdn path="Web/CSS/visibility">visibility</Mdn> hidden takes the whole column
          (text, borders, grip, everything) while its layout space remains as the gap where the
          drop will land. Nothing unmounts.</Says>
        : <Says>We could pull the origin out of the DOM while it travels, but its space would
          collapse and the whole table would shift; so the disappearance takes one class and one
          word of CSS instead. This is the hide build, so there is no flag anywhere: the grab
          blanks the column it lifted and the landing unblanks it, and CSS does the
          vanishing: <Mdn path="Web/CSS/visibility">visibility</Mdn> hidden takes the whole column
          (text, borders, grip, everything) while its layout space remains as the gap where the
          drop will land. Nothing leaves the DOM.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="HTML" lines={[
            ...span(tableSource, 'aloft={columnsTravel.aloft}', 'aloft={columnsTravel.aloft}'), gap,
            ...span(tableSource, 'aloft={rowsTravel.aloft}', 'aloftColumn={columnsTravel.aloft}')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(frameHide, 'export const hideColumn'),
            aside('// the grab calls it at the lift; the landing calls unhideColumn')
          ]}/>}
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...span(headerSource, 'const hidden = aloft.map(held => held === columnName).orElse(false);', 'const hidden = aloft.map(held => held === columnName).orElse(false);'),
            aside('// being the hide table is the flag; the element serves itself')
          ]}/>
          : undefined}
        <Snippet label="CSS" lines={[
          ...unit(cssSource, '.sortable .hide,'),
          aside('/* the box stops painting; its layout space stays */')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

export const keepOrigin = (world: World): ReactNode =>
  <Step title="Leave the origin in place while it is aloft" dial={<OriginDial name="step-origin"/>}>
    <Words want="A vanished origin can disorient; some traders want the column both at rest and in hand while they decide.">
      <Says>Keeping the origin is the absence of work, and we would treat it that way: no flag
        to leave off, no hiding code to skip. The variant that keeps should simply contain
        nothing that hides.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>Render the lifted key normally underneath the ghost. There are two of it for the
          length of the drag, which reads as a copy being carried out of a still-intact table.
          This is the keep table: no hiding code exists in it, so there is nothing to erase.</Says>
        : <Says>The lifted column simply stays painted underneath the ghost. There are two of it
          for the length of the drag, which reads as a copy being carried out of a still-intact
          table. This is the keep build: no hiding code exists in it, so there is nothing to
          erase.</Says>}
      <Codes>
        <Snippet label="HTML" lines={[
          aside(world === 'react'
            ? '{/* no hidden wiring exists in this table; nothing to erase */}'
            : '<!-- no hiding code exists in this build; nothing to erase -->')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
