import {FC} from 'react';
import {Link} from 'react-router';
import {Moment} from './Moment';
import {moments} from './moments';

const react = 'https://legacy.reactjs.org/blog/2013/06/05/why-react.html';
const talk = 'https://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html';
const saga = 'https://www.w3.org/Style/LieBos2e/history/Overview.html';
const shadowDom = 'https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM';
const customElements = 'https://html.spec.whatwg.org/multipage/custom-elements.html';
const scope = 'https://developer.mozilla.org/en-US/docs/Web/CSS/@scope';

export const SomeoneNeedsComponents: FC = () =>
  <Moment of={moments.someoneNeedsComponents}
    tells={<>Interfaces had grown into applications, and their builders needed components:
      self-contained pieces that carry structure, style, and behavior together, and styles
      that stay where they are put. The platform did not have them yet, so JavaScript built
      them first.</>}>
    <p className="paragraph muted-ink hyphenated">Script built the components first, and React said what a component was. Pete Hunt’s post of June 2013, <a className="signpost" href={react}>“Why did we build React?”</a>, opens with what it is not, <a className="signpost" href={react}>“React isn’t an MVC framework”</a>, and then what it is: <a className="signpost" href={react}>“React is a library for building composable user interfaces. It encourages the creation of reusable UI components which present data that changes over time.”</a> A component’s render returns <a className="signpost" href={react}>“neither a string nor a DOM node — it’s a lightweight description of what the DOM should look like”</a>, and React redraws the page from it. Components arrived in script, and the single-page application, the shape of <Link className="signpost" to={`#${moments.frameworks.id}`}>the 2010 moment</Link>, moved the whole document there with them: the server sent an empty body and a bundle, and until the script ran there was no page. The application now emitted the document.</p>
    <p className="paragraph muted-ink hyphenated">Style followed structure into script as CSS-in-JS. The term’s start is <a className="signpost" href={talk}>Christopher Chedeau’s talk</a> at NationJS in November 2014, cataloging CSS-at-scale problems at Facebook; his own summary is that it <a className="signpost" href={talk}>“attempts to show that CSS has fundamental flaws and writing styling in JS solves most of the problem without even trying”</a>. The web had run this experiment before, as JavaScript Style Sheets, when Netscape 4 rendered style by <a className="signpost" href={saga}>“translating CSS rules into snippets of Javascript”</a>; this time the industry’s weight was behind it.</p>
    <p className="paragraph muted-ink hyphenated">Building the page in script had a price: blank first paints, fragile crawls, a document that cannot be read without executing a program. And the document’s own habits had to be rebuilt by hand. Links became components, the back button became state, scroll restoration and URL fragments became libraries, and the frameworks grew routers and scroll managers to re-create behaviors the browser had shipped for twenty years.</p>
    <p className="paragraph muted-ink hyphenated">The platform has been answering the need ever since, absorbing what script proved. Custom properties took over the theme variables. <a className="signpost" href={shadowDom}>Shadow DOM</a> gave styles a boundary, since <a className="signpost" href={shadowDom}>“the styles defined in the shadow DOM tree are scoped to that tree, so just as page styles don’t affect elements in the shadow DOM, shadow DOM styles don’t affect elements in the rest of the page”</a>. <a className="signpost" href={customElements}>Custom elements</a> gave components a home in markup itself. And @scope, which <a className="signpost" href={scope}>“works across the latest devices and browser versions”</a> since March 2026, is the newest arrival in the same direction.</p>
  </Moment>;
