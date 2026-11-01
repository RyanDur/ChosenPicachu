import {FC} from 'react';
import {MomentLink} from '@pages/Record/MomentLink';
import {ColumnHeaderClassList} from './ClassList';

const wathan = 'https://adamwathan.me/css-utility-classes-and-separation-of-concerns/';
const utilityFirst = 'https://v3.tailwindcss.com/docs/utility-first';
const bem = 'https://yandex.com/dev/bem/index';
const customizableSelect = 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select';

export const PresentationPractice: FC = () =>
  <>
    <p className="paragraph">I write CSS in two kinds of sheet. A component’s sheet holds its structure, the grid and
      placement of that one component, named for it and kept beside it. The site’s shared sheets hold the looks every
      component draws on, as a vocabulary of small classes: <code className="monospaced">lifted</code>,{' '}
    <code className="monospaced">padded</code>, <code className="monospaced">rounded-corners</code>,{' '}
    <code className="monospaced">muted-ink</code>, <code className="monospaced">attentive</code>. A class like that
      is a utility: one look, under one name, that any element can wear. An element is dressed by naming its needs,
      and no new rule is written. Element selectors appear only in the reset. The separation is the{' '}
    <MomentLink to="presentationLeavesHome">1994 draft</MomentLink>’s.</p>
    <p className="paragraph">A class is a name for what the element is, what it needs or what is true right now; the
      value it stands for lives in the sheet, so the name still fits when the value changes.</p>
    <p className="paragraph">Utilities are where I agree with Adam Wathan, who made Tailwind:{' '}
      <a className="signpost" href={wathan}>compose a look from a shared set of pieces rather than write it again</a>,
      and choose every value from a constrained set, so the design stays consistent as the site grows. Where I part
      from Tailwind is what a utility is named for, and Tailwind states its side plainly:{' '}
      <a className="signpost" href={utilityFirst}>“You aren’t wasting energy inventing class names”</a>. A name is a
      cost, so stop paying it, and the CSS stops growing. I think the energy is not wasted; it is the writer paying
      once what every reader would otherwise pay each time. Tailwind’s <code className="monospaced">shadow-md</code>{' '}
      and <code className="monospaced">p-4</code> name the value, so a reader who knows the system sees what the
      element looks like, and a change of design is a change to every element. Mine name the need:{' '}
      <code className="monospaced">lifted</code> says why the style is there, and the sheet says what lifted means
      today, through a token, a named value such as <code className="monospaced">--light-box-shadow</code> that every
      rule reads instead of writing the number. Change the token and every lifted element follows; the markup never
      knew the number. That keeps the sheet restyleable, which is what the Zen Garden in the{' '}
      <MomentLink to="zenGarden">2003 moment</MomentLink> showed the separation is for, and it keeps the constraint
      where Wathan wants it, in one place.</p>
    <p className="paragraph">BEM, Yandex’s method, sits between the two. It{' '}
      <a className="signpost" href={bem}>divides a user interface into independent blocks</a>, each with its own
      sheet, and names every part and every variant through its block:{' '}
      <code className="monospaced">card__title</code>, <code className="monospaced">card_lifted</code> in Yandex’s own
      spelling, <code className="monospaced">card--lifted</code> as most teams write it. I keep the block and its
      sheet, and the flat specificity that comes with one class per rule. What I give up is the scoping of looks. In
      BEM, lifted on a card and lifted on a menu are two modifiers and two rules, so nothing is shared by accident and
      the same look is written twice. Mine is one word any block can wear. BEM also has no separate idea of a state:{' '}
      <code className="monospaced">--open</code> and <code className="monospaced">--large</code> are both modifiers. I
      split them, because the platform already names most states, so <code className="monospaced">:hover</code> needs
      no class where <code className="monospaced">card--hovered</code> does. BEM takes the independent block and gives
      up sharing. Tailwind takes sharing and gives up restyling. I take both, and pay with a vocabulary that has to be
      kept, and a lint rule that holds it.</p>
    <p className="paragraph">A class list reads left to right: nouns, then needs, then states.</p>
    <ColumnHeaderClassList/>
    <p className="paragraph">The nouns say what the element is: <code className="monospaced">cell</code> and{' '}
      <code className="monospaced">header-cell</code> name a part of the table, and the table’s own sheet, kept beside
      it, says how that part is laid out. The needs say what the element asks of the design:{' '}
      <code className="monospaced">muted-bar-below</code> and <code className="monospaced">focus-ringed</code> are
      words from the shared sheets, each resolved through a token, so the sheet decides what a muted bar or a focus
      ring is today and every element that asks for one follows. The states say what is true right now. The platform
      already names most of them, such as <code className="monospaced">:hover</code>,{' '}
      <code className="monospaced">:focus</code>, <code className="monospaced">invalid</code> and{' '}
      <code className="monospaced">checked</code>, so the sheet uses those{' '}
      <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes">pseudo-classes</a>{' '}
      and no class is written. I add a state name only where the platform has no word:{' '}
      <code className="monospaced">carried</code> for the column being dragged,{' '}
      <code className="monospaced">settling</code> for the one sliding back into place,{' '}
      <code className="monospaced">shoved</code> for a neighbor pushed aside. One sheet, the table’s, says what each
      does. Carried and settling use the same rules for a column and a row; only the lengths handed in differ. Shoved
      has a rule per direction: two across for columns, two down for rows.</p>
    <p className="paragraph">Presentation has duties of its own. Motion is a preference the reader can set, so the
      sheet checks{' '}
    <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion">prefers-reduced-motion</a>{' '}
      before it animates. Grid and flex can change the order the eye sees without changing the order a keyboard moves
      through, so the HTML keeps{' '}
    <a className="signpost" href="https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html">the meaningful sequence</a>{' '}
      and the sheet only changes the picture.</p>
    <p className="paragraph">Workarounds go away as the platform catches up. I can move a checkbox off screen, where a
      screen reader still reads it and no one sees it. Its label then carries the design, and the checked state
      changes it. Select options had no such way round, and now they need none: they can be styled with{' '}
    <a className="signpost" href={customizableSelect}>appearance: base-select</a> in Chromium, and a browser without
      it will <a className="signpost" href={customizableSelect}>“fall back to a classic select experience”</a>. That
      is the record’s pattern since the <MomentLink to="needOutrunsStandards">1996 moment</MomentLink>: a workaround,
      and then the platform.</p>
    <p className="paragraph">Constants live in the sheet, as tokens. Only values the code works out at runtime are
      written inline, mostly as{' '}
    <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">custom properties</a>{' '}
      the sheet already reads: a measured height, a position after a drag, the direction of a slide. Every size is a
      multiple of one base, and every color is a named token on the root. Custom properties are the{' '}
    <MomentLink to="someoneNeedsComponents">2013 moment</MomentLink>’s lesson: theme variables started in script and
      now live in CSS.</p>
    <p className="paragraph">The test is to read a class list on its own. If it does not say what the element is and
      what it needs, in the names the design uses, the sheet has become a pile of overrides. This test guards
      isolation, the last of the seven problems in Chedeau’s talk; the concert quotes his list.</p>
  </>;
