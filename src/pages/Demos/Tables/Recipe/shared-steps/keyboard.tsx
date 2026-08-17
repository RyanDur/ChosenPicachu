import {ReactNode} from 'react';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {frameMount, gap, gripSource, headerCss, surveySource} from './sources';

export const focusLands = (world: World, headerSource: string): ReactNode =>
  <Step title="Give focus a place to land">
    <Words want="The trader without a pointer expects the same reorders. First, focus needs a place to land; a plain header holds none.">
      <Says>HTML already focuses more than it gets credit for: a button is focusable by birth,
        and a header can ask with
        a <Mdn path="Web/HTML/Global_attributes/tabindex">tabindex</Mdn>. CSS handles the
        arrival: a <Mdn path="Web/CSS/:focus-visible">focus-visible</Mdn> ring for the keyboard
        that pointer users never see.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>The row grip is already a button, and the headers ask with a tabIndex, so Tab
          walks every movable piece of the table in order. The focus-visible ring draws for the
          keyboard only.</Says>
        : <Says>The row grip is already a button in the markup, and JavaScript asks each movable
          header for focus with a tabindex as it dresses the grips (the anchored edges hold the
          table, so their headers ask for nothing), so Tab walks every movable piece of the
          table in order. The focus-visible ring draws for the keyboard only.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="HTML" lines={[
            ...span(headerSource, 'tabIndex={travels', 'tabIndex={travels'), gap,
            ...span(gripSource, '<button', '</button>'),
            aside('{/* the button was focusable all along; the header asks */}')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(frameMount, 'const dressGrips = '),
            aside('// the button was focusable all along; JavaScript asks for the headers')
          ]}/>}
        <Snippet label="CSS" lines={[
          ...unit(headerCss, '.sortable .header-cell {')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

export const arrowsSpeak = (world: World, headerSource: string): ReactNode =>
  <Step title="Arrows speak direction">
    <Words want="The trader’s focus can reach a column, but the platform ships no verb for “swap left”; they need one.">
      <Says>The verb gets claimed with
        a <Mdn path="Web/API/Element/keydown_event">keydown</Mdn> listener that takes the two
        arrows and nothing else: every other key falls through,
        and <Mdn path="Web/API/Event/preventDefault">preventDefault</Mdn> fires only on what it
        claims, so the page does not scroll. The walk itself is the same seat arithmetic the
        pointer track built.</Says>
    </Words>
    <Reveal>
      <Says>The handler claims the left and right arrows; tabbing and the sort menu keep working
        because nothing else is touched. The walk clamps inside the anchored edges: the first
        and last columns hold the table, so the nudge stops beside them. Rows do the same turned
        vertical, the grip listening for up and down.</Says>
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(headerSource, 'onKeyDown={travels'),
            aside('// the anchors hold; the walk stops beside them')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(frameMount, "th.addEventListener('keydown'"),
            aside('// the anchors hold; the walk stops beside them')
          ]}/>}
        <Snippet label="TS" lines={[
          ...unit(surveySource, 'export const nudgedColumn'), gap,
          ...unit(surveySource, 'export const nudgedRow'),
          aside('// both worlds walk with the same feet')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
