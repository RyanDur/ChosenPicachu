import {FC} from 'react';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {gap, gripSource, headerCss, surfaceCss, surveySource} from './sources';
import {Sample} from '@pages/Demos/Recipe/sample';

export const FocusLands: FC<{world: World; headerSource: Sample; buildSrc: Sample}> = ({world, headerSource, buildSrc}) =>
  <Step title="Give focus a place to land">
    <Words want="The trader without a pointer expects the same reorders. First, focus needs a place to land; a plain header holds none.">
      <Says>HTML already does most of this: a button is focusable by birth,
        and a header can ask with
        a <Mdn path="Web/HTML/Global_attributes/tabindex">tabindex</Mdn>. CSS draws the
        rest: a <Mdn path="Web/CSS/:focus-visible">focus-visible</Mdn> ring for the keyboard
        that pointer users never see.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>The row grip is already a button, and the headers ask with a tabIndex, so Tab
          reaches every movable piece of the table in order. The focus-visible ring draws for the
          keyboard only. A shared class is a look that lives in the site’s shared sheet and that an element wears by
          name. <code>focus-ringed</code> is one: the site’s ring, which every movable column header and every grip wears.</Says>
        : <Says>The row grip is already a button in the markup, and JavaScript asks each movable
          header for focus with a tabindex as it adds the grips’ classes (the anchored edges hold the
          table, so their headers ask for nothing), so Tab reaches every movable piece of the
          table in order. The focus-visible ring draws for the keyboard only. A shared class is a look
          that lives in the site’s shared sheet and that an element wears by name. <code>focus-ringed</code> is one: the site’s ring,
          which every movable column header and every grip wears.</Says>}
      <Says>The buttons say their tab stop outright: a tabindex of zero on an element that is
        focusable by birth. That is Safari’s doing. Its plain Tab visits text fields and anything
        that writes a tabindex, and skips buttons and links unless you hold Option; every other
        browser ignores the attribute on a button. Without it a Safari user reaches every header
        and never a grip.</Says>
      <Codes>
        {world === 'react'
          ? <Snippet label="HTML" lines={[
            ...span(headerSource, 'tabIndex={travels', 'tabIndex={travels'), gap,
            ...span(gripSource, '<button', '</button>'),
            aside('{/* the button was focusable all along; Safari’s Tab still wants it written */}')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(buildSrc, '#dressGrips('),
            aside('// the button was focusable all along; Safari’s Tab still wants it written; JavaScript asks for the headers')
          ]}/>}
        <Snippet label="CSS" lines={[
          ...unit(headerCss, '.sortable .header-cell {'), gap,
          ...unit(surfaceCss, '.focus-ringed {')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

export const ArrowsSpeak: FC<{world: World; headerSource: Sample; buildSrc: Sample}> = ({world, headerSource, buildSrc}) =>
  <Step title="The arrows give the direction">
    <Words want="The trader’s focus can reach a column, but the platform ships no verb for “swap left”; they need one.">
      <Says>A <Mdn path="Web/API/Element/keydown_event">keydown</Mdn> listener claims the verb.
        It takes the two arrows and nothing else: every other key falls through,
        and <Mdn path="Web/API/Event/preventDefault">preventDefault</Mdn> fires only on what it
        claims, so the page does not scroll. The walk itself is the same seat arithmetic the
        pointer track built.</Says>
    </Words>
    <Reveal>
      <Says>The handler claims the left and right arrows; tabbing and the sort menu keep working
        because nothing else is touched. The walk clamps inside the anchored edges: the first
        and last columns hold the table, so the nudge stops beside them. Rows stop at the table’s ends, but any row may move; only columns have anchors. The
        grip’s keys are up and down.</Says>
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(headerSource, 'onKeyDown={travels')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(buildSrc, "th.addEventListener('keydown'")
          ]}/>}
        <Snippet label="TS" lines={[
          ...unit(surveySource, 'export const nudgedColumn'), gap,
          ...unit(surveySource, 'export const nudgedRow'),
          aside('// the anchors hold and the walk stops beside them; both worlds call the same walk')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
