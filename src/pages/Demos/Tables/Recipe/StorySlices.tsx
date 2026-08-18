import {FC} from 'react';

export const StorySlices: FC = () =>
  <section className="phase white rounded-corners drop-shadow" aria-label="the stories">
    <h3 className="phase-title">Generate the stories from the design</h3>
    <p className="overview paragraph">
      With the need heard and the design answering shape, the work splits into stories: each
      one told as a <a className="signpost"
        href="https://initialcapacity.io/insights/user-story"
        target="_blank"
        rel="noreferrer">user story</a>, a discrete piece of value from the trader’s side of
      the screen, and a promise of a conversation rather than a specification. The whole of it
      reads as one:
    </p>
    <hgroup className="story arriving white rounded-corners drop-shadow">
      <h4 className="can">The trader can watch the live market in windows they arrange</h4>
      <p className="so-that">so that what they compare sits side by side, and what matters most
        sits on top</p>
    </hgroup>
    <p className="overview paragraph">
      Too big to build in one motion, so it slices: the smallest table that honors the shape
      comes first, then the flow of data, then each arrangement the trader asked for. Every
      card below is one of the slices, and each opens into its build.
    </p>
  </section>;
