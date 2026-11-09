import {TabLink} from '@pages/Demos/TabLink';
import {FC, useId} from 'react';
import {DemoTopics} from '../demo-topics';
import {Codes, Says, Snippet, Step, Steps, Stories, Story, Tell, Words, lines, carve} from '../Recipe';
import {AThirdFromThePointer} from './Diagrams';
import workspaceSource from './Workspace.tsx?sample';
import travelSource from './useChartTravel.ts?sample';
import chartTravelSource from './chart-travel.ts?sample';
import deskSource from './desk.ts?sample';
import kindsSource from './chart-kinds.ts?sample';
import crossingSource from '../DragAndDrop/crossing.ts?sample';
import workspaceCss from './Workspace.css?sample';
import '../Recipe/Recipe.css';

const blankLine = lines.plain(' ');

const WorkspaceStory: FC = () =>
  <Story param="graph" id="workspace"
    can="The trader can lay out the workspace"
    soThat="the charts they watch sit where they put them">
    <Tell>The page writes every change to the layout into its address: adding a chart, sorting, removing one, and
      choosing a period. A reload or a shared link needs nothing else to bring the layout back.</Tell>
    <Tell>Sorting uses the browser’s own drag and drop, which HTML turns on with the draggable attribute, a setting
      written on the element. A chart is draggable only while its grip is pressed, and the grip shows when the pointer
      is over the chart. While a chart is held it fades almost to nothing where it sits, and the browser draws a copy of
      it under the pointer. It swaps with its neighbor once the pointer has moved a third of the chart’s height from
      where it took hold, up or down, and the neighbor slides into the place it left.</Tell>
    <Tell>The keyboard does not need the grip. With a chart in focus, meaning it is the one the keyboard is on, the up
      and down arrows move it one place and focus stays on it. Delete or Backspace removes it. When one chart is left it
      has no grip and no remove button, and the key does nothing, so the workspace always has a chart.</Tell>
    <Steps>
      <Step title="Read the charts from the address">
        <Words want="The layout is the trader’s, so it has to come back after a reload and travel in a link.">
          <Says>The address’s query string, the part after the question mark, carries a value named charts: a list
            of chart names with commas between them. A name the page doesn’t know is skipped, a name given twice
            counts once, and with no list the page shows one price chart. A new chart goes to the front of the list,
            so it appears at the top, next to the + that added it. The + opens a menu of the charts not yet on the
            page.</Says>
          <Says>A name may carry its period after a colon, candles:day; the hour is the default and is left off.</Says>
          <Says>That menu is built from Menu, Entry and Item. Each is a component, a function that writes a piece of the
            page, as the <TabLink to={DemoTopics.zIndex}>z-index tab</TabLink> says.</Says>
          <Says>A class, as the <TabLink to={DemoTopics.accordions}>accordions tab</TabLink> says, is a name a style
            sheet’s rules pick out. Item gives its button the shared classes that set its look, and the page passes Menu
            the menu’s own, as the sample shows.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(kindsSource, 'const is ='), blankLine,
            ...carve.unit(deskSource, 'const dealt ='), blankLine,
            ...carve.unit(deskSource, 'const added =')
          ]}/>
          <Snippet label="HTML" lines={[
            ...carve.span(workspaceSource, '<Menu id="add-chart"', '</Menu>')
          ]}/>
        </Codes>
      </Step>
      <Step title="A chart swaps once the pointer has moved a third of its height">
        <Words want="A chart is large and the drag starts at its grip. So the swap is measured from the pointer, not from the chart’s far edge.">
          <Says>On dragstart, the <TabLink to={DemoTopics.zIndex}>event</TabLink> the browser sends when a drag begins,
            the code marks where the pointer is on the page and keeps it
            in <code className="monospaced">pointerYAtLastSeat</code>. On every dragover, the event it sends as the
            pointer moves over a chart, the code compares the pointer with that mark. A third of the held chart’s
            height below the mark, the chart swaps with the one under it; a third above, with the one over it. Then the
            mark is set again to where the pointer is.</Says>
          <Says>That matters when the charts differ in height. A short chart that passes a tall one drops by the tall
            one’s height. A mark left on the chart would now be far from the pointer, and the two would swap straight
            back.</Says>
          <Says><code className="monospaced">travel</code> is the code that runs on each dragover. It takes the held chart’s height
            from <code className="monospaced">boundsOf</code>, which measures the chart’s place while that place is on the page and gives nothing when
            it isn’t. <code className="monospaced">boundsOf</code> answers with a Maybe, a value that may be missing, and <code className="monospaced">map</code> uses the value only when
            there is one. With nothing, <code className="monospaced">travel</code> neither compares the pointer with the mark
            nor swaps.</Says>
          <Says><code className="monospaced">swap</code> <TabLink to={DemoTopics.zIndex}>dispatches</TabLink>{' '}
            <code className="monospaced">swapped</code>. To dispatch is to send
            a <TabLink to={DemoTopics.zIndex}>reducer</TabLink> an action, an object that names what happened, and a
            reducer is a function that takes the state and an action and returns the next state. The chart’s reducer,
            in <code className="monospaced">chart-travel.ts</code>, answers <code className="monospaced">swapped</code> by
            setting the mark again to where the pointer is, noting which way the neighbor slides, and holding the chart
            at its new place.</Says>
          <Says>Before any of this, <code className="monospaced">travel</code> calls <code
            className="monospaced">event.preventDefault()</code>, which tells the browser that a drop is allowed here. An
            element that accepts a drop has to make that call on every dragover event that reaches it.{' '}
          <code className="monospaced">travel</code> also sets <code className="monospaced">dropEffect</code>{' '}
            to <code className="monospaced">'move'</code>, which only picks the cursor.</Says>
          <Says>The neighbor’s slide is the{' '}
            <TabLink to={DemoTopics.dragAndDrop}>drag sort tab</TabLink>’s keyframe animation
            turned vertical. It starts its own height away and runs to its new place in 150 milliseconds. A chart cannot
            be swapped with one that is still sliding.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(crossingSource, 'const strayedTo'), blankLine,
            ...carve.unit(travelSource, 'const travel = (event'), blankLine,
            ...carve.unit(travelSource, 'const swap = (held'), blankLine,
            ...carve.span(chartTravelSource, "case 'swapped'", '};')
          ]}/>
          <AThirdFromThePointer/>
          <Snippet label="CSS" lines={[
            ...carve.unit(workspaceCss, '@keyframes chart-pushed')
          ]}/>
        </Codes>
      </Step>
      <Step title="The arrow keys move a chart, and Delete or Backspace removes it">
        <Words want="The grip and the remove button show only under a pointer. A keyboard works on the chart itself.">
          <Says>Each chart is a link, so Tab reaches it. With a chart in focus, the up and down arrows move it one
            place, stopping at the ends, and focus stays on it, so holding an arrow keeps moving the same chart.
            Delete or Backspace removes it, unless it is the last chart. Focus then moves to the next chart’s link, or
            to the one before when the removed chart was last, so the reader keeps their place.</Says>
          <Says><code className="monospaced">onRemoved</code> is the function the workspace gives <code className="monospaced">useChartTravel</code> to call when the
            reader asks to remove a chart. The workspace passes its own function, <code className="monospaced">removed</code>. <code className="monospaced">keys</code> calls it with the chart’s position and the link
            the key was pressed on. Before the chart goes, <code className="monospaced">removed</code> asks <code className="monospaced">atAfterRemoval</code> which position
            takes the focus, the one after or else the one before. <code className="monospaced">doorwayAt</code> walks from the pressed link up to its list
            item, across to the item at that position, and down to that item’s link. <code className="monospaced">removed</code> focuses that
            link, then removes the chart.</Says>
          <Says>Each step of that walk may find nothing. <code className="monospaced">maybe</code> turns a value that may be missing into a Maybe,
            and <code className="monospaced">mBind</code> runs the next step only when the last one found something, so the walk stops at the first
            missing piece and nothing is focused. The chart’s link carries a <code className="monospaced">data-doorway</code> attribute for the
            walk to find, and its class only dresses it.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(travelSource, 'const keys'), blankLine,
            ...carve.unit(deskSource, 'const atAfterRemoval ='), blankLine,
            ...carve.unit(workspaceSource, 'const doorwayAt'), blankLine,
            ...carve.unit(workspaceSource, '  const removed')
          ]}/>
        </Codes>
      </Step>
      <Step title="The last chart can’t be removed">
        <Words want="An empty workspace shows nothing and teaches nothing, so one chart always stays.">
          <Says>The grip and the remove button are drawn only while there is more than one chart. With one chart left
            there is no grip and no remove button, and Delete or Backspace does nothing. The + is still there.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(workspaceSource, 'const plural'), blankLine,
            ...carve.unit(workspaceSource, 'const actions')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;

