import {FC} from 'react';
import {Link} from 'react-router';
import {repository} from '@frame/navigation';
import {MomentLink} from '@pages/Record/MomentLink';
import {customElementsAddress} from '@pages/Record/concertAddress';
import {demoAddress, DemoTopics} from '@pages/Demos';
import {Mdn} from '@pages/Demos/Recipe';
import {LandmarkMap} from './LandmarkMap';
import {AttachmentCarve, ColumnBesideCarve, HeaderCellCarve} from './TableCarves';
import {practiceAddress} from './types';

const understanding = (criterion: string): string => `https://www.w3.org/WAI/WCAG22/Understanding/${criterion}.html`;
const survey = 'https://webaim.org/projects/screenreadersurvey10/';
const landmarkRegions = 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/';

export const elementsPart = 'from-the-content-to-the-element';

export const StructurePractice: FC = () =>
  <>
    <h3 className="paragraph bold">What organizing markup has to solve</h3>
    <p className="paragraph">I choose the element for what the thing is, and when no element does the job I make one,
      for the one behavior it adds. A data attribute attaches behavior, a class dresses, and an id locates. Those are
      the rules I hold the markup to, and the rest of this tab says what keeps each. I don’t keep them everywhere yet:
      in the banners, the tables and the dials a script still finds an element by its class. The plain
      accordion’s script does too, on purpose, since it shows the old way.</p>
    <p className="paragraph">The rules come from the readers: the markup is read by more than the browser, and I write
      it for all of its readers at once. A screen reader reads it for roles, names and states, and for a way to move. On
      a long page most of its users go to the headings first: 71.6% in{' '}
    <a className="signpost" href={survey}>WebAIM’s tenth survey</a> said they{' '}
    <a className="signpost" href={survey}>“navigate through the headings on the page”</a>. A few go to the
      landmarks. Reader view and a search engine read it for the content in order, with its meaning. The next
      developer reads it to see what the page is. The browser reads it for the behavior each element brings. The same
      elements have to answer all five.</p>
    <p className="paragraph">So five things have to be true of the markup, and I check four of them against WCAG, the
      W3C’s accessibility guidelines, because it names them.</p>
    <dl className="needs">
      <div className="need">
        <dt className="paragraph bold">Meaning</dt>
        <dd className="paragraph">What each thing is, carried by the markup and not by the look
          (<a className="signpost" href={understanding('info-and-relationships')}>1.3.1, Info and Relationships</a>).
        </dd>
      </div>
      <div className="need">
        <dt className="paragraph bold">Order</dt>
        <dd className="paragraph">What comes before what, so a reader can work out the reading sequence from the markup
          (<a className="signpost" href={understanding('meaningful-sequence')}>1.3.2, Meaningful Sequence</a>).
        </dd>
      </div>
      <div className="need">
        <dt className="paragraph bold">Names</dt>
        <dd className="paragraph">The name each region and control carries
          (<a className="signpost" href={understanding('headings-and-labels')}>2.4.6, Headings and Labels</a>), with
          a way past what repeats on every page
          (<a className="signpost" href={understanding('bypass-blocks')}>2.4.1, Bypass Blocks</a>).
        </dd>
      </div>
      <div className="need">
        <dt className="paragraph bold">Behavior</dt>
        <dd className="paragraph">What presses, opens and submits, with its name, role and state known to the tools
          (<a className="signpost" href={understanding('name-role-value')}>4.1.2, Name, Role, Value</a>).
        </dd>
      </div>
      <div className="need">
        <dt className="paragraph bold">Identity</dt>
        <dd className="paragraph">How the next developer and the script find one thing. No criterion
          covers it.
        </dd>
      </div>
    </dl>
    <p className="paragraph">The rest of this tab takes each of the five in turn.</p>
    <h3 className="paragraph bold">The skeleton, and a name where a landmark repeats</h3>
    <p className="paragraph">The skeleton comes first, and I keep this site’s skeleton the same on every page. One
      header and one main; a footer where a page has one, as the gallery does. A nav named site, for the links that move
      you around the site. A section named pages and feedback, the rail that holds that nav and the feedback button.
      Where a page has tabs, a nav named by the tabs’ own label.</p>
    <p className="paragraph">Landmarks are what a screen reader lists and jumps to. Where one kind appears more than
      once, I name each, so a screen reader can tell them apart. The{' '}
    <a className="signpost" href={landmarkRegions}>Authoring Practices</a> put it plainly:{' '}
    <a className="signpost" href={landmarkRegions}>“If a specific landmark role is used more than once on a page,
      provide each instance of that landmark with a unique label.”</a> A section takes its name from its heading or,
      where it has none, from a label. If there is nothing to name it by, it is not a section. The landmark elements,
      header, main, footer and nav, come from the standard the browser makers began writing themselves in the{' '}
    <MomentLink to="browsersTakePen">2004 moment</MomentLink>.</p>
    <LandmarkMap/>
    <p className="paragraph">One region on every page is a role and not an element, and that is the element rule from
      its other side: I write a role only where no element does the job. The banners are a section with
      the role alert, because there is no alert element to reach for. The role makes the section a live region.
      The{' '}
    <Link className="signpost" to={demoAddress(DemoTopics.zIndex)}>z-index tab</Link> builds it and says what the role
      buys, a screen reader announcing a new note without being asked. It is one of the few roles this site writes; the
      part on ARIA below lists them all.</p>
    <h3 className="paragraph bold" id={elementsPart} tabIndex={-1}>From the content to the element</h3>
    <p className="paragraph">I start from what the content is and pick the element for it. The platform
      has more elements than most pages use: a{' '}
    <a className="signpost"
      href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/search">search</a> landmark,
      a{' '}
    <a className="signpost"
      href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress">progress</a> element,
      an <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output">output</a> for
      a computed result. The answer to "what is this?" is usually an element’s name.
      Semantic markup is the first objective listed in the <MomentLink to="html5SaysIt">October 2014
        moment</MomentLink>.</p>
    <p className="paragraph">The element is the name. It tells the browser, a screen reader and the next developer at
      once
      what the thing is, so I choose it first and make a new one only for a behavior that has no element.</p>
    <p className="paragraph">The platform’s elements each bring a behavior the page then does not have to write.
      A <Mdn path="Web/HTML/Element/details">details</Mdn> opens and shuts and reports its state with a <code
      className="monospaced">toggle</code> event.
      A modal <Mdn path="Web/HTML/Element/dialog">dialog</Mdn> holds focus, makes the rest of the page inert
      behind its backdrop, and closes on Escape. A <Mdn path="Web/HTML/Global_attributes/popover">popover</Mdn> lives
      in the top layer and closes on Escape or a click outside it. A <Mdn path="Web/HTML/Element/form">form</Mdn>{' '}
      refuses an empty required field in the browser’s own words. An{' '}
    <Mdn path="Web/HTML/Element/output">output</Mdn> is announced when its contents change. A{' '}
    <Mdn path="Web/HTML/Element/fieldset">fieldset</Mdn> groups controls under its{' '}
    <Mdn path="Web/HTML/Element/legend">legend</Mdn>. A th with <Mdn path="Web/HTML/Element/th#scope"><code
      className="monospaced">scope</code></Mdn>{' '}
      tells a screen reader which header a cell belongs to.{' '}
    <Mdn path="Web/API/Invoker_Commands_API">Invoker commands</Mdn> open a popover or a dialog with no script, and
      where a browser lacks them a click handler is the fallback, as the feedback dialog does. I reach for one of
      these before any script.</p>
    <p className="paragraph">Three attributes carry three jobs. A data attribute attaches a behavior:{' '}
      <code className="monospaced">data-row-grip</code> says a grip can be dragged, and the script finds grips by it. A
      class says how the element looks, in the
      vocabulary the Presentation tab describes. An id locates one thing: a label’s for, a section’s aria-labelledby,
      a fragment link. Three jobs on three attributes, so none is overloaded: no behavior hung on a class, no look
      hung on an id.</p>
    <p className="paragraph">The tables demo builds the same table twice, and its header cell shows all three at
      once.</p>
    <HeaderCellCarve/>
    <p className="paragraph">The class list is the look. The id locates the one table of live
      aggregations. <code className="monospaced">data-drag-sortable</code> says the table can be sorted by dragging.
      On the cell, <code className="monospaced">data-column</code> names its column for the script, so the column’s
      name in the class list only dresses it.
      Inside the cell, <code className="monospaced">data-resize-handle</code> and <code
      className="monospaced">data-sort-toggle</code> sit on the buttons that do those things.{' '}
    <code className="monospaced">popovertarget</code> names the sort menu by its id, and the menu is a menu element, a
      popover, whose buttons
      close it with <code className="monospaced">popovertargetaction</code> set to hide. Every element is a real one
      with its role, th with{' '}
    <code className="monospaced">scope</code> col, button, menu, li, and nothing here needs ARIA beyond a name.</p>
    <p className="paragraph">The script attaches itself by the same attribute, <code
      className="monospaced">data-drag-sortable</code>.</p>
    <AttachmentCarve/>
    <p className="paragraph"><code className="monospaced">boot.ts</code>, in its <code
      className="monospaced">feed</code> function, finds its tables with{' '}
    <code className="monospaced">table[data-drag-sortable]</code>, builds the behavior onto each, and listens for what
      the table reports: <code className="monospaced">column-moved</code>, <code
      className="monospaced">row-moved</code> and <code className="monospaced">sorted</code>, custom
      events on the table itself, the way a platform element reports <code className="monospaced">change</code> or <code
      className="monospaced">toggle</code>. The page dispatches what happened to its store, and the state
      decides what is true. That is the <Link className="signpost" to={practiceAddress('Behavior')}>Behavior
        tab</Link>’s split, and the structure makes it possible: the element says what happened and does not decide
      what to do about it.</p>
    <p className="paragraph">In React, components write the same markup, each one a new element. Below, the plain
      header cell comes first, then the lines in the React build that write the same cell.</p>
    <ColumnBesideCarve/>
    <p className="paragraph">DraggableColumn writes the th and carries a column. RowGrip writes the grip button and
      can be dragged by hand or by key. ResizeHandle writes the resize button, and SortMenu the popover menu. Each
      renders a real element with its role and its keys and adds the one behavior the platform lacks, and both builds
      share the state under them, so the line between the platform and the framework is the line between the markup
      and the components.</p>
    <h3 className="paragraph bold">Components, one behavior each</h3>
    <p className="paragraph">A component is an element that does not exist yet. I write one to add a behavior the
      platform has no element for: a table whose columns and rows can be dragged, a pill that glides between choices,
      a stack of banners that any page can raise. React is good at exactly that, and so are Vue, Svelte and Angular.
      A component in any of them writes a real element with its role and its keys, and attaches the behavior that is
      new. A component is not for wrapping an element the platform already has: that is the
      default. I keep a few wrappers that trade against it, where the trade is worth it:{' '}
    <a className="signpost" href={repository.file('src/components/Disclosure/Disclosure.tsx')}>Disclosure</a>, a
      details with a name and a class, and the menu’s Menu, Entry and Item, which write one element each and carry the
      site’s classes for it. Each saves a line every time it is used, and each costs the reader the doubt of whether it
      is a new element, which is why I say here that they are not. The test for a component is to name the behavior the
      platform lacks. If there is none, it
      is a wrapper, and I use the element bare.</p>
    <p className="paragraph">And one behavior each. When no element exists for what I need, I make one, for one
      behavior. I never make an element that does everything, what I call a swiss army element. A component that takes
      twenty
      props and does whatever they say is a div under a longer name: nothing about it says what it is, and every caller
      has to know all of it. One component, one new behavior, named for it, the way
      one class is one look. The drag-sortable table is not one component but parts that each do one thing:{' '}
    <a className="signpost" href={repository.file('src/components/DragSortableTable/RowGrip.tsx')}>RowGrip</a> can be
      dragged by
      hand or by key, <a className="signpost"
      href={repository.file('src/components/DragSortableTable/ResizeHandle.tsx')}>ResizeHandle</a>{' '}
      resizes, <a className="signpost"
      href={repository.file('src/components/DragSortableTable/SortMenu.tsx')}>SortMenu</a> sorts,{' '}
    <a className="signpost"
      href={repository.file('src/components/DragSortableTable/DraggableColumn.tsx')}>DraggableColumn</a>{' '}
      carries a column. The menu is three components that write one element each, as the{' '}
    <Link className="signpost" to={demoAddress(DemoTopics.zIndex)}>z-index tab</Link> says. A behavior the table needs
      that no part has gets a new part with that one job, not a prop on an old one. The platform’s own elements work the
      same way, one element per meaning: a details opens, a dialog holds focus, an output announces.</p>
    <p className="paragraph">This is also why the site’s new elements are React components and not custom elements. The
      standard’s custom elements give a new tag a name, and leave its role and its keys to the author; a component
      that renders a button has both from the element. The Record’s <Link className="signpost"
      to={customElementsAddress}>concert</Link> tells
      how the
      platform took back what script had built. The rule underneath is the first rule of ARIA, from the W3C’s Using
      ARIA:{' '}
    <a className="signpost" href="https://www.w3.org/TR/using-aria/">“If you can use a native HTML element or
      attribute
      with the semantics and behavior you require already built in, instead of re-purposing an element and adding an
      ARIA role, state or property to make it accessible, then do so.”</a></p>
    <h3 className="paragraph bold">ARIA last</h3>
    <p className="paragraph">The elements mean something beyond how they look. A nav tells a screen reader
      these links are for getting around; a button tells it a press will do something. The right element gives you
      that for free, with{' '}
    <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA">“built-in keyboard
      accessibility, roles and states”</a> in
      MDN’s words. Use a meaningless element instead and you rebuild all of it in script. The field has a saying,{' '}
    <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA">“No ARIA is better
      than bad ARIA”</a>: WebAIM
      found pages using ARIA had{' '}
    <a className="signpost" href="https://webaim.org/projects/million/">41 percent more detected errors</a> than
      pages without.
      The <MomentLink to="someoneNeedsComponents">2013 moment</MomentLink> records what that rebuilding cost: links
      became
      components and the back button became state.</p>
    <p className="paragraph">A div is for when I want an element that says nothing. Sometimes that is
      right, but the standard still calls it an element{' '}
    <a className="signpost" href="https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element">“of
      last resort, for when no other element is suitable”</a>.{' '}
      The survey above says most screen reader users move through a long page by its headings, and a page built of
      divs gives them nothing to move by. Everywhere else the element says what it is. A figure has its caption, a list
      is a list, and a button is a button even when it looks like a link.
      The standard that calls a div a last resort is the one the browser makers wrote themselves, from the{' '}
    <MomentLink to="browsersTakePen">2004 moment</MomentLink> on.</p>
    <p className="paragraph">Here is what ARIA last looks like on this site. Every role it writes can be read in a
      minute. The banners are a section with role <code className="monospaced">alert</code>, and the old-style banner
      the{' '}
    <Link className="signpost" to={demoAddress(DemoTopics.zIndex)}>z-index tab</Link> raises, a paragraph, carries the
      same role, because there is no alert element. The z-index tab’s old-way menu, the one script opens to show what
      the platform now does for free, is a menu element holding a list of buttons, with role{' '}
    <code className="monospaced">menu</code> and <code className="monospaced">menuitem</code>, and role{' '}
    <code className="monospaced">none</code> on each list item. A screen reader reads a menu element as a list, not as a menu, and
      the list item’s own
      role would get in the way. The popover menu beside it carries no role at all. A term’s definition, the small card
      that opens from a word in a tutorial, has role <code className="monospaced">definition</code>. The Record’s period
      samples are a pre with
      role <code className="monospaced">group</code> and a name, so a screen reader can land on a sample as one thing.
      That is the whole list. Each
      role but <code className="monospaced">none</code> is there because no element carries that meaning; <code
      className="monospaced">none</code> is there to take a meaning
      away.</p>
    <p className="paragraph">Names are on the places that need them: every landmark that appears more than once, the
      feedback dialog, the rail, and every button whose text is a glyph, the dismiss on a banner, the grip on a row,
      the resize handle on a column.</p>
    <p className="paragraph">States come from the platform wherever it has one, <code
      className="monospaced">open</code> on a details,{' '}
    <code className="monospaced">checked</code> on a box, <code className="monospaced">disabled</code> on a button.
      I write four by hand, where the platform has none.{' '}
    <code className="monospaced">aria-sort</code> marks which way a th’s column is sorted, because a th has no sort state of
      its own.{' '}
    <code className="monospaced">aria-current</code> marks the one of several that is current: the rail’s page, a tab,
      a menu’s chosen item.{' '}
    <code className="monospaced">aria-expanded</code> says that a button has opened something the platform does not
      know is open: the old-way
      menu’s, and the Expand button on the z-index tab’s pile of cards. <code
      className="monospaced">aria-hidden</code> hides what a screen reader should not read as prose. An image’s{' '}
    <code className="monospaced">alt</code> is its text for a screen reader. I hide each drawing whole, since its
      caption says what it shows: a drawing in the page’s markup by <code className="monospaced">aria-hidden</code>,
      and a drawing served as an image, like the landmark map, by an empty <code className="monospaced">alt</code>. I
      hide the lettering of a glyph, a dial’s axis label and a code
      sample’s language label, since the button’s, the dial’s or the sample’s name already says it.</p>
    <p className="paragraph">So the rule, in one line: a name, always; a role, only where no element carries the
      meaning or I have to take one away; a state, only where the platform has none.</p>
    <h3 className="paragraph bold">The styles-off test</h3>
    <p className="paragraph">The test is to read the page with the styles turned off. It should still say
      everything it means, in order, because that is what search engines, reader modes and assistive technology
      read. If the meaning only appears once the CSS loads, it is in the wrong language.
      That is the <MomentLink to="documentComesBack">2016 moment</MomentLink>’s test: the document first, the program
      only where the page needs one.</p>
    <p className="paragraph">The styles-off test is not read by eye. Four gates hold the site to it on every push. Each
      is a few lines in the repository. The review, which reads the words and the code of every push, holds one more
      rule.</p>
    <ul className="practice-list">
      <li className="paragraph"><code className="monospaced">axe</code>, the accessibility checker, runs on every page
        at WCAG 2 A and AA, and runs
        the Record a second time with every fold open, since a fold’s story is not on the page until it opens.
      </li>
      <li className="paragraph"><code className="monospaced">html-validate</code> checks every page as the browser has
        rendered it, against its
        recommended rules. I switch four style rules off and change two on purpose. A group of checkboxes may
        share a name, as radios already may, and buttons may not. An id may hold what React’s server render writes,
        since{' '}
      <a className="signpost" href={repository.file('e2e/a11y.e2e.ts')}>“React's server render names its own
        script _R_, and HTML asks only that an id hold no space”</a>.
      </li>
      <li className="paragraph"><a className="signpost"
        href={repository.file('src/__test_support/reading-order.ts')}><code
          className="monospaced">outOfReadingOrder</code></a> takes a list of elements in the order a reader should meet
        them and returns any that come earlier in the document than the one before; the Home, Record, Practice and
        Demos specs call it wherever an order is a claim.
      </li>
      <li className="paragraph"><code className="monospaced">stylelint</code> refuses a selector on an obsolete element
        and prints{' '}
      <a className="signpost" href={repository.file('stylelint.config.js')}>“obsolete element — this is a strict
        html5 site”</a>.
      </li>
    </ul>
    <p className="paragraph">The rule the review holds is one line in AGENTS.md:{' '}
      <a className="signpost" href={repository.file('AGENTS.md')}>“Tests find what a reader finds: by role, label
        and text, never by class.”</a> A test that found a thing by its class would pass where a reader could not find
      it.</p>
  </>;
