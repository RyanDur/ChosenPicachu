import {FC} from 'react';
import {Link} from 'react-router';
import {storyAddress} from '@pages/Record/storyAddress';

export const WhereThePageIsMade: FC = () =>
  <section className="closing trim-rule-above" aria-labelledby="where-the-page-is-made">
    <h2 className="closing-title title" id="where-the-page-is-made">Where the page is made</h2>
    <p className="paragraph">What changes between sites is where the HTML is made, and that is a trade. A server can send each page as
      a document, so it can be read before any script runs, and the browser handles moving between pages:
      scrolling, focus, the back button. That needs a server, or a build step that renders each page ahead of
      time. Or a script can make the page in the browser, as a single-page application does. That can be served
      as plain files and keeps its state as the reader moves around, and the browser’s jobs between pages become
      the app’s, done by hand or designed around. This site is one, and it also renders each page ahead of time
      when it is built: GitHub Pages serves it as plain files, and it talks to GitHub’s APIs and the browser
      directly. How the web moved between the two, and back, is <Link className="signpost" to={storyAddress('Behavior')}>the Behavior
        story</Link> on the Record. Knowing what HTML, CSS and the
      browser already do is what makes the trade visible: which jobs come free, which take work, and which are
      worth leaning into.</p>
  </section>;
