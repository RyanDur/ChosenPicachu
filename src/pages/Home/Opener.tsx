import {FC} from 'react';

export const Opener: FC = () =>
  <header className="opening">
    <p className="thesis paragraph">
      A webpage is three languages working in concert. HTML says what things are, CSS says how
      they show, and JavaScript says how they respond. They were designed apart, on purpose, and
      when one could not yet do a job another covered for it until the standard caught up, as
      HTML’s own principles ask:{' '}
      <a className="signpost" href="https://www.w3.org/TR/html-design-principles/">“consider adopting
        it rather than forbidding it or inventing something new”</a>.
    </p>
    <p className="thesis paragraph">
      That argument is this whole site: a door per language, the record of how the web got them,
      and the demos where I work the practice.
    </p>
  </header>;
