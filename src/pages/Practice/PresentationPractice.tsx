import {FC} from 'react';
import {Link} from 'react-router';
import {styleInScriptAddress} from '@pages/Record/concertAddress';
import {repository} from '@navigation';
import {presentation} from '@pages/Record/sources/presentation';
import {MomentLink} from '@pages/Record/MomentLink';
import {ColumnHeaderClassList} from './ClassList';
import {WhereARuleLives} from './WhereARuleLives';

const {
  wathan, utilityFirst, bem, bemHistory, stylingWithUtilities, customizableSelect, smacss, resetReloaded, resetCss,
  normalizeCss, aboutNormalizeCss, libSass, aboutLess, aboutBootstrap, objectOrientedCss, cssModules, styledComponents,
  customProperties, layer, container, has, nestingSelector, scope, pseudoClasses, prefersReducedMotion,
  meaningfulSequence, usingCssCustomProperties, hyatt
} = presentation;
const sheet = (file: string): string => repository.file(`src/styles/${file}.css`);
const stylelintConfig = repository.file('stylelint.config.cjs');
const classLint = repository.file('scripts/lint/classes.mjs');
const importList = repository.file('src/index.css');

export const PresentationPractice: FC = () =>
  <>
    <h3 className="paragraph bold">What organizing CSS has to solve</h3>
    <p className="paragraph">I keep any CSS that is structurally part of a component, its grid and placement, in a
      style sheet beside it. Everything else is sharable and lives in the shared style sheets: the reset, the tokens,
      which name each value once, and the vocabulary, the looks any element can wear. A class names what the element
      is, what it needs, or what is true right now. Those are the rules,
      and the rest of this tab says what keeps each.</p>
    <p className="paragraph">The rules come from the readers: a style sheet is read by more than the browser, and I
      write it for all of its readers. The browser reads it to match each selector against the page, and takes the rule
      the cascade says wins. The designer reads it to change the look, and changes a look in one place or in forty.
      The next developer reads a class list to learn what an element is and needs, before opening any style sheet. A
      lint reads it on every commit, so a rule that strays fails there and not in front of a reader.</p>
    <p className="paragraph">So five things have to be true of the style sheets. Lints and the import list hold most of
      them, and I keep the naming myself.</p>
    <dl className="needs">
      <div className="need">
        <dt className="paragraph bold">Place</dt>
        <dd className="paragraph">Structure beside the component, looks in the shared style sheets. The{' '}
          <a className="signpost" href={stylelintConfig}>style sheet lint</a> holds it, refusing a look in a component
          style sheet, and the <a className="signpost" href={classLint}>class lint</a> holds its other side, reading a
          class only from a style sheet in the element’s own directory or one above it, or from the shared style sheets.
          BEM’s{' '}
          <a className="signpost" href={bemHistory.address}>folder per block</a>, from Yandex in 2009, is where the
          first half comes from.</dd>
      </div>
      <div className="need">
        <dt className="paragraph bold">Value</dt>
        <dd className="paragraph">Every value written once, as a token. The{' '}
          <a className="signpost" href={stylelintConfig}>value lint</a> holds it with two rules: it refuses a number
          where a token belongs, and a token nothing declares. Custom properties are the platform’s
          token.</dd>
      </div>
      <div className="need">
        <dt className="paragraph bold">Name</dt>
        <dd className="paragraph">A look is one word any element can wear, named for the need. The{' '}
          <a className="signpost" href={classLint}>class lint</a> holds what a lint can, refusing a class no style sheet
          reads and a class list that does not put the component’s own class first. The naming is mine to keep.
          Wathan’s <a className="signpost" href={wathan.address}>essay</a> is
          where I agree, and Tailwind’s <a className="signpost" href={utilityFirst.address}>utility-first page</a> is
          where I part.</dd>
      </div>
      <div className="need">
        <dt className="paragraph bold">Selector</dt>
        <dd className="paragraph">Classes, never a tag, outside the reset. The{' '}
          <a className="signpost" href={stylelintConfig}>selector lint</a> holds it. A browser matches a selector
          from right to left: David Hyatt, writing for Mozilla’s own engineers in 2000, called the rightmost part the
          key selector,{' '}
          <a className="signpost" href={hyatt.address}>“the part that matches the element being matched, rather than its
            ancestors”</a>.
          So <code className="monospaced">nav a</code> starts from every link on the page, while{' '}
          <code className="monospaced">.home .opening</code> starts from the few elements that carry the class. A
          class also says more: <code className="monospaced">rail-path</code> says what a link is for, where{' '}
          <code className="monospaced">nav a</code> says only where it is.</dd>
      </div>
      <div className="need">
        <dt className="paragraph bold">Order</dt>
        <dd className="paragraph">The style sheets imported in one order, reset first. The{' '}
          <a className="signpost" href={importList}>import list</a> itself holds it: when two rules tie, the cascade
          takes the later one, so the list’s order decides. <a className="signpost" href={layer.address}>@layer</a> is
          the platform’s own way to say that order in a rule.</dd>
      </div>
    </dl>
    <p className="paragraph">CSS has one global scope, so every rule can reach every element. The field put the look in
      other places first, before the platform had a token, an order or a scope of its own. A reset put the defaults in
      the author’s hands: Eric Meyer’s <a className="signpost" href={resetCss.address}>reset</a> zeroed
      the browser’s margins, padding and borders and evened out its line heights and heading sizes,{' '}
    <a className="signpost" href={resetReloaded.address}>“a starting point for creating your own defaults”</a> in
      2007, and Nicolas Gallagher and Jonathan
      Neal’s <a className="signpost" href={normalizeCss.address}>normalize.css</a> kept the
      defaults worth keeping instead, to{' '}
    <a className="signpost" href={aboutNormalizeCss.address}>“preserve useful browser defaults rather than erasing
      them”</a>,
      in 2012. A preprocessor put the values in a build step, in a language the browser never sees:{' '}
    <a className="signpost" href={libSass.address}>Sass</a>, which Hampton Catlin created and which has been supported
      since 2006, and{' '}
    <a className="signpost" href={aboutLess.address}>Less</a>, which Alexis Sellier made in 2009. A framework put
      the look in the library, taken whole: <a className="signpost" href={aboutBootstrap.address}>Bootstrap</a>, made
      at Twitter and released in 2011. A methodology put it in a convention, held as long as every author keeps it:
      Nicole Sullivan’s <a className="signpost" href={objectOrientedCss.address}>OOCSS</a>, Jonathan Snook’s{' '}
    <a className="signpost" href={smacss.address}>SMACSS</a> of 2011,{' '}
    <a className="signpost" href={smacss.address}>“more style guide than rigid framework”</a>, and BEM, which has
      its own paragraph below. CSS in script put it in the component, with a build that scopes the names:{' '}
    <a className="signpost" href={cssModules.address}>CSS Modules</a> from 2015 and{' '}
    <a className="signpost" href={styledComponents.address}>styled-components</a> from 2016; the Record’s{' '}
    <MomentLink to="someoneNeedsComponents">2013 moment</MomentLink> tells how that began. Utilities put the theme
      in the class name: Adam Wathan’s essay of 2017,{' '}
    <a className="signpost" href={wathan.address}>CSS Utility Classes and “Separation of Concerns”</a>, and
      Tailwind after it.</p>
    <p className="paragraph">The platform has since put the values, the order and the scoping in the style sheet itself,
      each native since its date: <a className="signpost" href={customProperties.address}>custom properties</a> since
      April 2017, <a className="signpost" href={layer.address}>@layer</a> since March 2022,{' '}
    <a className="signpost" href={nestingSelector.address}>nesting</a> since December 2023 and{' '}
    <a className="signpost" href={scope.address}>@scope</a> since March 2026, newly available.{' '}
    <a className="signpost" href={container.address}>Container queries</a>, since February 2023, and{' '}
    <a className="signpost" href={has.address}>:has()</a>, since December 2023, let a rule ask how wide an element’s
      container is and what an element contains. A selector alone could not ask either.</p>
    <h3 className="paragraph bold">What this site keeps</h3>
    <p className="paragraph"><a className="signpost" href={bem.address}>BEM</a> is Yandex’s method, and it began at
      scale. Its{' '}
    <a className="signpost" href={bemHistory.address}>history</a> says that by 2006{' '}
    <a className="signpost" href={bemHistory.address}>“any changes to the code of one page affected the code of other
      pages”</a>,
      with more than a hundred services sharing one style library. The answer was the independent block, which{' '}
    <a className="signpost" href={bemHistory.address}>“can be used anywhere on the page”</a> any number of times. From
      Lego 2.0 in 2009, the second version of that shared block library, came a rule for where a block lives:{' '}
    <a className="signpost" href={bemHistory.address}>“each block is stored in a separate folder; each technology is
      represented by a separate file inside the folder”</a>.
      BEM names every part and every variant through its block: <code className="monospaced">card__title</code> and{' '}
    <code className="monospaced">card_lifted</code> in Yandex’s own spelling,{' '}
    <code className="monospaced">card--lifted</code> in the two-dash style many teams use. Every selector is one
      class, so nothing depends on where a block sits.</p>
    <p className="paragraph">I keep two things from BEM:</p>
    <ul className="practice-list">
      <li className="paragraph">the block as the unit</li>
      <li className="paragraph">the folder per block, which is how the site’s shared components and its tables are laid
        out, with their style sheets beside their parts</li>
    </ul>
    <p className="paragraph">I give up the scoping of every look to its block. In BEM,{' '}
      <code className="monospaced">lifted</code> on a card and <code className="monospaced">lifted</code> on a menu are
      two modifiers and two rules, so nothing is shared by accident, and a BEM author writes the same look twice. Mine
      is one word any block can wear, because a look is the style sheet’s job. BEM also has no separate idea of a
      state, since a modifier{' '}
      <a className="signpost" href={bemHistory.address}>“defines the appearance, state, and sometimes the behavior of
        the block”</a>.
      I split them, and the class list below says why.</p>
    <p className="paragraph">Tailwind’s own advice on reuse is the part I agree with most. Its page on{' '}
      <a className="signpost" href={stylingWithUtilities.address}>styling with utility classes</a> says to start with
      utilities and not to abstract until the duplication is real. A repeat you can fix with one loop or one
      multi-cursor edit earns nothing, since{' '}
      <a className="signpost" href={stylingWithUtilities.address}>“there’s no benefit to introducing any additional
        abstraction”</a>.
      When styles do repeat across files,{' '}
      <a className="signpost" href={stylingWithUtilities.address}>“the best strategy is to create a component”</a> in
      the framework, or a template partial, rather than a CSS class. I keep two things from that: no shared look before
      its second use, and every value from a constrained set. I give up two: the value in the class name, and reuse in
      the component rather than the style sheet.</p>
    <h3 className="paragraph bold">Where a rule lives</h3>
    <p className="paragraph">Here is each style sheet in turn, in the
      order <code className="monospaced">index.css</code>{' '}
      imports them. First the{' '}
    <a className="signpost" href={sheet('reset')}>reset</a>, which zeroes the margins and sizes the browser gives
      elements, and leaves alone the few whose browser styles do a job: the dialog’s centering, the template and
      datalist that hide themselves, the progress and meter widgets, and the hiding a popover does on any element.</p>
    <p className="paragraph">Then three token files. A token is a named value, such as{' '}
      <code className="monospaced">--light-box-shadow</code>, that the style sheet reads instead of writing the
      number.{' '}
      <a className="signpost" href={sheet('colors')}>colors.css</a> names
      the raw values first, a palette of named colors, and then the roles a component reads:{' '}
      <code className="monospaced">field</code>, <code className="monospaced">field-inverse</code>,{' '}
      <code className="monospaced">card</code>. A component never reads a raw value, so a change of palette is a change
      to one file. <a className="signpost" href={sheet('spacing')}>spacing.css</a> names one base,{' '}
      <code className="monospaced">0.8rem</code>, and most sizes as multiples of the base. Four kinds of size it names
      outside that scale:</p>
    <ul className="practice-list">
      <li className="paragraph">the hairlines, in pixels, so they do not scale with the type;</li>
      <li className="paragraph">the corner radii: a pixel value for the small one, rems for the soft one and the
        pill;</li>
      <li className="paragraph">a text measure, in ch, since it follows a line of text;</li>
      <li className="paragraph">the breakpoints, in pixels, since they follow the window.</li>
    </ul>
    <p className="paragraph">The third token file, <a className="signpost" href={sheet('timing')}>timing.css</a>,
      names the site’s easing curves and how long its motions take. A transition is a change of style over time, and
      its easing curve sets how it speeds up and slows down. <code className="monospaced">--curve</code> is the curve
      three style sheets’ transitions follow, and <code className="monospaced">--slide-curve</code> is the one the
      site’s banners slide on. The file also names how long the site’s motions take: a gallery piece rises in 0.5
      seconds under the pointer or the keyboard’s focus, a banner slides in 0.6, and the gap it leaves closes in
      0.3.</p>
    <p className="paragraph">A few sizes belong to one component and sit in its own style sheet:</p>
    <ul className="practice-list">
      <li className="paragraph">its own breakpoints, in pixels, and its container queries, in rems, in pixels and one
        measure in ch, since they follow the window, a container or a line of text;</li>
      <li className="paragraph">a table’s or a page’s width, in rems, measured to what it holds: a table’s columns at
        their widest values, a touch header’s two 44px controls, a box that scrolls itself so the page does not;</li>
      <li className="paragraph">a drawing’s width, in pixels, to match its view box.</li>
    </ul>
    <p className="paragraph">A drawing on these tabs floats only where its width and 45ch of text fit side by side in
      the column.</p>
    <p className="paragraph">I write inline only the values the code works out at runtime, mostly as{' '}
      <a className="signpost" href={usingCssCustomProperties.address}>custom properties</a>{' '}
      the style sheet already reads: a measured height, a position after a drag, the direction of a slide. Custom
      properties are the <MomentLink to="someoneNeedsComponents">2013 moment</MomentLink>’s lesson: they took over the
      theme variables that script had held.</p>
    <p className="paragraph">Then the vocabulary, six files by concern:{' '}
      <a className="signpost" href={sheet('button')}>button</a>,{' '}
      <a className="signpost" href={sheet('typography')}>typography</a>,{' '}
      <a className="signpost" href={sheet('surface')}>surface</a>,{' '}
      <a className="signpost" href={sheet('drawing')}>drawing</a>,{' '}
      <a className="signpost" href={sheet('placement')}>placement</a> and{' '}
      <a className="signpost" href={sheet('glide')}>glide</a>. A word in it is one look under one name that any
      element can wear, resolved through a token. There are about a hundred and fifty. I add a word when a second
      element needs the look, not the first: before that it is structure in the one component’s style sheet.</p>
    <p className="paragraph">Then the component style sheets, which <code className="monospaced">index.css</code> does
      not import, since each component imports its own. A component’s style sheet holds its structure only, the grid and
      placement of that one component, named for it and kept beside it. A family of components shares a style sheet at
      the family’s root, as the
      tables’ <code className="monospaced">Aggregations.css</code> and <code className="monospaced">Picks.css</code>{' '}
      sit at the top of the tables.</p>
    <p className="paragraph">Stylelint rules hold three of the five: place, value and selector.{' '}
      <code className="monospaced">selector-max-type</code>, for a tag selector outside the reset, prints{' '}
      <a className="signpost" href={stylelintConfig}>“a tag is styled only in src/styles/reset.css; give the element a
        class”</a>.{' '}
      <code className="monospaced">property-allowed-list</code>, for a look in a component style sheet, prints that the
      property{' '}
      <a className="signpost" href={stylelintConfig}>“is a look; a component sheet holds structure, and a look is a word
        in src/styles that the element wears as a class”</a>.
      The rules for a number where a token belongs, and for a token nothing declares, name the property. BEM and SMACSS
      held their lines by convention; this repository holds them by lint rules that fail the commit.</p>
    <WhereARuleLives/>
    <p className="paragraph">I use neither <code className="monospaced">@layer</code> for the order nor{' '}
      <code className="monospaced">@scope</code> for a rule’s reach, because the import order above gives the cascade
      its order and a component’s own classes, with its rules keyed on them, give a rule its reach. The cost is that the
      order lives in <code className="monospaced">index.css</code>, a list a reader has to know to open, rather than in
      a rule that says so. I do nest a rule inside another where it belongs, as most style sheets here do. So I give up
      BEM’s one-class selector, and a nested rule depends on the class around it. A rule nests
      under its component’s class when it belongs to that component alone; a look any element can wear stays a single
      flat class in the vocabulary.</p>
    <h3 className="paragraph bold">What a class is named for</h3>
    <p className="paragraph">The vocabulary’s words are the looks every component draws on:{' '}
      <code className="monospaced">lifted</code>, <code className="monospaced">padded</code>,{' '}
      <code className="monospaced">rounded-corners</code>, <code className="monospaced">muted-ink</code>,{' '}
      <code className="monospaced">attentive</code>. A word in the vocabulary is what Tailwind calls a utility. An
      element wears the words for its needs, and I write no new rule.</p>
    <p className="paragraph"><a className="signpost" href={wathan.address}>Compose a look from a shared set of pieces
      rather than write it again</a>:
      that is Wathan’s rule, and mine. Where I part
      from Tailwind is what a utility is named for, and Tailwind states its side plainly:{' '}
    <a className="signpost" href={utilityFirst.address}>“You aren’t wasting energy inventing class names”</a>. Its case
      is that a name is a cost, so stop paying it, and the CSS stops growing. I think the energy is not wasted; it is
      the writer paying once what every reader would otherwise pay each time. Tailwind’s{' '}
    <code className="monospaced">shadow-md</code> and <code className="monospaced">p-4</code> name the value, so a
      reader who knows the system sees what the element looks like, and a change of design is a change to every
      element. Mine name the need: <code className="monospaced">lifted</code> says why the style is there, and the
      style sheet says what lifted means today, through a token. Change the token and every lifted element follows; the
      markup never held the value. That is the separation the <MomentLink to="presentationLeavesHome">1994
        draft</MomentLink> argued for, the look leaving the markup for a
      style sheet. That separation keeps the style sheet restyleable, which is what the Zen Garden in the{' '}
    <MomentLink to="zenGarden">2003 moment</MomentLink> showed it is for, and it keeps the constraint where Wathan
      wants it, in one place.</p>
    <p className="paragraph">BEM takes the independent block and gives up sharing. Tailwind takes sharing and gives up
      restyling. I take both, and pay with a vocabulary that has to be kept, and lint rules that hold it.</p>
    <p className="paragraph">The value a class stands for lives in the style sheet, so the name still fits when the
      value changes. A class list reads left to right: nouns, then needs, then states.</p>
    <ColumnHeaderClassList/>
    <p className="paragraph">The nouns say what the element is: <code className="monospaced">cell</code> and{' '}
      <code className="monospaced">header-cell</code> name a part of the table, and the table’s own style sheet, kept
      beside it, says how that part is laid out. The needs say what the element asks of the design:{' '}
      <code className="monospaced">muted-bar-below</code> and <code className="monospaced">focus-ringed</code> are
      words from the shared style sheets, each resolved through a token, so the style sheet decides what a muted bar or
      a focus ring is today and every element that asks for one follows. The states say what is true right now. The
      platform already names most of them, such as <code className="monospaced">:hover</code>,{' '}
      <code className="monospaced">:focus</code>, <code className="monospaced">:invalid</code> and{' '}
      <code className="monospaced">:checked</code>, so a rule uses those{' '}
      <a className="signpost" href={pseudoClasses.address}>pseudo-classes</a>, and I
      write no class. I add a state name only where the platform has no word:{' '}
      <code className="monospaced">carried</code> for the column or row being dragged,{' '}
      <code className="monospaced">settling</code> for the one sliding back into place,{' '}
      <code className="monospaced">shoved</code> for a neighbor pushed aside. One style sheet, the table’s, says what
      each does. Carried and settling use the same rules for a column and a row; only the lengths handed in differ.
      Shoved has a rule per direction: two across for columns, two down for rows.</p>
    <h3 className="paragraph bold">What the style sheet owes the reader</h3>
    <p className="paragraph">Presentation has duties of its own. Motion is a preference the reader can set, so the
      style sheet checks{' '}
    <a className="signpost" href={prefersReducedMotion.address}>prefers-reduced-motion</a>{' '}
      before it animates. Grid and flex can change the order the eye sees without changing the order a keyboard moves
      through, so the HTML keeps{' '}
    <a className="signpost" href={meaningfulSequence.address}>the meaningful sequence</a>{' '}
      and the style sheet only changes the picture.</p>
    <h3 className="paragraph bold">Where the platform catches up</h3>
    <p className="paragraph">Workarounds go away as the platform catches up. I can move a checkbox off screen, where a
      screen reader still reads it and no one sees it. Its label then carries the design, and the checked state
      changes it. Select options had no such way round, and now they need none: they can be styled with{' '}
    <a className="signpost" href={customizableSelect.address}>appearance: base-select</a> in Chromium, and a browser
      without it will <a className="signpost" href={customizableSelect.address}>“fall back to a classic select
        experience”</a>. That
      is the record’s pattern since the <MomentLink to="needOutrunsStandards">1996 moment</MomentLink>: a workaround,
      and then the platform.</p>
    <h3 className="paragraph bold">The test a class list has to pass</h3>
    <p className="paragraph">The test is to read a class list on its own. If it does not say what the element is and
      what it needs, in the names the design uses, the style sheet has become a pile of overrides. This test guards
      isolation: one component’s rules reach no other. Isolation is the last of the seven problems with CSS at scale
      that Christopher Chedeau listed in a 2014 talk. The
      Record’s <Link className="signpost" to={styleInScriptAddress}>concert</Link> quotes his
      list.</p>
  </>;
