import {FC} from 'react';
import {OriginDial} from '../../../Controls';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, lines, carve, Sample} from '../../../Recipe';
import type {World} from '../../../Controls';
import {sources} from './sources';
import {gap} from './gap';
import {WhatACustomPropertyIs} from '../WhatACustomPropertyIs';
import {SheetDeclaresSeatAndDrift} from './SheetDeclaresSeatAndDrift';
import {carriedProperties} from './carriedProperties';

export const KeepOrigin: FC<{world: World; cssSource: Sample}> = ({world, cssSource}) =>
  <Step title="Keep the origin in place and let only the order move" dial={<OriginDial name="step-origin"/>}>
    <Words want="A moving column can disorient; some traders want the table to hold its shape while they decide, and only the order to answer.">
      <Says>Keeping the origin should be the style sheet’s decision, not a second table: the
        carried cells still wear their seat and their drift as custom properties, <WhatACustomPropertyIs/>, and when the
        table wears keep the style sheet never adds them up. <SheetDeclaresSeatAndDrift/>.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <>
          <Says>The lifted column stays exactly where it stands and the cursor says grabbing.
            What follows the hand is the order: the neighbors move around it as it is struck, or
            at the drop. The table dispatches the same drift and the cells wear the same numbers;
            the table wears the word keep, and no rule in the style sheet translates a carried cell
            under it.</Says>
          <Says>A cell wears <code className="monospaced">paper-in-motion</code>, a shared class, a look from the site’s
            shared style sheet that an element wears by name, while it is carried, settling or shoved: it grounds the
            cell in the page’s paper, so a cell in motion is opaque and shows nothing through it.</Says>
          <Says>Under keep the carried cells stay put, and the style sheet raises them with
            a <Mdn path="Web/CSS/z-index">z-index</Mdn> of 1: z-index orders boxes that overlap, the higher on top,
            and a table cell takes one only once it is positioned, given
            a <code className="monospaced">position</code> other than static,
            which is why the carried cell is also <code className="monospaced">position: relative</code>. So the
            neighbors slide beneath the carried cells, and the paper keeps either from showing through the
            other.</Says>
        </>
        : <>
          <Says>The lifted column stays exactly where it stands and the cursor says grabbing.
            What follows the hand is the order: the neighbors move around it as it is struck, or
            at the drop. The build dispatches the same drift and marks the same cells; the table
            wears the word keep, and no rule in the style sheet translates a carried cell under it.</Says>
          <Says>A cell wears <code className="monospaced">paper-in-motion</code>, a shared class, a look from the site’s
            shared style sheet that an element wears by name, while it is carried, settling or shoved: it grounds the
            cell in the page’s paper, so a cell in motion is opaque and shows nothing through it.</Says>
          <Says>Under keep the carried cells stay put, and the style sheet raises them with
            a <Mdn path="Web/CSS/z-index">z-index</Mdn> of 1: z-index orders boxes that overlap, the higher on top,
            and a table cell takes one only once it is positioned, given
            a <code className="monospaced">position</code> other than static,
            which is why the carried cell is also <code className="monospaced">position: relative</code>. So the
            neighbors slide beneath the carried cells, and the paper keeps either from showing through the
            other.</Says>
        </>}
      <Codes>
        <Snippet label="CSS" lines={[
          ...carriedProperties(cssSource),
          ...carve.unit(cssSource, '.sortable .carried {'), gap,
          ...carve.unit(cssSource, '.sortable.hide .carried {'), gap,
          ...carve.unit(sources.surfaceCss, '.paper-in-motion {'),
          lines.aside('/* the carried cell rises above its neighbors in every table; only under hide does it move */')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
