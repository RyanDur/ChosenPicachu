import {FC} from 'react';
import {fileInRepository} from '@pages/Paths';
import {presentation} from '@pages/Record/sources/presentation';
import {MomentLink} from '@pages/Record/MomentLink';
import {ColumnHeaderClassList} from './ClassList';
import {WhereARuleLives} from './WhereARuleLives';

const {
  cssUtilityClassesSeparation: wathan, utilityFirstFundamentals: utilityFirst, bem, history: bemHistory,
  stylingUtilityClasses: stylingWithUtilities, customizableSelectElements: customizableSelect, smacss,
  resetReloaded, resetCss, normalizeCss, aboutNormalizeCss, sass, aboutLess, aboutBootstrap, objectOrientedCss,
  cssModules, celebratingDecadeStyledComponents: styledComponents, customProperties, layer, container, has,
  nestingSelector, scope, pseudoClasses, prefersReducedMotion, understandingSuccessCriterion1: meaningfulSequence,
  usingCssCustomProperties
} = presentation;
const sheet = (file: string): string => fileInRepository(`src/styles/${file}.css`);
const stylelintConfig = fileInRepository('stylelint.config.js');

export const PresentationPractice: FC = () =>
  <>
    <h3 className="paragraph bold">What organizing CSS has to solve</h3>
    <p className="paragraph">CSS has one global scope, so every rule can reach every element, and a cascade, the rule
      that decides which of several matching declarations wins. That is what makes it small to write and hard to
      organize: as a site grows, a rule written for one place reaches another, a value is written in forty places, and
      the author cannot easily tell which rule wins. Every way of organizing CSS answers one or more of five needs.</p>
    <dl className="needs">
      <div className="need">
        <dt className="paragraph bold">Defaults</dt>
        <dd className="paragraph">that agree across browsers.</dd>
      </div>
      <div className="need">
        <dt className="paragraph bold">Constants</dt>
        <dd className="paragraph">written once.</dd>
      </div>
      <div className="need">
        <dt className="paragraph bold">Reuse</dt>
        <dd className="paragraph">of a look.</dd>
      </div>
      <div className="need">
        <dt className="paragraph bold">Isolation</dt>
        <dd className="paragraph">of a component.</dd>
      </div>
      <div className="need">
        <dt className="paragraph bold">Order</dt>
        <dd className="paragraph">when rules conflict.</dd>
      </div>
    </dl>
    <p className="paragraph">The field answered them in turn, and each answer had a cost.</p>
    <p className="paragraph">A reset answered defaults. Eric Meyer’s{' '}
      <a className="signpost" href={resetCss.address}>reset</a> zeroed the browser’s margins,
      line heights and heading sizes so every site started from nothing; he called it{' '}
      <a className="signpost" href={resetReloaded.address}>“a starting point for creating your own defaults”</a>{' '}
      in 2007. The cost of a reset is that the author styles everything again, including what the browser did well.
      Nicolas Gallagher’s <a className="signpost" href={normalizeCss.address}>normalize.css</a> kept
      the defaults worth keeping instead, to{' '}
      <a className="signpost" href={aboutNormalizeCss.address}>“preserve useful browser defaults rather than erasing them”</a>,
      as he wrote in 2012.</p>
    <p className="paragraph">A preprocessor answered constants and reuse.{' '}
      <a className="signpost" href={sass.address}>Sass</a>, supported since 2006, and{' '}
      <a className="signpost" href={aboutLess.address}>Less</a>, which Alexis Sellier made in 2009, added
      variables, nesting and mixins to a language the browser never sees and compiled it to CSS. The cost is a build
      step between the author and the sheet.</p>
    <p className="paragraph">A framework answered reuse for teams without a designer.{' '}
      <a className="signpost" href={aboutBootstrap.address}>Bootstrap</a>, made at Twitter
      and released in 2011, is a vocabulary of components with their look included. The cost is that the look is the
      framework’s.</p>
    <p className="paragraph">A methodology answered isolation and order by convention. Nicole Sullivan’s{' '}
      <a className="signpost" href={objectOrientedCss.address}>OOCSS</a> separates structure from skin
      and container from content. Jonathan Snook’s <a className="signpost" href={smacss.address}>SMACSS</a>, written in 2011,
      is <a className="signpost" href={smacss.address}>“more style guide than rigid framework”</a>: rules for naming and
      nesting so the cascade cannot reach where it should not. BEM, Yandex’s method, is the one I keep most from, and
      it has its own paragraph below. The cost of a convention is that it holds only as long as every author follows
      it.</p>
    <p className="paragraph">CSS in script answered isolation by build. The component owns its styles, and a build
      scopes the class names so no two components collide:{' '}
    <a className="signpost" href={cssModules.address}>CSS Modules</a>, from 2015, and{' '}
    <a className="signpost" href={styledComponents.address}>styled-components</a>,
      from 2016. The Record’s <MomentLink to="someoneNeedsComponents">2013 moment</MomentLink> tells how that began,
      so this tab does not. The cost is that the look leaves the sheet.</p>
    <p className="paragraph">Utilities answered constants and reuse with no new CSS. Adam Wathan’s essay of 2017,{' '}
      <a className="signpost" href={wathan.address}>CSS Utility Classes and “Separation of Concerns”</a>, argued for a fixed set
      of single-purpose classes drawn from a theme, and Tailwind built it. It has its own paragraph below too.</p>
    <p className="paragraph">Since 2017 the platform has answered four of the five needs itself.{' '}
      <a className="signpost" href={customProperties.address}>Custom properties</a>, in every engine since April 2017, are constants.{' '}
      <a className="signpost" href={layer.address}>@layer</a>, since March 2022, is order.{' '}
      <a className="signpost" href={container.address}>Container queries</a> since February 2023,{' '}
      <a className="signpost" href={has.address}>:has()</a> and{' '}
      <a className="signpost" href={nestingSelector.address}>nesting</a> since December 2023, and{' '}
      <a className="signpost" href={scope.address}>@scope</a> since March 2026, newly available, are isolation. With
      constants and order native, the cascade itself does reuse. Defaults are still the reset’s. The cost is time:
      a reader on a browser from before a feature’s date gets whatever the sheet does without it.</p>
    <p className="paragraph">So what is left to organize is smaller than it was. With the platform supplying constants,
      order and isolation, and reuse through the cascade, the rest of this tab shows what remains: where a rule lives,
      what a class is named for, and the test a class list has to pass.</p>
    <h3 className="paragraph bold">What this site keeps</h3>
    <p className="paragraph"><a className="signpost" href={bem.address}>BEM</a> is Yandex’s method, and it began at scale. Its{' '}
      <a className="signpost" href={bemHistory.address}>history</a> says that by 2006{' '}
      <a className="signpost" href={bemHistory.address}>“any changes to the code of one page affected the code of other pages”</a>,
      with more than a hundred services sharing one style library. The answer was the independent block, which{' '}
      <a className="signpost" href={bemHistory.address}>“can be used anywhere on the page”</a> any number of times. From Lego
      2.0 in 2009, the second version of that shared block library, came a rule for where a block lives:{' '}
      <a className="signpost" href={bemHistory.address}>“each block is stored in a separate folder; each technology is represented by a separate file inside the folder”</a>.
      Every part and every variant is named through its block: <code className="monospaced">card__title</code> and{' '}
      <code className="monospaced">card_lifted</code> in Yandex’s own spelling,{' '}
      <code className="monospaced">card--lifted</code> in the two-dash style many teams use. Every selector is one
      class, so nothing depends on where a block sits.</p>
    <p className="paragraph">I keep three things from BEM:</p>
    <ul className="kept">
      <li className="paragraph">the block as the unit</li>
      <li className="paragraph">the folder per block, which is how the site’s shared components and its tables are laid
        out, with their sheets beside their parts</li>
      <li className="paragraph">flat selectors, one class each</li>
    </ul>
    <p className="paragraph">I give up the scoping of every look to its block. In BEM,{' '}
      <code className="monospaced">lifted</code> on a card and <code className="monospaced">lifted</code> on a menu are
      two modifiers and two rules, so nothing is shared by accident and the same look is written twice. Mine is one
      word any block can wear, because a look is the sheet’s job. BEM also has no separate idea of a state, since a
      modifier{' '}
      <a className="signpost" href={bemHistory.address}>“defines the appearance, state, and sometimes the behavior of the block”</a>.
      I split them, and the class list below says why.</p>
    <p className="paragraph">Tailwind’s own advice on reuse is the part I agree with most. Its page on{' '}
      <a className="signpost" href={stylingWithUtilities.address}>styling with utility classes</a> says to start with
      utilities and not to abstract until the duplication is real. A repeat you can fix with one loop or one
      multi-cursor edit earns nothing, since{' '}
      <a className="signpost" href={stylingWithUtilities.address}>“there’s no benefit to introducing any additional abstraction”</a>.
      When styles do repeat across files,{' '}
      <a className="signpost" href={stylingWithUtilities.address}>“the best strategy is to create a component”</a> in the
      framework, or a template partial, rather than a CSS class. I keep two things from that: no shared look before
      its second use, and every value from a constrained set. I give up two: the value in the class name, and reuse in
      the component rather than the sheet.</p>
    <p className="paragraph">Here is how this site’s CSS is laid out, in the order{' '}
      <code className="monospaced">index.css</code> imports it. First the{' '}
      <a className="signpost" href={sheet('reset')}>reset</a>, which zeroes the margins and sizes the browser gives
      elements, and leaves alone the few whose browser styles do a job: the dialog’s centering, the template and
      datalist that hide themselves, the progress and meter widgets, and the hiding a popover does on any element.</p>
    <p className="paragraph">Then two token files. <a className="signpost" href={sheet('colors')}>colors.css</a> names
      the raw values first, a palette of named colors, and then the roles a component reads:{' '}
    <code className="monospaced">field</code>, <code className="monospaced">field-inverse</code>,{' '}
    <code className="monospaced">card</code>. A component never reads a raw value, so a change of palette is a change
      to one file. <a className="signpost" href={sheet('spacing')}>spacing.css</a> names one base,{' '}
    <code className="monospaced">0.8rem</code>, and every size as a multiple of it, so no number is written twice.</p>
    <p className="paragraph">Then the vocabulary, six files by concern:{' '}
      <a className="signpost" href={sheet('button')}>button</a>,{' '}
      <a className="signpost" href={sheet('typography')}>typography</a>,{' '}
      <a className="signpost" href={sheet('surface')}>surface</a>,{' '}
      <a className="signpost" href={sheet('drawing')}>drawing</a>,{' '}
      <a className="signpost" href={sheet('placement')}>placement</a> and{' '}
      <a className="signpost" href={sheet('glide')}>glide</a>. A word in it is one look under one name that any
      element can wear, resolved through a token. There are about a hundred and fifty. A word is added when a look is
      needed by its second element, not its first: before that it is structure in the one component’s sheet.</p>
    <p className="paragraph">Then the component sheets, which the vocabulary files do not import because each is
      imported by its component. A component’s sheet holds its structure only, the grid and placement of that one
      component, named for it and kept beside it. A family of components shares a sheet at the family’s root, as the
      tables’ <code className="monospaced">Aggregations.css</code> and <code className="monospaced">Picks.css</code>{' '}
      sit at the top of the tables.</p>
    <p className="paragraph">Two gates hold those lines, and they are the method. A lint rule refuses a tag selector
      outside the reset and prints{' '}
    <a className="signpost" href={stylelintConfig}>“a tag is styled only in src/styles/reset.css; give the element a class”</a>.
      Another refuses a look in a component sheet and prints that the property{' '}
    <a className="signpost" href={stylelintConfig}>“is a look; a component sheet holds structure, and a look is a word in src/styles that the element wears as a class”</a>.
      A third refuses a color, a size or a border written as a number instead of a token. BEM and SMACSS held their
      lines by convention; this repository holds them by a lint that fails the commit.</p>
    <WhereARuleLives/>
    <p className="paragraph">What this repository does not use is the platform’s newer scoping: no{' '}
      <code className="monospaced">@layer</code> and no <code className="monospaced">@scope</code>, because the import
      order above gives the cascade its order and the component boundary gives a rule its reach. Nesting it does use,
      in most sheets, where a rule belongs inside another.</p>
    <p className="paragraph">I write CSS in two kinds of sheet. A component’s sheet holds its structure, the grid and
      placement of that one component, named for it and kept beside it. The site’s shared sheets hold the looks every
      component draws on, as a vocabulary of small classes: <code className="monospaced">lifted</code>,{' '}
    <code className="monospaced">padded</code>, <code className="monospaced">rounded-corners</code>,{' '}
    <code className="monospaced">muted-ink</code>, <code className="monospaced">attentive</code>. A class like that
      is a utility: one look, under one name, that any element can wear. An element is dressed by naming its needs,
      and no new rule is written. Element selectors appear only in the reset. The{' '}
    <MomentLink to="presentationLeavesHome">1994 draft</MomentLink> argued that the look should leave the markup for
      a style sheet.</p>
    <p className="paragraph"><a className="signpost" href={wathan.address}>Compose a look from a shared set of pieces rather than write it again</a>:
      that is Wathan’s rule, and mine. Where I part
      from Tailwind is what a utility is named for, and Tailwind states its side plainly:{' '}
    <a className="signpost" href={utilityFirst.address}>“You aren’t wasting energy inventing class names”</a>. Its case is
      that a name is a cost, so stop paying it, and the CSS stops growing. I think the energy is not wasted; it is the
      writer paying once what every reader would otherwise pay each time. Tailwind’s{' '}
    <code className="monospaced">shadow-md</code> and <code className="monospaced">p-4</code> name the value, so a
      reader who knows the system sees what the element looks like, and a change of design is a change to every
      element. Mine name the need: <code className="monospaced">lifted</code> says why the style is there, and the
      sheet says what lifted means today, through a token. A token is a named value, such as{' '}
    <code className="monospaced">--light-box-shadow</code>, that every rule reads instead of writing the number.
      Change the token and every lifted element follows; the markup never knew the number. That keeps the sheet
      restyleable, which is what the Zen Garden in the <MomentLink to="zenGarden">2003 moment</MomentLink> showed the
      separation is for. It also keeps the constraint where Wathan wants it, in one place.</p>
    <p className="paragraph">BEM takes the independent block and gives up sharing. Tailwind takes sharing and gives up
      restyling. I take both, and pay with a vocabulary that has to be kept, and a lint rule that holds it.</p>
    <p className="paragraph">A class is a name for what the element is, what it needs or what is true right now; the
      value it stands for lives in the sheet, so the name still fits when the value changes. A class list reads left
      to right: nouns, then needs, then states.</p>
    <ColumnHeaderClassList/>
    <p className="paragraph">The nouns say what the element is: <code className="monospaced">cell</code> and{' '}
      <code className="monospaced">header-cell</code> name a part of the table, and the table’s own sheet, kept beside
      it, says how that part is laid out. The needs say what the element asks of the design:{' '}
      <code className="monospaced">muted-bar-below</code> and <code className="monospaced">focus-ringed</code> are
      words from the shared sheets, each resolved through a token, so the sheet decides what a muted bar or a focus
      ring is today and every element that asks for one follows. The states say what is true right now. The platform
      already names most of them, such as <code className="monospaced">:hover</code>,{' '}
      <code className="monospaced">:focus</code>, <code className="monospaced">:invalid</code> and{' '}
      <code className="monospaced">:checked</code>, so the sheet uses those{' '}
      <a className="signpost" href={pseudoClasses.address}>pseudo-classes</a>{' '}
      and no class is written. I add a state name only where the platform has no word:{' '}
      <code className="monospaced">carried</code> for the column or row being dragged,{' '}
      <code className="monospaced">settling</code> for the one sliding back into place,{' '}
      <code className="monospaced">shoved</code> for a neighbor pushed aside. One sheet, the table’s, says what each
      does. Carried and settling use the same rules for a column and a row; only the lengths handed in differ. Shoved
      has a rule per direction: two across for columns, two down for rows.</p>
    <p className="paragraph">Presentation has duties of its own. Motion is a preference the reader can set, so the
      sheet checks{' '}
    <a className="signpost" href={prefersReducedMotion.address}>prefers-reduced-motion</a>{' '}
      before it animates. Grid and flex can change the order the eye sees without changing the order a keyboard moves
      through, so the HTML keeps{' '}
    <a className="signpost" href={meaningfulSequence.address}>the meaningful sequence</a>{' '}
      and the sheet only changes the picture.</p>
    <p className="paragraph">Workarounds go away as the platform catches up. I can move a checkbox off screen, where a
      screen reader still reads it and no one sees it. Its label then carries the design, and the checked state
      changes it. Select options had no such way round, and now they need none: they can be styled with{' '}
    <a className="signpost" href={customizableSelect.address}>appearance: base-select</a> in Chromium, and a browser without
      it will <a className="signpost" href={customizableSelect.address}>“fall back to a classic select experience”</a>. That
      is the record’s pattern since the <MomentLink to="needOutrunsStandards">1996 moment</MomentLink>: a workaround,
      and then the platform.</p>
    <p className="paragraph">Constants live in the sheet, as tokens. Only values the code works out at runtime are
      written inline, mostly as{' '}
    <a className="signpost" href={usingCssCustomProperties.address}>custom properties</a>{' '}
      the sheet already reads: a measured height, a position after a drag, the direction of a slide. Every size is a
      multiple of one base, and every color is a named token on the root. Custom properties are the{' '}
    <MomentLink to="someoneNeedsComponents">2013 moment</MomentLink>’s lesson: theme variables started in script and
      now live in CSS.</p>
    <p className="paragraph">The test is to read a class list on its own. If it does not say what the element is and
      what it needs, in the names the design uses, the sheet has become a pile of overrides. This test guards
      isolation, the last of the seven problems in Chedeau’s talk; the concert quotes his list.</p>
  </>;
