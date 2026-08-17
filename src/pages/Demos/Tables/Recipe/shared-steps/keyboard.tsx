import {ReactNode} from 'react';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {frameMount, gap, gripSource, headerCss, surveySource} from './sources';

export const focusLands = (world: World, headerSource: string): ReactNode =>
  <Step title="Give focus a place to land">
    <Words want="The trader without a pointer expects the same reorders, and first, focus needs a place to land; a plain header holds none.">
      <Says>Before inventing anything we would count what HTML already focuses: a button is
        focusable by birth, a header is not but tabindex asks, and CSS can greet the keyboard
        alone, a focus ring pointer users never see.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>HTML nearly solves this alone: the row grip is a button, focusable by birth, and
          the headers ask for focus with
          a <Mdn path="Web/HTML/Global_attributes/tabindex">tabIndex</Mdn>, so Tab walks every
          movable piece of the table in order. CSS answers the arrival with
          a <Mdn path="Web/CSS/:focus-visible">focus-visible</Mdn> ring that draws for the keyboard
          only; pointer users never see it.</Says>
        : <Says>HTML nearly solves this alone: the row grip is a button in the markup, focusable by
          birth, and JavaScript asks each movable header for focus with
          a <Mdn path="Web/HTML/Global_attributes/tabindex">tabindex</Mdn> as it dresses the grips
          (the anchored edges hold the table, so their headers ask for nothing), so Tab walks every
          movable piece of the table in order. CSS answers the arrival with
          a <Mdn path="Web/CSS/:focus-visible">focus-visible</Mdn> ring that draws for the keyboard
          only; pointer users never see it.</Says>}
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
      <Says>The platform ships no verb for swap left, so we would claim one: a keydown listener
        that takes the two arrows and nothing else, letting every other key fall through, and
        preventDefault only on what it claims so the page does not scroll. The walk itself
        should be the same seat arithmetic the pointer track built.</Says>
    </Words>
    <Reveal>
      <Says>A <Mdn path="Web/API/Element/keydown_event">keydown</Mdn> handler claims the two
        arrows and nothing else, so every other key falls through untouched and tabbing and the
        sort menu keep
        working; <Mdn path="Web/API/Event/preventDefault">preventDefault</Mdn> stops the page
        from scrolling on the keys it does claim. The walk clamps inside the anchored
        edges: the first and last columns hold the table, so the nudge stops beside them, and
        rows do the same dance turned vertical, the grip listening for up and down.</Says>
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
