import {FC, useId} from 'react';
import {Clues, Design, Slices} from '../Recipe/Arc';
import {Exercise, Mdn, Stories, Story, Tell, stationId, useArrival} from '../Recipe';
import '../Tutorials.css';
import '../Recipe/Recipe.css';

const clues: [string, string][] = [
  ['more than I want to see at once', 'The content is there from the start. Nothing loads on open; a fold only hides and shows.'],
  ['open the part I came for', 'One heading per part, and the reader chooses. A heading that acts when pressed is a control.'],
  ['close it when I am done', 'Closing is the reader’s act too. A fold that only opens is not enough.'],
  ['keep the rest out of my way', 'Sometimes one open at a time. That is a different promise, and some builds keep it and some do not.']
];

const sketch = <>
  {['first', 'second', 'third', 'fourth', 'fifth'].map(bar =>
    <div className="design-item" key={bar}>
      <span className="design-line"/>
    </div>)}
</>;

const unanswered = [
  'Whether opening one part closes the others.',
  'Whether a part slides open or appears.',
  'What a screen reader hears on each bar: a button, a checkbox, or a disclosure.'
];

export const AccordionTutorial: FC = () => {
  useArrival();
  const titled = `tutorials${useId()}`;
  return <section aria-labelledby={titled} className="tutorials">
    <h2 id={titled} className="tutorials-title">let’s build this feature</h2>
    <ol className="spine" aria-label="the stations">
      <li className="station" id={stationId(1)}>
        <Clues quote="There is more here than I want to see at once. Let me open the part I came for, close it when I am done, and keep the rest out of my way."
          by="a reader"
          clues={clues}
          verdict="A heading that shows or hides the part beneath it is a disclosure. Each element was built for one thing: a checkbox holds a yes, a radio holds one of several, and details holds a disclosure. The tricks on this tab borrow the first two to do the third’s job, because details came browser by browser, after the tricks were written. Each story below is one limit answered, in the order the web learned them."/>
      </li>
      <li className="station" id={stationId(2)}>
        <Design sketch={sketch}
          answers="The design answers shape: a bar per part, the text under its bar, one bar open."
          unanswered={unanswered}/>
      </li>
      <li className="station" id={stationId(3)}>
        <Slices who="reader"
          can="The reader can open only the part they came for"
          soThat="so that the rest stays out of the way"
          slices="It slices by limit. Each build answers one thing the build before it could not do, so the stories read in the order the web learned them, and the last is the one to reach for today."
          sliced={[
            ['The reader can open and close any part without script', 4],
            ['The reader can keep one part open at a time', 4],
            ['The reader can open one part at a time on the platform’s own disclosure', 4],
            ['The reader can watch a part slide open to its own height', 4],
            ['The reader’s browser slides the part open where it can, and opens it at once where it cannot', 4]
          ]}/>
        <Exercise/>
      </li>
      <li className="station" id={stationId(4)}>
        <h3 className="phase-title">The builds, in the order the web learned them</h3>
        <section aria-label="build the accordions yourself" className="build-steps">
          <Stories>
            <Story param="fold" id="checkbox"
              can="The reader can open and close any part without script"
              soThat="the page works before any script arrives">
              <Tell>The first thing you reach for is a click handler, and the page does
                nothing until the script loads. A <Mdn path="Web/HTML/Element/input/checkbox">checkbox</Mdn> already
                holds open and closed, and a label already presses it. Hide the box, style the
                label as the bar, and let :checked show the text beneath it. What it cannot do:
                close the others. Every box is its own.</Tell>
            </Story>
            <Story param="fold" id="radio"
              can="The reader can keep one part open at a time"
              soThat="the page never grows a stack of open parts">
              <Tell>Radio buttons in one group already promise one choice. Give every part
                the same name and opening one closes the last. What it cannot do: close the
                open part. A chosen radio stays chosen, so this build adds a “Close” radio just
                to give the reader a way out. And each bar is announced as what the markup says
                it is, a radio, one of six, not a disclosure.</Tell>
            </Story>
            <Story param="fold" id="details"
              can="The reader can open one part at a time on the platform’s own disclosure"
              soThat="a screen reader hears what the reader sees">
              <Tell>The platform’s disclosure is <Mdn path="Web/HTML/Element/details">details</Mdn> and
                summary: a heading that opens and closes, announced as a disclosure, working
                from the keyboard with nothing added. What it lacked was the radio’s promise.
                Now it has it: give each details the same name and the browser keeps one open.
                What it cannot do, until the last story: slide. A details element snaps between
                closed and open.</Tell>
            </Story>
            <Story param="fold" id="rows"
              can="The reader can watch a part slide open to its own height"
              soThat="the eye follows what opened">
              <Tell>You could not transition height to auto, so the first thing you reach for
                is to measure the text in script and animate to a number, and the number is
                wrong the moment the text wraps differently. A grid row can do what height could
                not: animate from 0fr to 1fr, and the row’s content decides how tall 1fr is. The
                two React builds use it. What it costs: the fold is a React component, not the
                platform’s disclosure, and closing needs state the platform would have given
                for free.</Tell>
            </Story>
            <Story param="fold" id="caught-up"
              can="The reader’s browser slides the part open where it can, and opens it at once where it cannot"
              soThat="no browser gets a broken fold">
              <Tell>The platform caught up. A details element’s content now has its own part to
                style, <Mdn path="Web/CSS/::details-content">::details-content</Mdn>, and a page
                can opt into animating to auto
                with <Mdn path="Web/CSS/interpolate-size">interpolate-size</Mdn>. Put the two
                together and the platform’s disclosure slides like the React builds, with no
                script and no measured height. A browser that cannot animate it opens the fold at
                once, which is the build from story 3, still whole. This is the one to reach for
                today.</Tell>
            </Story>
          </Stories>
        </section>
      </li>
    </ol>
  </section>;
};
