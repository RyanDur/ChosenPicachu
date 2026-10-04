import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {Entrance, Stack, enterParam, stackParam} from '@components/Banners/params';
import {Codes, Says, Snippet, Step, Steps, Story, Words, Tell, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {EntranceDial, StackDial} from '../../Controls';
import {popoverWinsHeading} from '../part-headings';
import {arrivalLines, leavingLines, slotLines} from './decided';
import bannersSource from '@components/Banners/Banners.tsx?raw';
import providerSource from '@components/Banners/BannerProvider.tsx?raw';
import bannersCss from '@components/Banners/Banners.css?raw';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

const stackFact: Record<Stack, string> = {
  down: 'the stack grows downward, so the track is a row.',
  up: 'the stack grows upward, so the track is a row.',
  left: 'the stack grows leftward, so the track is a column.',
  right: 'the stack grows rightward, so the track is a column.'
};

const enterFact: Record<Entrance, string> = {
  above: 'Here the banner starts a full window’s height above its place.',
  below: 'Here the banner starts a full window’s height below its place.',
  left: 'Here the banner starts a full window’s width to the left of its place.',
  right: 'Here the banner starts a full window’s width to the right of its place.'
};

const sideways = (stack: Stack): boolean => stack === 'left' || stack === 'right';

const settleStep = (
  <Step title="Change a banner’s height smoothly when its text rewraps">
    <Words want="A sideways stack squeezes its banners, and text that rewraps changes height in one jump.">
      <Says>A ResizeObserver, a browser object that calls back when an element changes size, sets each message’s
        height to a measured number of pixels. A rewrap then changes one number to another, and the transition on
        block-size, the CSS name for height on this page, runs between them. Before it measures, the code removes the
        height it set last time. scrollHeight is never less than the element’s own height, so a message measured with
        the old height still on it could only grow.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...unit(bannersSource, 'const settler = new ResizeObserver(')
      ]}/>
      <Snippet label="CSS" lines={[
        ...span(bannersCss, 'block-size: var(--news-block-size', 'transition: block-size 0.3s, padding 0.3s, border-width 0.3s;')
      ]}/>
    </Codes>
  </Step>
);

export const MultipleRecipe: FC = () => {
  const {enter = 'above', stack = 'down'} = useSearchParamsObject({enter: enterParam, stack: stackParam});

  return <Story param="news" id="many"
    can="The user can have multiple banners"
    soThat="no message waits for another to leave">
    <Tell>More than one message can be up at once, so the banners stack. A banner arrives in two moves: the stack
      opens a gap for it while it is still off screen, and then it slides in. Leaving is the same two moves in the
      other order: the banner slides out, and then the gap closes.</Tell>
    <Tell>Both moves are transitions. A transition changes a CSS value over a set time instead of at once. A banner
      that has just been added has no earlier value to change from, so a starting style, written @starting-style,
      gives it one.</Tell>
    <Steps>
      <Step title="Skip a message that is already up">
        <Words want="Multiple means different. The second copy of the same sentence adds noise, not information.">
          <Says>raise is the function a page calls with a message. It looks for that message among the banners that
            are up and adds a banner only when it finds none. Once a banner has been dismissed and has gone, the same
            message can be raised again.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...unit(providerSource, 'const raise = useCallback(')
          ]}/>
        </Codes>
      </Step>
      <Step title="Open a gap in the stack first" dial={<StackDial name="journey-stack"/>}>
        <Words want="The banners already up should move apart before the new one is seen. It is still a full screen away.">
          <Says>Each banner is a grid, a layout of rows and columns, with a single row or column, called a
            track. Here {stackFact[stack]} A track’s size can be given in fr, its share of the grid’s room: at 1fr this
            one track takes all of it, and at 0fr it takes none. The starting style sets the track to 0fr and the
            banner’s own rule sets it to 1fr, so the transition opens the gap over 0.3 seconds. The margin between
            banners opens over the same time.</Says>
          <Says>A track closes only as far as what is inside it can shrink, so the message has a minimum size of 0,
            and its padding and border start at 0 as well.</Says>
          <Says>The banner has one transition list, and the slide in the next step is in it. A second transition
            declaration on the same element replaces the list; it does not add to it. So the arriving banner’s
            transitions are all in this one list, and the leaving rule in step 4 writes a whole list of its own.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" lines={slotLines(stack)}/>
        </Codes>
      </Step>
      <Step title="Slide in from off screen" dial={<EntranceDial name="journey-entrance"/>}>
        <Words want="A banner that slides in from just beside its place looks like it popped up. The slide has to start off screen.">
          <Says>{enterFact[enter]} The distance is a custom property: a value given a name once, here --arrive, and
            read back with var(). The starting style reads it to place the banner before the slide, and the leaving
            rule reads it again to send the banner back. In the transition list in step 2’s sample, the slide waits
            0.3 seconds, the time the gap takes to open.</Says>
          <Says>The slide can be seen only because the panel sets overflow to visible. The panel is a popover,
            as <a className="signpost" href={`#${popoverWinsHeading}`}><cite>Why the popover wins</cite></a> explains,
            and the browser’s own stylesheet gives a popover overflow: auto. That would clip the slide to the panel’s
            own box.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" lines={[
            ...arrivalLines(enter), gap,
            ...span(bannersCss, "/* the browser's own stylesheet", 'overflow: visible;')
          ]}/>
        </Codes>
      </Step>
      <Step title="Slide out, then close the gap">
        <Words want="A dismissed banner should slide out first, and only then should the others close the gap.">
          <Says>Dismissing a banner gives it the class leaving. That rule sends the banner back the way it came at
            once, and holds the track, the margin and the message’s padding and border for 0.6 seconds, the time the
            slide takes, before closing them. The code takes the banner out of the list only when the track’s
            transition has ended. Taken out any sooner, it would leave the others to jump into its place.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" lines={leavingLines(stack)}/>
          <Snippet label="TS" lines={[
            ...unit(bannersSource, 'const left = ')
          ]}/>
        </Codes>
      </Step>
      {sideways(stack) && settleStep}
    </Steps>
  </Story>;
};
