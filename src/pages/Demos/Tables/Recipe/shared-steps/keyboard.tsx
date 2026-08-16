import {ReactNode} from 'react';
import {Codes, Mdn, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {frameStand, gap, gripSource, headerCss, surveySource} from './sources';

export const focusLands = (world: World, headerSource: string): ReactNode =>
  <Step title="Give focus a place to land">
    <Words want="The trader without a pointer expects the same reorders, and first, focus needs a place to land; a plain header holds none.">
      {world === 'react'
        ? <Says>HTML nearly solves this alone: the row grip is a button, focusable by birth, and
          the headers ask for focus with
          a <Mdn path="Web/HTML/Global_attributes/tabindex">tabIndex</Mdn>, so Tab walks every
          movable piece of the table in order. CSS answers the arrival with
          a <Mdn path="Web/CSS/:focus-visible">focus-visible</Mdn> ring that draws for the keyboard
          only; pointer users never see it.</Says>
        : <Says>HTML nearly solves this alone: the row grip is a button in the markup, focusable by
          birth, and the shell asks each movable header for focus with
          a <Mdn path="Web/HTML/Global_attributes/tabindex">tabindex</Mdn> as it dresses the grips
          (the anchored edges hold the table, so their headers ask for nothing), so Tab walks every
          movable piece of the table in order. CSS answers the arrival with
          a <Mdn path="Web/CSS/:focus-visible">focus-visible</Mdn> ring that draws for the keyboard
          only; pointer users never see it.</Says>}
    </Words>
    <Codes>
      {world === 'react'
        ? <Snippet label="HTML" lines={[
          ...span(headerSource, 'tabIndex={travels', 'tabIndex={travels'), gap,
          ...span(gripSource, '<button', '</button>'),
          aside('{/* the button was focusable all along; the header asks */}')
        ]}/>
        : <Snippet label="TS" lines={[
          ...unit(frameStand, 'const dressGrips = '),
          aside('// the button was focusable all along; the shell asks for the headers')
        ]}/>}
      <Snippet label="CSS" lines={[
        ...unit(headerCss, '.sortable .header-cell {')
      ]}/>
    </Codes>
  </Step>;

export const arrowsSpeak = (world: World, headerSource: string): ReactNode =>
  <Step title="Arrows speak direction">
    <Words want="The trader’s focus can reach a column, but the platform ships no verb for “swap left”; they need one.">
      <Says>A <Mdn path="Web/API/Element/keydown_event">keydown</Mdn> handler claims the two
        arrows and nothing else, so every other key falls through untouched and tabbing and the
        sort menu keep
        working; <Mdn path="Web/API/Event/preventDefault">preventDefault</Mdn> stops the page
        from scrolling on the keys it does claim. The walk clamps inside the anchored
        edges: the first and last columns hold the table, so the nudge stops beside them, and
        rows do the same dance turned vertical, the grip listening for up and down.</Says>
    </Words>
    <Codes>
      {world === 'react'
        ? <Snippet label="TS" lines={[
          ...unit(headerSource, 'onKeyDown={travels'),
          aside('// the anchors hold; the walk stops beside them')
        ]}/>
        : <Snippet label="TS" lines={[
          ...unit(frameStand, "th.addEventListener('keydown'"),
          aside('// the anchors hold; the walk stops beside them')
        ]}/>}
      <Snippet label="TS" lines={[
        ...unit(surveySource, 'export const nudgedColumn'), gap,
        ...unit(surveySource, 'export const nudgedRow'),
        aside('// both worlds walk with the same feet')
      ]}/>
    </Codes>
  </Step>;
