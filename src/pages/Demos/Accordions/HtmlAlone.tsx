import {FC} from 'react';

export const HtmlAloneAccordion: FC = () => (
  <ul>
    <li>
      <details>
        <summary>basalt</summary>
        <p>Opens and closes with no CSS and no script.</p>
      </details>
    </li>
    <li>
      <details>
        <summary>cinder</summary>
        <p>The marker beside each name is the browser’s own sign that it opens.</p>
      </details>
    </li>
    <li>
      <details>
        <summary>meadow</summary>
        <p>A keyboard opens it with Enter or Space.</p>
      </details>
    </li>
  </ul>
);