export const ChartsTutorial: FC = () => {
  const titled = `tutorials${useId()}`;
  return <section aria-labelledby={titled} className="tutorials">
    <h2 id={titled} className="title">let’s build this feature</h2>
    <p className="overview paragraph">
      We are going to build this site’s live charts, feature by feature. Here is how to use this page: the card below is
      the workspace, told as a <a className="signpost"
        href="https://initialcapacity.io/insights/user-story"
        target="_blank"
        rel="noreferrer">user story</a>. Each chart above opens its own story: click it, or press Enter on it. Open one
      and you get the plan for that feature and the steps that build it, with the real code from this site, so what
      you read is what runs. The links go to MDN, Mozilla’s
      web reference, if you want more.
    </p>
    <figure className="feedback">
      <blockquote className="quote paragraph italic trim-bar-beside">
        Numbers tell me where the price is; I need to see where it has been to feel where it
        is going. One glance, the shape of the session. And I arrange my own desk: the charts
        I watch, in the order I watch them.
      </blockquote>
      <figcaption className="attribution caption muted-ink">a trader</figcaption>
    </figure>
    <p className="overview paragraph">
      If you want the exercise, stop here and build the story yourself first. The charts are
      my interpretation of that; the stories break the interpretation into features. Open one to see how I built
      it, or to compare it with yours.
    </p>
    <section aria-label="build the charts yourself" className="build-steps">
      <Stories><WorkspaceStory/></Stories>
    </section>
  </section>;
};
