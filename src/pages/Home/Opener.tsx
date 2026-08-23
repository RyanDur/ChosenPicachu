import {FC} from 'react';

export const Opener: FC = () =>
  <header className="opening">
    <p className="thesis paragraph">
      A webpage is three languages working in concert. HTML says what things are. CSS says how
      they show. JavaScript says how they respond. They were designed apart, on purpose, by
      people who said so at the time. The boundaries were not handed down; they were iterated.
      When a language wasn’t capable yet, or its responsibility wasn’t clear yet, another one
      covered for it, and through need, feedback, and user ingenuity, what communities built
      became parts of the standard; HTML’s own design principles say to{' '}
      <a className="signpost" href="https://www.w3.org/TR/html-design-principles/">“consider adopting
      it rather than forbidding it or inventing something new”</a>.
    </p>
    <p className="thesis paragraph">
      Even the standards changed how they arrive: the CSS working group chose independent
      modules over{' '}
      <a className="signpost" href="https://www.w3.org/TR/css-2023/">“a single monolithic
      specification”</a>, and TC39 ratifies a new ECMAScript{' '}
      <a className="signpost" href="https://tc39.es/process-document/">“in July of each year”</a>.
      The history below is the iteration. The rest of the site is my practice of it.
    </p>
  </header>;
