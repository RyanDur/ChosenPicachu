import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from './moments';

const nextJsAnnouncement = 'https://vercel.com/blog/next';
const renderingOnTheWeb = 'https://web.dev/rendering-on-the-web/';
const islandsArchitecture = 'https://jasonformat.com/islands-architecture/';
const reactServerComponents = 'https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html';
const nextThirteenFour = 'https://nextjs.org/blog/next-13-4';

export const DocumentComesBack: FC = () =>
  <Moment heading={moments.headings.documentComesBack}
    summary={<>The question this time was where the page is rendered. In October 2016 Next.js opened as a framework for
      server-rendered pages, sending real HTML first and attaching behavior after; static generation (pages rendered
      once, at build time), islands and server components refine it: the document first, the program where the page
      needs one. Single-page applications went on alongside them; the home page weighs the two ways, and the Behavior
      story counts the costs.</>}>
    <p className="paragraph muted-ink hyphenated">Next.js opened on 25 October 2016
      as <a className="signpost" href={nextJsAnnouncement}>“a small framework for server-rendered universal JavaScript webapps”</a>,
      built on React, with <a className="signpost" href={nextJsAnnouncement}>“Automatic server rendering and code
        splitting”</a> among its six principles. Static generation pre-rendered what never
      changes. <a className="signpost" href={renderingOnTheWeb}>Hydration</a>, in web.dev’s definition,
      is <a className="signpost" href={renderingOnTheWeb}>“Running client-side scripts to add application state and
        interactivity to server-rendered HTML”</a>, attaching listeners to markup that already stood. The first
      thing the browser drew was HTML again, and the program arrived second.</p>
    <p className="paragraph muted-ink hyphenated">Jason Miller <a className="signpost" href={islandsArchitecture}>documented the
      islands architecture</a> in 2020 and credits the name to Etsy’s Katie Sylor-Miller, from a meeting in 2019. The
      idea, in his words, is to <a className="signpost" href={islandsArchitecture}>“render HTML pages on the server, and inject
        placeholders or slots around highly dynamic regions”</a>, each later hydrated on the client into a small
      self-contained widget. A page is then <a className="signpost" href={islandsArchitecture}>“like a static HTML document
        that contains multiple separate embedded applications”</a>. Pages shipped as HTML with script only where
      an island of behavior lives, the static parts left as the documents they always were. React’s team
      announced its <a className="signpost" href={reactServerComponents}>“research into zero-bundle-size React
        Server Components”</a> on 21 December 2020, and Next.js 13.4,
      on <a className="signpost" href={nextThirteenFour}>4 May 2023</a>, shipped them stable in its App
      Router, and more of the rendering moved back to the server.</p>
    <p className="paragraph muted-ink hyphenated">Osmani and Miller, writing for Chrome in 2019
      from <a className="signpost" href={renderingOnTheWeb}>“talking to large sites over the past few
        years”</a>, <a className="signpost" href={renderingOnTheWeb}>“encourage developers to consider server-side rendering or
          static rendering over a full rehydration approach”</a>, and close
      on <a className="signpost" href={renderingOnTheWeb}>“It’s fine to mostly ship HTML with minimal JavaScript to get an
        experience interactive.”</a> Miller says what an island is a return
      to: <a className="signpost" href={islandsArchitecture}>“A closer analog to the ‘islands’ approach would be
        progressive enhancement, to which we’re essentially adding SSR hydration”</a>. That is a page that
      works as a document first, with script added to it. Every step is the same sentence: structure and
      content travel as HTML, behavior arrives as script, presentation stays declarative. What changed
      each time was where the rendering happens; the three responsibilities did not move.</p>
  </Moment>;
