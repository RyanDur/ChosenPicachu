import {FC, ReactNode} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import './Home.css';

const source = (href: string) => ({className: 'signpost', href});

const beats: {year: string, title: string, tells: ReactNode, rest: ReactNode}[] = [
  {
    year: '1989',
    title: 'Someone needed something',
    tells: <>Thousands of researchers at CERN, documents scattered across incompatible machines,
      and knowledge lost every time a team moved on. Tim Berners-Lee{' '}
      <a {...source('https://www.w3.org/History/1989/proposal.html')}>proposed linking documents
      into a web of nodes</a>, so what was known could be found.</>,
    rest: <><p className="paragraph">The proposal asked for a web of nodes: documents joined by
      hypertext, readable from any machine. The program Berners-Lee built to prove it was a
      browser and an editor in one; reading and writing the web were the same act. The point
      was never pages. It was information that could be found.</p></>
  },
  {
    year: '1990',
    title: 'Structure arrives',
    tells: <>He wrote HTML on SGML’s shoulders and{' '}
      <a {...source('http://info.cern.ch/hypertext/WWW/MarkUp/Tags.html')}>added one tag of his
      own: the anchor</a>. With HTTP to fetch documents and{' '}
      <a {...source('https://worldwideweb.cern.ch/browser/')}>a browser-editor</a> to read them,
      content had structure and a way to travel.</>,
    rest: <><p className="paragraph">The first HTML held eighteen tags, borrowed from SGML so it
      would look familiar to the documents world; the invention was the anchor. HTTP spoke
      only GET and returned only HTML. When new browsers invented tags of their own, HTML 2.0
      was written in 1994 by standardizing the most popular of them: the specification
      following the field, not leading it.</p></>
  },
  {
    year: '1994',
    title: 'Presentation leaves home, on purpose',
    tells: <>Håkon Wium Lie{' '}
      <a {...source('https://www.w3.org/People/howcome/p/cascade.html')}>drafted Cascading HTML
      Style Sheets</a>, encouraged by Dave Raggett, who had realized HTML should{' '}
      <a {...source('https://www.w3.org/Style/LieBos2e/history/Overview.html')}>never become a
      page-description language</a>. Presentation was separated from structure by decision, not
      by accident.</>,
    rest: <><p className="paragraph">Style existed before CSS did. Berners-Lee’s NeXT browser had
      style sheets, but he kept the syntax private, considering presentation each browser’s
      own business; Pei Wei’s Viola carried its own style language in 1992; Bert Bos was
      building the customizable Argo; Dave Raggett’s Arena became the testbed. The same year
      the draft went out, Berners-Lee founded the W3C to keep the browsers converging.</p></>
  },
  {
    year: '1994',
    title: 'The cascade is a settlement',
    tells: <>The proposal{' '}
      <a {...source('https://www.w3.org/Style/LieBos2e/history/Overview.html')}>balanced two
      voices</a>: the author, who must be able to decide how a document presents, and the user,
      whose eyes have to decode it. Some argued style needed a full programming language; CSS
      chose a simple, declarative format instead.</>,
    rest: <><p className="paragraph">At the 1995 WWW conference the presentations turned political:
      authors argued they had to control presentation, sometimes for legal reasons, while the
      other side held that the user, whose eyes and ears decode the page, should win a
      conflict. The cascade is the treaty. The www-style mailing list opened, the W3C’s
      editorial review board took CSS as a work item, and in 1996 CSS1 became a
      Recommendation.</p></>
  },
  {
    year: '1995',
    title: 'Behavior is born to serve',
    tells: <>Brendan Eich{' '}
      <a {...source('https://auth0.com/blog/a-brief-history-of-javascript/')}>built JavaScript in
      ten days</a>, as{' '}
      <a {...source('https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html')}>a
      complementary scripting language</a>: something that could touch the elements of a page,
      change their properties, and respond to events. Smarts for documents, usable by amateurs,
      not an application platform.</>,
    rest: <><p className="paragraph">Netscape recruited Eich to put Scheme in the browser, then
      management ruled the result must look like Java. It shipped inside Netscape as Mocha,
      became LiveScript, and landed as JavaScript once Netscape and Sun aligned, positioned
      as the complementary language beside Java’s applets. Microsoft reverse-engineered it as
      JScript, the trademark could not be shared, and the standard took the name ECMAScript,
      which nobody ever loved. Jeremy Keith’s summary of the relationship: Java is to
      JavaScript as ham is to hamster.</p></>
  },
  {
    year: '1996',
    title: 'The blur',
    tells: <>The browser wars{' '}
      <a {...source('https://thehistoryoftheweb.com/the-rise-of-css/')}>poured presentation into
      markup</a>: font, center, tags invented per vendor. Netscape even implemented CSS by{' '}
      <a {...source('https://www.w3.org/Style/LieBos2e/history/Overview.html')}>translating it
      into JavaScript</a>; the experiment was never completed and is deprecated. The same page
      looked broken in the other browser.</>,
    rest: <><p className="paragraph">Mosaic-era markup said it plainly:</p>
      <pre className="period-markup"><code>{'<MULTICOL COLS="3" GUTTER="25">\n  <P><FONT SIZE="4" COLOR="RED">This would be some font broken up into columns</FONT></P>\n</MULTICOL>'}</code></pre>
      <p className="paragraph">Layout and paint, written as structure. The font tag made it
      into HTML 3.2, Netscape’s first beta shipped center, and Netscape 4 ran CSS by
      translating each rule into a snippet of JavaScript: style as script, never completed,
      now deprecated.</p></>
  },
  {
    year: '1998',
    title: 'The correction grinds',
    tells: <>CSS2 arrived, and{' '}
      <a {...source('https://www.w3.org/Style/CSS/Test/CSS1/current/test5526c.htm')}>the Acid
      Test</a> measured who honored it; in the beginning, most browsers failed. It took until
      2000 for a browser to pass 99% of CSS1, and until 2002 for the first full
      implementation.</>,
    rest: <><p className="paragraph">CSS1 already held fonts, colors, spacing, margins, borders,
      and classification; Internet Explorer supported it first, minus most of the box model,
      and Netscape followed. CSS2 added z-index, media types, and positioning. Todd Fahrner’s
      test drew one arranged page that a browser rendered correctly or failed; IE for Mac
      passed 99% of CSS1 in March 2000, the first full implementation came in 2002, and that
      year Wired relaunched on semantic HTML and CSS. The buggy parts took another decade:
      CSS 2.1 became a formal Recommendation in 2011.</p></>
  },
  {
    year: '2003',
    title: 'Zen Garden proves it',
    tells: <>Dave Shea published{' '}
      <a {...source('http://csszengarden.com/')}>one HTML document</a> and invited the world to
      restyle it. Hundreds of designs, not one change to the markup: the same structure, any
      presentation, separation as art.</>,
    rest: <><p className="paragraph">The garden ran on work begun in 1999: CSS3 split into modules,
      with selectors, color, and media queries released as separate recommendations rather
      than one monolith. Shea held the markup constant and let hundreds of designers replace
      only the stylesheet: the demonstration the industry needed to believe separation was
      power, not constraint.</p></>
  },
  {
    year: '2014',
    title: 'HTML5 says it out loud',
    tells: <>The specification{' '}
      <a {...source('https://www.infoq.com/news/2011/05/html5-design/')}>made the philosophy
      explicit</a>: semantic markup, accessibility, and, in its own words,{' '}
      <a {...source('https://html.com/html5/')}>reducing the overlap between HTML, CSS, and
      JavaScript</a>. What began as a design decision became the standard’s language.</>,
    rest: <><p className="paragraph">The principles in full: semantic markup; separation of design
      from content; accessibility and responsiveness; rich media without plugins like Flash
      or Java; and reducing the overlap between the three languages. And a quiet break with
      the past: HTML5 is no longer SGML. The language finally describes itself.</p></>
  },
  {
    year: 'Today',
    title: 'This site',
    tells: <>Three languages, three responsibilities, in concert. Every demo here builds a real
      feature on that architecture, twice: once with the three languages raw, and once with
      React speaking the same three.</>,
    rest: <><p className="paragraph"><a {...source('https://immagic.com/eLibrary/ARCHIVES/GENERAL/ADTVPATH/A050218G.pdf')}>Ajax</a>{' '}
      arrived in 2005 and made Eich’s livelier web real: pages that acted like applications.
      jQuery followed in 2006 to paper over the incompatibilities the wars left behind. Then
      the frameworks: AngularJS in 2010, React in 2013, Vue in 2014. Every one of them still
      writes the same three languages, which is why every demo here is built twice: once with
      the three raw, and once with React speaking the same three. That seam is what this site
      exists to show.</p></>
  }
];


