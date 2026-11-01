import {FC} from 'react';
import {Link} from 'react-router';
import {MomentLink} from '@pages/Record/MomentLink';
import {demoAddress, DemoTopics} from '@pages/Demos/types';
import {Mdn} from '@pages/Demos/Recipe';
import {LandmarkMap} from './LandmarkMap';
import {AttachmentCarve, ColumnBesideCarve, HeaderCellCarve} from './TableCarves';
import {practiceAddress} from './types';

const understanding = (criterion: string): string => `https://www.w3.org/WAI/WCAG22/Understanding/${criterion}.html`;
const survey = 'https://webaim.org/projects/screenreadersurvey10/';
const landmarkRegions = 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/';

export const StructurePractice: FC = () =>
  <>
    <p className="paragraph">Markup is read by more than the browser. A screen reader reads it for roles, names and
      states, and for a way to move. On a long page most screen reader users go to the headings first: 71.6% in{' '}
    <a className="signpost" href={survey}>WebAIM’s tenth survey</a> said they{' '}
    <a className="signpost" href={survey}>“navigate through the headings on the page”</a>, and a few go to the
      landmarks. Reader view and a search engine read it for the content in order, with its meaning. The next
      developer reads it to see what the page is. The browser reads it for the behavior each element brings.
      Organizing markup has to give all five the same answer from the same elements.</p>
    <p className="paragraph">So five things have to be true of the markup, and WCAG, the W3C’s accessibility
      guidelines, names four of them.</p>
    <dl className="needs">
      <div className="need">
        <dt className="paragraph bold">Meaning</dt>
        <dd className="paragraph">What each thing is, carried by the markup and not by the look
          (<a className="signpost" href={understanding('info-and-relationships')}>1.3.1, Info and Relationships</a>).</dd>
      </div>
      <div className="need">
        <dt className="paragraph bold">Order</dt>
        <dd className="paragraph">What comes before what, so a reading sequence can be worked out from the markup
          (<a className="signpost" href={understanding('meaningful-sequence')}>1.3.2, Meaningful Sequence</a>).</dd>
      </div>
      <div className="need">
        <dt className="paragraph bold">Names</dt>
        <dd className="paragraph">What each region and control is called
          (<a className="signpost" href={understanding('headings-and-labels')}>2.4.6, Headings and Labels</a>), with
          a way past what repeats on every page
          (<a className="signpost" href={understanding('bypass-blocks')}>2.4.1, Bypass Blocks</a>).</dd>
      </div>
      <div className="need">
        <dt className="paragraph bold">Behavior</dt>
        <dd className="paragraph">What presses, opens and submits, with its name, role and state known to the tools
          (<a className="signpost" href={understanding('name-role-value')}>4.1.2, Name, Role, Value</a>).</dd>
      </div>
      <div className="need">
        <dt className="paragraph bold">Identity</dt>
        <dd className="paragraph">How one thing is found, by the next developer and by the script. No criterion
          covers it.</dd>
      </div>
    </dl>
    <p className="paragraph">The rest of this tab takes each of the five in turn.</p>
    <p className="paragraph">The skeleton comes first, and this site’s is the same on every page: one header, one main
      and one footer; a nav named site, for the links that move you around the site; a section named pages and
      feedback, the rail that holds that nav and the feedback button; and, where a page has tabs, a nav named by the
      tabs’ own label. Landmarks are the page’s table of contents: a screen reader lists them and jumps to any, so each
      kind that appears more than once gets a name that tells them apart. The{' '}
    <a className="signpost" href={landmarkRegions}>Authoring Practices</a> put it plainly:{' '}
    <a className="signpost" href={landmarkRegions}>“If a specific landmark role is used more than once on a page,
      provide each instance of that landmark with a unique label.”</a> A section is named by its heading; if there is
      nothing to name it by, it is not a section. The landmark elements, header, main, footer and nav, come from the
      standard the browser makers began writing themselves in the <MomentLink to="browsersTakePen">2004 moment</MomentLink>.</p>
    <LandmarkMap/>
    <p className="paragraph">One landmark on every page is a role and not an element. The banners are a section with the
      role alert, held in the top layer, because there is no alert element to reach for; the{' '}
    <Link className="signpost" to={demoAddress(DemoTopics.zIndex)}>z-index tab</Link> builds it and says what the role
      buys, a screen reader announcing a new note without being asked. It is one of the few roles this site writes,
      and the part on ARIA below says which and why.</p>
    <p className="paragraph">I start from what the content is and pick the element for it. The platform
      has more elements than most pages use: a{' '}
    <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/search">search</a> landmark,
      a{' '}
    <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress">progress</a> element,
      an <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output">output</a> for
      a computed result. The answer to "what is this?" is usually an element’s name.
      Semantic markup is the first objective listed in the <MomentLink to="html5SaysIt">2014 moment</MomentLink>.</p>
    <p className="paragraph">The element is the name. It tells the browser, a screen reader and the next developer at once
      what the thing is, so I choose it first and make a new one only for a behavior that has no element.</p>
    <p className="paragraph">The platform’s elements each bring a behavior the page then does not have to write.
      A <Mdn path="Web/HTML/Element/details">details</Mdn> opens and shuts and reports its state with a toggle
      event. A modal <Mdn path="Web/HTML/Element/dialog">dialog</Mdn> holds focus, makes the rest of the page inert
      behind its backdrop, and closes on Escape. A <Mdn path="Web/HTML/Global_attributes/popover">popover</Mdn> lives
      in the top layer and closes on Escape or a click outside it. A <Mdn path="Web/HTML/Element/form">form</Mdn>{' '}
      refuses an empty required field in the browser’s own words. An{' '}
    <Mdn path="Web/HTML/Element/output">output</Mdn> is announced when its contents change. A{' '}
    <Mdn path="Web/HTML/Element/fieldset">fieldset</Mdn> groups controls under its{' '}
    <Mdn path="Web/HTML/Element/legend">legend</Mdn>. A th with <Mdn path="Web/HTML/Element/th#scope">scope</Mdn>{' '}
      tells a screen reader which header a cell belongs to.{' '}
    <Mdn path="Web/API/Invoker_Commands_API">Invoker commands</Mdn> open a popover or a dialog with no script, and
      where a browser lacks them a click handler is the fallback, as the feedback dialog does. I reach for one of
      these before any script.</p>
    <p className="paragraph">Three attributes carry three jobs. A data attribute attaches a behavior: data-row-grip
      says a grip can be dragged, and the script finds grips by it. A class says how the element looks, in the
      vocabulary the Presentation tab describes. An id locates one thing: a label’s for, a section’s aria-labelledby,
      a fragment link. Three jobs on three attributes, so none is overloaded: no behavior hung on a class, no look
      hung on an id.</p>
    <p className="paragraph">The tables demo builds the same table twice, and its header cell shows all three at
      once.</p>
    <HeaderCellCarve/>
    <p className="paragraph">The class list is the look. The id locates the one live table. data-drag-sortable says
      the table can be sorted by dragging, and inside the cell data-resize-handle and data-sort-toggle sit on the
      buttons that do those things. popovertarget names the sort menu by its id, and the menu is a menu element, a
      popover, whose buttons close it with popovertargetaction set to hide. Every element is a real one with its
      role, th with scope col, button, menu, li, and nothing here needs ARIA beyond a name.</p>
    <p className="paragraph">The script attaches itself by the same attribute.</p>
    <AttachmentCarve/>
    <p className="paragraph">boot finds its tables with table[data-drag-sortable], builds the behavior onto each, and
      listens for what the table reports: column-moved, row-moved and sorted, custom events on the table itself, the
      way a platform element reports change or toggle. The page dispatches what happened to its store, and the state
      decides what is true. That is the <Link className="signpost" to={practiceAddress('Behavior')}>Behavior
        tab</Link>’s split, and the structure makes it possible: the element says what happened and does not decide
      what to do about it.</p>
    <p className="paragraph">In React the same markup is written by components, each one new element.</p>
    <ColumnBesideCarve/>
    <p className="paragraph">DraggableColumn writes the th and carries a column. RowGrip writes the grip button and
      can be dragged by hand or by key. ResizeHandle writes the resize button, and SortMenu the popover menu. Each
      renders a real element with its role and its keys and adds the one behavior the platform lacks, and both builds
      share the state under them, so the line between the platform and the framework is the line between the markup
      and the components. The plain build comes first here and the component that is its equivalent beside it; the
      next part says what a component is for.</p>
    <p className="paragraph">The elements mean something beyond how they look. A nav tells a screen reader
      these links are for getting around; a button tells it a press will do something. The right element gives you
      that for free, with{' '}
    <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA">“built-in keyboard accessibility, roles and states”</a> in
      MDN’s words. Use a meaningless element instead and you rebuild all of it in script. The field has a saying,{' '}
    <a className="signpost" href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA">“No ARIA is better than bad ARIA”</a>: WebAIM
      found pages using ARIA had{' '}
    <a className="signpost" href="https://webaim.org/projects/million/">41 percent more detected errors</a> than
      pages without.
      The <MomentLink to="someoneNeedsComponents">2013 moment</MomentLink> records what that rebuilding cost: links became
      components and the back button became state.</p>
    <p className="paragraph">A div is for when I want an element that says nothing. Sometimes that is
      right, but the standard still calls it an element{' '}
    <a className="signpost" href="https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element">“of last resort, for when no other element is suitable”</a>.{' '}
      The survey above says most screen reader users move through a long page by its headings, and a page built of
      divs gives them nothing to move by. Everywhere else the element says what it is: a figure has its caption, a list is a list, a
      button is a button even when it looks like a link.
      The standard that calls a div a last resort is the one the browser makers wrote themselves, from the{' '}
    <MomentLink to="browsersTakePen">2004 moment</MomentLink> on.</p>
    <p className="paragraph">The test is to read the page with the styles turned off. It should still say
      everything it means, in order, because that is what search engines, reader modes and assistive technology
      read. If the meaning only appears once the CSS loads, it is in the wrong language.
      That is the <MomentLink to="documentComesBack">2016 moment</MomentLink>’s test: the document first, the program only where the page needs one.</p>
  </>;
