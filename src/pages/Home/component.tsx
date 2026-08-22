import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import './Home.css';

const beats: {year: string, title: string, tells: string}[] = [
  {
    year: '1989',
    title: 'Someone needed something',
    tells: 'Thousands of researchers at CERN, documents scattered across incompatible machines, and knowledge lost every time a team moved on. Tim Berners-Lee proposed linking documents into a web of nodes, so what was known could be found.'
  },
  {
    year: '1990',
    title: 'Structure arrives',
    tells: 'He wrote HTML on SGML’s shoulders and added one tag of his own: the anchor. With HTTP to fetch documents and a browser-editor to read them, content had structure and a way to travel.'
  },
  {
    year: '1994',
    title: 'Presentation leaves home, on purpose',
    tells: 'Håkon Wium Lie drafted Cascading HTML Style Sheets, encouraged by Dave Raggett, who had realized HTML should never become a page-description language. Presentation was separated from structure by decision, not by accident.'
  },
  {
    year: '1994',
    title: 'The cascade is a settlement',
    tells: 'The proposal balanced two voices: the author, who must be able to decide how a document presents, and the user, whose eyes have to decode it. Some argued style needed a full programming language; CSS chose a simple, declarative format instead.'
  },
  {
    year: '1995',
    title: 'Behavior is born to serve',
    tells: 'Brendan Eich built JavaScript in ten days, as a complementary scripting language: something that could touch the elements of a page, change their properties, and respond to events. Smarts for documents, usable by amateurs, not an application platform.'
  },
  {
    year: '1996',
    title: 'The blur',
    tells: 'The browser wars poured presentation into markup: font, center, tags invented per vendor. Netscape even implemented CSS by translating it into JavaScript; the experiment was never completed and is deprecated. The same page looked broken in the other browser.'
  },
  {
    year: '1998',
    title: 'The correction grinds',
    tells: 'CSS2 arrived, and the Acid Test measured who honored it; in the beginning, most browsers failed. It took until 2000 for a browser to pass 99% of CSS1, and until 2002 for the first full implementation.'
  },
  {
    year: '2003',
    title: 'Zen Garden proves it',
    tells: 'Dave Shea published one HTML document and invited the world to restyle it. Hundreds of designs, not one change to the markup: the same structure, any presentation, separation as art.'
  },
  {
    year: '2014',
    title: 'HTML5 says it out loud',
    tells: 'The specification made the philosophy explicit: semantic markup, accessibility, and, in its own words, reducing the overlap between HTML, CSS, and JavaScript. What began as a design decision became the standard’s language.'
  },
  {
    year: 'Today',
    title: 'This site',
    tells: 'Three languages, three responsibilities, in concert. Every demo here builds a real feature on that architecture, twice: once with the three languages raw, and once with React speaking the same three.'
  }
];

export const HomePage: FC = () =>
  <article className="home">
    <blockquote className="feedback">
      <p className="quote">
        HyperText is a way to link and access information of various kinds as a web of nodes
        in which the user can browse at will.
      </p>
      <footer className="attribution caption">Tim Berners-Lee and Robert Cailliau, proposing the WorldWideWeb, 1990</footer>
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
        {beats.map(({year, title, tells}) =>
          <li className="moment" key={title}>
            <span className="year caption">{year}</span>
            <div className="beat">
              <h3 className="beat-title">{title}</h3>
              <p className="beat-tells paragraph">{tells}</p>
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
        <footer className="attribution caption">html.com, on HTML</footer>
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
        <footer className="attribution caption">the W3C, on HTML and CSS</footer>
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
        <footer className="attribution caption">Brendan Eich, in Computerworld’s A-Z of Programming Languages</footer>
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
