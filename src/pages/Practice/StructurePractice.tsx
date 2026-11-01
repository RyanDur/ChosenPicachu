import {FC} from 'react';
import {MomentLink} from '@pages/Record/MomentLink';

const understanding = (criterion: string): string => `https://www.w3.org/WAI/WCAG22/Understanding/${criterion}.html`;
const survey = 'https://webaim.org/projects/screenreadersurvey10/';

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
    <p className="paragraph">The rest of this tab takes the first four in turn.</p>
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
    <p className="paragraph">The skeleton comes first: one header, one main, one footer, and a nav for the
      links that move you around the site. Landmarks are the page’s table of contents, so every landmark gets a name
      and no two are the same. A section is named by its heading; if there is nothing to name it by, it is not a
      section.
      The landmark elements, header, main, footer and nav, come from the standard the browser makers began writing
      themselves in the <MomentLink to="browsersTakePen">2004 moment</MomentLink>.</p>
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
      The survey above says how screen reader users move through a long page, by its headings, and a page built of
      divs gives them nothing to move by. Everywhere else the element says what it is: a figure has its caption, a list is a list, a
      button is a button even when it looks like a link.
      The standard that calls a div a last resort is the one the browser makers wrote themselves, from the{' '}
    <MomentLink to="browsersTakePen">2004 moment</MomentLink> on.</p>
    <p className="paragraph">The test is to read the page with the styles turned off. It should still say
      everything it means, in order, because that is what search engines, reader modes and assistive technology
      read. If the meaning only appears once the CSS loads, it is in the wrong language.
      That is the <MomentLink to="documentComesBack">2016 moment</MomentLink>’s test: the document first, the program only where the page needs one.</p>
  </>;
