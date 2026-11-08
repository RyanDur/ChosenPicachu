import {FC, ReactNode} from 'react';
import {Entrance, Stack} from '@frame/notices/Banners';
import {Codes, Says, Snippet, Step, Steps, Story, Words, Tell, lines, carve} from '../../Recipe';
import {EntranceDial, StackDial, useControls} from '../../Controls';
import bannersSource from '@frame/notices/Banners/Banners.tsx?sample';
import changeSource from '@frame/notices/Banners/bannerChange.ts?sample';
import newsSource from '@frame/notices/Banners/bannerNews.ts?sample';
import bannersCss from '@frame/notices/Banners/Banners.css?sample';
import timingCss from '../../../../styles/timing.css?sample';
import '../../Recipe/Recipe.css';

const gap = lines.plain(' ');

const stackFact: Record<Stack, string> = {
  down: 'the stack grows downward, so the track is a row.',
  up: 'the stack grows upward, so the track is a row.',
  left: 'the stack grows leftward, so the track is a column.',
  right: 'the stack grows rightward, so the track is a column.'
};

type Axis = 'vertical' | 'sideways';

const axisFact: Record<Axis, ReactNode> = {
  vertical: <><code className="monospaced">:where(.stack-down, .stack-up)</code> is the part of the rule’s selector that
    matches the panel with either class, and the rule applies to each banner in it. So I write
    the <code className="monospaced">grid-template-rows</code> rule
    once for the downward and upward stacks, and the <code className="monospaced">grid-template-columns</code> rule once
    for the two sideways stacks.</>,
  sideways: <><code className="monospaced">:where(.stack-left, .stack-right)</code> is the part of the rule’s selector
    that matches the panel with either class, and the rule applies to each banner in it. So I write
    the <code className="monospaced">grid-template-columns</code> rule once for the leftward and rightward stacks, and
    the <code className="monospaced">grid-template-rows</code> rule once for the two vertical stacks.</>
};

const gapFact: Record<Stack, string> = {
  down: 'The gap is a margin below every banner but the bottom one, the last child when the stack grows downward. The margin is on the message, inside the track, so it opens as the track opens. The same rule carries the upward stack’s selector, where the bottom banner is the first child.',
  up: 'The gap is a margin below every banner but the bottom one, the first child when the stack grows upward. The margin is on the message, inside the track, so it opens as the track opens. The same rule carries the downward stack’s selector, where the bottom banner is the last child.',
  right: 'The gap is a margin to the right of every banner but the one at the right, the last child when the stack grows rightward. The margin is on the message, inside the track, so it opens as the track opens. The same rule carries the leftward stack’s selector, where the banner at the right is the first child.',
  left: 'The gap is a margin to the right of every banner but the one at the right, the first child when the stack grows leftward. The margin is on the message, inside the track, so it opens as the track opens. The same rule carries the rightward stack’s selector, where the banner at the right is the last child.'
};

const enterFact: Record<Entrance, string> = {
  above: 'Here the banner starts a full window’s height above its place.',
  below: 'Here the banner starts a full window’s height below its place.',
  left: 'Here the banner starts a full window’s width to the left of its place.',
  right: 'Here the banner starts a full window’s width to the right of its place.'
};

const sideways = (stack: Stack): boolean => stack === 'left' || stack === 'right';

const axisOf = (stack: Stack): Axis => sideways(stack) ? 'sideways' : 'vertical';

const axisSelector: Record<Axis, string> = {
  vertical: '&:where(.stack-down, .stack-up)',
  sideways: '&:where(.stack-left, .stack-right)'
};

const ownedGap: Record<Axis, string> = {
  vertical: '&:where(.stack-down) .trouble:where(:not(:last-child)) .news,',
  sideways: '&:where(.stack-right) .trouble:where(:not(:last-child)) .news,'
};

const multipleStory = {param: 'news', id: 'many'} as const;
const slideInStep = 'step-slide-in';

