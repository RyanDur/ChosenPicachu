import {FC} from 'react';
import {Link} from 'react-router';
import {Moment} from './Moment';
import {moments} from './moments';

const details = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details';
const dialog = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog';
const popover = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover';
const invokers = 'https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API';
const explainer = 'https://open-ui.org/components/popover.research.explainer/';
const scope = 'https://developer.mozilla.org/en-US/docs/Web/CSS/@scope';

export const ElementsArrive: FC = () =>
  <Moment of={moments.elementsArrive}
    tells={<>For years a page that wanted a fold, a modal dialog or a menu over its content had no element for it. One at a time the platform gave each a home in the markup, and by December 2025 a button could open any of them with no script.</>}>
    <p className="paragraph muted-ink hyphenated">The fold came first. The <a className="signpost" href={details}>details</a> element opens and shuts its contents with no script, and MDN dates it in every engine since January 2020. The <a className="signpost" href={dialog}>dialog</a> element followed, in every engine since March 2022. Opened as a modal, it holds focus and makes the page behind it inert: nothing behind it can be clicked or reached by Tab.</p>
    <p className="paragraph muted-ink hyphenated">The menu took longer. Open UI, the group of browser engineers and authors who study the controls sites build, opened its explainer with the gap: <a className="signpost" href={explainer}>“A very common UI pattern on the Web, for which there is no native API, is ‘popover UI’”</a>. One of its goals was to <a className="signpost" href={explainer}>“Avoid the need for any JavaScript for most common cases”</a>. The <a className="signpost" href={popover}>popover</a> attribute shipped in every engine in April 2024: any element can open in the top layer, above everything else, and close on Escape or a click outside it.</p>
    <p className="paragraph muted-ink hyphenated">Opening one still took a click handler until <a className="signpost" href={invokers}>invoker commands</a> let a button name the dialog or popover it opens, in every engine since December 2025. <Link className="signpost" to={`#${moments.someoneNeedsComponents.id}`}>The 2013 moment</Link> tells how components began in script. The Record reads this as the same need answered in the markup, as <a className="signpost" href={scope}>@scope</a> answered it in the style sheet.</p>
  </Moment>;
