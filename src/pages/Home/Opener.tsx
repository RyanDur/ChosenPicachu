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
      it rather than forbidding it or inventing something new”</a>. Even the standards
      changed how they arrive: the CSS working group chose independent modules over{' '}
      <a className="signpost" href="https://www.w3.org/TR/css-2023/">“a single monolithic
      specification”</a>, and TC39 ratifies a new ECMAScript{' '}
      <a className="signpost" href="https://tc39.es/process-document/">“in July of each year”</a>.
    </p>
    <p className="thesis paragraph">
      That argument is this whole site. Three doors below, one per language: each defines
      its language and opens onto how I organize it. Under the doors, the record: how the
      web got its languages, told as thirteen needs and what answered them. Past the
      record, the way into the demos, where I work the practice feature by feature; and at
      the end of the page, the research everything above leans on.
    </p>
  </header>;