export const MultipleRecipe: FC = () => {
  const {enter, stack} = useControls();

  return <Story {...multipleStory}
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
        <Words want="The same message twice tells me nothing new.">
          <Says>A page raises a banner by dispatching <code className="monospaced">bannerChange.raised(message)</code>.{' '}
            <code className="monospaced">bannerChange.raised</code> is an action creator, a function that builds the
            action, and it gives the new banner its id. The site’s news is the banners that are up and where they sit.
            The reducer is the function that takes the news and an action and returns the news that follows. The
            reducer looks for the message among the banners and returns the news unchanged when it finds one. Otherwise
            it adds the new banner. Once a banner has been dismissed and has gone, the same message can be raised
            again.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...carve.unit(changeSource, 'export const bannerChange = {'), gap,
            ...carve.span(newsSource, "case 'raised':", ': {...news, banners: [...news.banners, change.banner]};')
          ]}/>
        </Codes>
      </Step>
      <Step title="Open a gap in the stack first" dial={<StackDial name="journey-stack"/>}>
        <Words want="The banners already up should move apart before the new one is seen. It is still a full screen away.">
          <Says>A banner is the list item with the class trouble. Each banner is a grid, a layout of rows and
            columns, with a single row or column, called a track. Here {stackFact[stack]} A track’s size can be given in
            fr, its share of the grid’s room: at 1fr this one track takes all of it, and at 0fr it takes none. The
            starting style sets the track to 0fr and the banner’s own rule sets it to 1fr, so the transition opens the
            gap over 0.3 seconds.</Says>
          <Says>{axisFact[axisOf(stack)]}</Says>
          <Says>{gapFact[stack]}</Says>
          <Says>A track closes only as far as what is inside it can shrink. The paragraph that fills the track,{' '}
            <code className="monospaced">news-item</code>, has a minimum size of 0 in both directions. Its display is
            flow-root, which keeps the message’s margin inside it. A margin that passed out of the paragraph would sit
            outside the track and hold the gap open.</Says>
          <Says>The banner has one transition list, written once for all four stacks: both track sizes over 0.3 seconds,
            and the slide over 0.6, starting after the gap’s 0.3. The slide in the next step is in this list too. A
            second transition declaration on the same element replaces the list; it does not add to it. So the arriving
            banner’s transitions are all in this one list, and the leaving rule in step 4 writes a whole list of its
            own.</Says>
          <Says>timing.css names all three: <code className="monospaced">--slide-curve</code>,{' '}
            <code className="monospaced">--slide-duration</code> at 0.6 seconds and{' '}
            <code className="monospaced">--fold-duration</code> at 0.3. The slide follows the curve, a cubic-bezier,
            which sets how a move speeds up and slows down. This one starts slowly and eases into place at the
            end.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" lines={[
            ...carve.span(timingCss, '--slide-curve:', '--fold-duration:'), gap,
            ...carve.unit(bannersCss, '.trouble {'), gap,
            ...carve.unit(bannersCss, `${axisSelector[axisOf(stack)]} .trouble {`), gap,
            ...carve.span(bannersCss, ownedGap[axisOf(stack)], '}'), gap,
            ...carve.unit(bannersCss, '.news-item {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Slide in from off screen" id={slideInStep} dial={<EntranceDial name="journey-entrance"/>}>
        <Words want="A banner that slides in from just beside its place looks like it popped up. The slide has to start off screen.">
          <Says>{enterFact[enter]} The distance is a custom property: a value given a name once, here --arrive, and
            read back with var(). The starting style reads it to place the banner before the slide, and the leaving
            rule reads it again to send the banner back.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" lines={[
            ...carve.unit(bannersCss, `&.from-${enter} {`)
          ]}/>
        </Codes>
      </Step>
      <Step title="Slide out, then close the gap">
        <Words want="A dismissed banner should slide out first, and only then should the others close the gap.">
          <Says>Dismissing a banner gives it the class leaving. That rule sends the banner back the way it came at
            once, and holds the track for 0.6 seconds, the time the slide takes, before closing it over 0.3. The code
            takes the banner out of the list only when the track’s transition has ended. Taken out any sooner, it
            would leave the others to jump into its place.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" lines={[
            ...carve.unit(bannersCss, '.trouble.leaving {'), gap,
            ...carve.unit(bannersCss, `${axisSelector[axisOf(stack)]} .trouble.leaving {`)
          ]}/>
          <Snippet label="TS" lines={[
            ...carve.unit(bannersSource, 'const left = ')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;
};