export const HomePage: FC = () =>
  <article className="home">
    <blockquote className="feedback">
      <p className="quote">
        HyperText is a way to link and access information of various kinds as a web of nodes
        in which the user can browse at will.
      </p>
      <footer className="attribution">Tim Berners-Lee and Robert Cailliau,{' '}
        <a {...source('https://www.w3.org/History/19921103-hypertext/hypertext/WWW/Proposal.html')}>proposing
        the WorldWideWeb, 1990</a></footer>
    </blockquote>
    <p className="thesis paragraph">
      Someone needed something: researchers, scattered across institutes, losing each other’s
      documents. Everything on the web is layered onto that one need.
    </p>
    <p className="thesis paragraph">
      A webpage is three languages working in concert. HTML says what things are. CSS says how
      they show. JavaScript says how they respond. They were designed apart, on purpose, by
      people who said so at the time, and every time the web blurred them, the web walked it
      back. The history below is the evidence. The rest of the site is the practice.
    </p>
    <section className="record" aria-label="the history">
      <h2 className="record-title">How the web got its languages</h2>
      <ol className="timeline" aria-label="the timeline">
        {beats.map(({year, title, tells, rest}) =>
          <li className="moment" key={title}>
            <span className="year caption">{year}</span>
            <div className="beat">
              <h3 className="beat-title">{title}</h3>
              <p className="beat-tells paragraph">{tells}</p>
              <details className="fuller-story">
                <summary className="prompt">the fuller story</summary>
                {rest}
              </details>
            </div>
          </li>)}
      </ol>
    </section>
    <section className="door" aria-label="structure">
      <h2 className="door-title">Structure</h2>
      <blockquote className="feedback">
        <p className="quote">
          It is not a programming language, but rather a language that identifies the meaning,
          purpose, and structure of text within a document.
        </p>
        <footer className="attribution"><a {...source('https://html.com/html5/')}>html.com, on HTML</a></footer>
      </blockquote>
      <p className="paragraph">
        What things are: content, meaning, and the order a reader and a screen reader both
        walk. The element chooses itself, and everything else layers on. Watch{' '}
        <Link className="signpost" to={`${Paths.demos}?tab=tables#station-4`}>structure carry the still table</Link>.
      </p>
    </section>
    <section className="door" aria-label="presentation">
      <h2 className="door-title">Presentation</h2>
      <blockquote className="feedback">
        <p className="quote">
          The separation of HTML from CSS makes it easier to maintain sites, share style
          sheets across pages, and tailor pages to different environments.
        </p>
        <footer className="attribution"><a {...source('https://www.w3.org/standards/webdesign/htmlcss.html')}>the W3C, on HTML and CSS</a></footer>
      </blockquote>
      <p className="paragraph">
        How things show: shared words for shared needs, structure beside the component that
        wears it, and nothing owned that the content already says. Watch{' '}
        <Link className="signpost" to={`${Paths.demos}?tab=tables#station-6`}>presentation play the theater</Link>.
      </p>
    </section>
    <section className="door" aria-label="dynamic interaction">
      <h2 className="door-title">Dynamic Interaction</h2>
      <blockquote className="feedback">
        <p className="quote">
          With a scripting language like JS that could touch elements of the page, change
          their properties, and respond to events, we envisioned a much livelier Web
          consisting of pages that acted more like applications.
        </p>
        <footer className="attribution"><a {...source('https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html')}>Brendan
        Eich, in Computerworld’s A-Z of Programming Languages</a></footer>
      </blockquote>
      <p className="paragraph">
        How things respond: state decides, the languages split the work, and the same
        listeners answer in any world. Watch{' '}
        <Link className="signpost" to={`${Paths.demos}?tab=dragAndDrop`}>behavior carry the drag</Link>.
      </p>
    </section>
    <p className="tee-up paragraph">
      Someone needs something; the element chooses itself; a design takes shape; the stories
      slice thin; the feature layers on. That is how every page here is built.{' '}
      <Link className="signpost" to={`${Paths.demos}?tab=tables`}>Start with the tables</Link>.
    </p>
  </article>;
