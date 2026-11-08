import {FC} from 'react';
import {Link} from 'react-router';
import {Moment} from './Moment';
import {moments} from './moments';

const detailsElement = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details';
const dialogElement = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog';
const popoverAttribute = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover';
const invokerCommands = 'https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API';
const popoverExplainer = 'https://open-ui.org/components/popover.research.explainer/';
const scopeAtRule = 'https://developer.mozilla.org/en-US/docs/Web/CSS/@scope';

export const ElementsArrive: FC = () =>
  <Moment heading={moments.headings.elementsArrive}
    summary={<>For years a page that wanted a fold, a modal dialog or a menu over its content had no element for it. One
      at a time the platform gave each an element or an attribute, and by December 2025 a button could open the dialog
      or the menu with no script.</>}>
    <p className="paragraph muted-ink hyphenated">The fold came first.
      The <a className="signpost" href={detailsElement}>details</a> element opens and shuts its contents with no script, and
      MDN dates it in every engine since January 2020. The <a className="signpost" href={dialogElement}>dialog</a> element
      followed, in every engine since March 2022. Opened as a modal, it holds focus and makes the page behind it
      inert: nothing behind it can be clicked or reached by Tab.</p>
    <p className="paragraph muted-ink hyphenated">The menu took longer. Open UI, the group of browser engineers and
      authors who study the controls sites build, opened its explainer with the
      gap: <a className="signpost" href={popoverExplainer}>“A very common UI pattern on the Web, for which there is no native
        API, is ‘popover UI’”</a>. One of its goals was to <a className="signpost" href={popoverExplainer}>“Avoid the need for
          any JavaScript for most common cases”</a>. The <a className="signpost" href={popoverAttribute}>popover</a> attribute
      shipped in every engine in April 2024: any element can open in the top layer, above everything else, and
      close on Escape or a click outside it.</p>
    <p className="paragraph muted-ink hyphenated">Opening one still took a click handler
      until <a className="signpost" href={invokerCommands}>invoker commands</a> let a button name the dialog or popover it
      opens, in every engine since December
      2025. <Link className="signpost" to={`#${moments.headings.someoneNeedsComponents.id}`}>The 2013 moment</Link> tells how
      components began in script. The Record reads this as the same need answered in the markup,
      as <a className="signpost" href={scopeAtRule}>@scope</a> answered it in the style sheet.</p>
  </Moment>;
