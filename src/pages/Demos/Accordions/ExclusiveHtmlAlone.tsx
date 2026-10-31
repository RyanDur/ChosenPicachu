import {FC} from 'react';

export const ExclusiveHtmlAloneAccordion: FC = () => (
  <ul>
    <li>
      <details name="html-alone">
        <summary>basalt</summary>
        <p>Opens and closes with no CSS and no script.</p>
      </details>
    </li>
    <li>
      <details name="html-alone">
        <summary>cinder</summary>
        <p>The marker beside each name is the browser’s own sign that it opens.</p>
      </details>
    </li>
    <li>
      <details name="html-alone">
        <summary>meadow</summary>
        <p>A keyboard opens it with Enter or Space.</p>
      </details>
    </li>
  </ul>
);
