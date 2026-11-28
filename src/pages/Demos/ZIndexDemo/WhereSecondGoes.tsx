import {FC, PropsWithChildren, ReactNode} from 'react';
import {Choice, PillGlider} from '@components/PillGlider';
import {classNames} from '@components';
import {DemoTopics} from '@pages/Demos';
import {TabLink} from '@pages/Demos/TabLink';
import {carve, Line, lines, Snippet} from '../Recipe';
import {useControls} from '../Controls';
import whereSecondGoesCss from './WhereSecondGoes.css?sample';
import {PartTermLink} from './PartTermLink';
import {ClearfixTray} from './ClearfixTray';
import {ParentPosition, Position} from '../ReaderSettings';
import {MeasuredFrom, secondPosition} from './second-position';
import {Exhibit, ExhibitFoot, ResultLine, Verdict} from '../Exhibit';
import './LittleWindow.css';
import './WhereSecondGoes.css';

type Words = {
  story: ReactNode;
  whereWeMeetIt: string;
  verdict: string;
  measuredFromWords: string;
  stackingContext: ReactNode;
};

const stackingContextLink = <TabLink to={DemoTopics.zIndex}>stacking context</TabLink>;
const positionedLink = <PartTermLink part="why-third-is-on-top">positioned</PartTermLink>;
const flowLink = <PartTermLink part="why-third-is-on-top">flow</PartTermLink>;
const transformLink =
  <PartTermLink part="what-else-forms-a-stacking-context"><code className="monospaced">transform</code></PartTermLink>;

const formsNone = <>It forms no {stackingContextLink}.</>;
const formsNoneUnlessAZIndex = <>It forms no {stackingContextLink}, unless we also give it
  a <code className="monospaced">z-index</code>.</>;
const formsOneByItself = <>It forms a {stackingContextLink} by itself.</>;

const whereWeMeetAnAbsoluteBox = 'A badge on a corner, a menu under its button, a close button in a dialog’s corner.';

const wordsFor: Record<MeasuredFrom, Words> = {
  nowhere: {
    story: <>Every box starts as <code className="monospaced">position: static</code>. The browser places it in the
      page’s {flowLink}, the run of boxes that make room for each other, and ignores <code
      className="monospaced">top</code> and <code className="monospaced">left</code>.</>,
    whereWeMeetIt: 'Every box, until we say otherwise.',
    verdict: 'Second sits between First and Third. The 16px and 24px do nothing.',
    measuredFromWords: 'nowhere. The browser ignores top and left.',
    stackingContext: formsNone
  },
  'own-place': {
    story: <><code className="monospaced">position: relative</code> moves the box from the place the flow gave it,
      by <code className="monospaced">top</code> and <code className="monospaced">left</code>. The flow keeps that place
      open, so the boxes around it do not move.</>,
    whereWeMeetIt: 'A small nudge, or a parent we want a badge or a menu placed against.',
    verdict: 'Second moves 16px down and 24px right. Its old place stays open, and Third does not move.',
    measuredFromWords: 'the box’s own place in the flow, shown as the dashed red outline.',
    stackingContext: formsNoneUnlessAZIndex
  },
  parent: {
    story: <><code className="monospaced">position: absolute</code> takes the box out of the flow, so the boxes after
      it close the gap. The browser measures <code className="monospaced">top</code> and <code
      className="monospaced">left</code> from the nearest {positionedLink} ancestor, an ancestor being any element
      the box sits inside. Here that is the parent, because we gave it <code className="monospaced">position:
        relative</code>. Out of the flow, it no longer stretches across its parent, so we give it a width.</>,
    whereWeMeetIt: whereWeMeetAnAbsoluteBox,
    verdict: 'Second leaves the flow, and Third moves up into its place. Second sits 16px down and 24px in from the parent’s corner, drawn over First. It scrolls with the page.',
    measuredFromWords: 'the parent’s corner, at the red dot. The parent is outlined in red because it is positioned.',
    stackingContext: formsNoneUnlessAZIndex
  },
  'little-page': {
    story: <>The parent has no position now. Nothing above Second in the HTML shown here is {positionedLink}, so the
      browser measures <code className="monospaced">top</code> and <code className="monospaced">left</code> from the
      corner of the page itself. The little page stands in for it here. Expect this whenever no ancestor of an
      absolute box is positioned and none has a {transformLink}, the property that moves, turns or scales a box, or
      a <code className="monospaced">filter</code>, the property that blurs or tints one.</>,
    whereWeMeetIt: whereWeMeetAnAbsoluteBox,
    verdict: 'Second sits 16px down and 24px in from the page’s corner, over the top of the page and outside its parent. It still scrolls with the page.',
    measuredFromWords: 'the little page’s corner, at the red dot.',
    stackingContext: formsNoneUnlessAZIndex
  },
  view: {
    story: <><code className="monospaced">position: fixed</code> takes the box out of the flow and
      measures <code className="monospaced">top</code> and <code className="monospaced">left</code> from the window,
      not the page. When the page scrolls, the box stays where it is. The little window’s view, the area under its bar,
      has a {transformLink}, the property that moves, turns or scales a box, so fixed is measured from it and not
      from the browser’s window. Out of the flow, it no longer stretches across its parent, so we give it a width.</>,
    whereWeMeetIt: 'A banner, a chat button, a header pinned to the window.',
    verdict: 'Second leaves the flow and stays put in the window while the page scrolls under it.',
    measuredFromWords: 'the corner of the window’s view, under its bar, at the red dot.',
    stackingContext: formsOneByItself
  },
  'scroll-edge': {
    story: <><code className="monospaced">position: sticky</code> leaves the box in the flow until scrolling would
      carry it past the edge we name, here <code className="monospaced">top: 0</code>. Then it stays at that edge.</>,
    whereWeMeetIt: 'A table’s header row, or a heading that stays while its section scrolls.',
    verdict: 'Second scrolls with the page, then stays at the top while the rest of its parent scrolls under it. It leaves when its parent does.',
    measuredFromWords: 'the top edge of the box that scrolls, shown as the red line.',
    stackingContext: formsOneByItself
  }
};

const positionChoices: Choice<Position>[] = secondPosition.all
  .map(position => ({words: position, value: position}));
const parentPositionChoices: Choice<ParentPosition>[] = [
  {words: 'position: relative', value: 'positioned'},
  {words: 'not positioned', value: 'not-positioned'}
];

const FillerBox: FC<PropsWithChildren> = ({children}) =>
  <p className="little-box muted-dashed-outline rounded-corners caption">{children}</p>;

const sixBoxes = Array.from({length: 6}, (_, at) => at);
const fourBoxes = Array.from({length: 4}, (_, at) => at);

const pageMarkup = (position: Position, measuredFrom: MeasuredFrom): string[] => [
  '<p>the top of the page</p>',
  measuredFrom === 'parent' ? '<section class="parent positioned">' : '<section class="parent">',
  '  <p>First</p>',
  `  <p class="second ${position}">Second</p>`,
  '  <p>Third</p>',
  '  <p>more inside the parent</p>',
  '</section>'
];

const insideTheTransformedView = (markup: string[]): string[] =>
  ['<section class="little-view transformed">', ...markup.map(line => `  ${line}`), '</section>'];

const markupShown = (position: Position, measuredFrom: MeasuredFrom): Line[] => {
  const markup = pageMarkup(position, measuredFrom);
  return (measuredFrom === 'view' ? insideTheTransformedView(markup) : markup).map(lines.plain);
};

const rulesShown = (position: Position, measuredFrom: MeasuredFrom): Line[] => lines.fromTheExhibit([
  ...carve.unit(whereSecondGoesCss, `.second.${position} {`),
  ...measuredFrom === 'parent' ? [lines.blank, ...carve.unit(whereSecondGoesCss, '.parent.positioned {')] : [],
  ...measuredFrom === 'view' ? [lines.blank, ...carve.unit(whereSecondGoesCss, '.little-view.transformed {')] : []
]);

const MeasuringDot: FC = () => <span className="measured-from alarm-dot" aria-hidden="true"/>;

export const WhereSecondGoes: FC = () => {
  const {chosenPosition, chosenParentPosition, change} = useControls();
  const measuredFrom = secondPosition.measuredFrom(chosenPosition, chosenParentPosition);
  const words = wordsFor[measuredFrom];

  return <Exhibit name="Where Second goes">
    <figure className="where-second-goes field">
      <p className="caption uppercase" aria-hidden="true">Second’s position is</p>
      <PillGlider label="Second’s position is" name="second-position" choices={positionChoices}
        chosen={chosenPosition} onChosen={next => change({chosenPosition: next})}/>
      {chosenPosition === 'absolute' && <>
        <p className="caption uppercase" aria-hidden="true">And its parent is</p>
        <PillGlider label="And its parent is" name="parent-position" choices={parentPositionChoices}
          chosen={chosenParentPosition} onChosen={next => change({chosenParentPosition: next})}/>
      </>}
      <p className="paragraph">{words.story}</p>
      <dl className="where-we-meet-it">
        <dt className="caption uppercase">Where we meet it</dt>
        <dd className="paragraph">{words.whereWeMeetIt}</dd>
      </dl>
      <Snippet label="HTML" lines={markupShown(chosenPosition, measuredFrom)}/>
      <Snippet label="CSS" lines={rulesShown(chosenPosition, measuredFrom)}/>
      <section className="little-window card hairline-outline rounded-corners">
        <p className="little-bar caption uppercase field hairline-rule-below">The window</p>
        <section className="little-view transformed">
          {measuredFrom === 'view' && <MeasuringDot/>}
          {measuredFrom === 'scroll-edge' && <span className="sticking-edge alarm-backed" aria-hidden="true"/>}
          <section className="little-page focus-ringed" aria-label="The little page" tabIndex={0}>
            {measuredFrom === 'little-page' && <MeasuringDot/>}
            <p className="page-top little-box muted-dashed-outline rounded-corners caption">the top of the page</p>
            <section className={classNames('parent little-parent plan-sand muted-dashed-outline rounded-corners',
              measuredFrom === 'parent' && 'positioned alarm-ringed')}>
              {measuredFrom === 'parent' && <MeasuringDot/>}
              <p className="little-box plan-blue hairline-outline rounded-corners">First</p>
              <p className={classNames('second little-box plan-mint hairline-outline rounded-corners',
                chosenPosition)}>
                Second
                {measuredFrom === 'own-place' &&
                  <span className="old-place alarm-dashed-outline rounded-corners" aria-hidden="true"/>}
              </p>
              <p className="little-box plan-blue hairline-outline rounded-corners">Third</p>
              {sixBoxes.map(box => <FillerBox key={box}>more inside the parent</FillerBox>)}
            </section>
            {fourBoxes.map(box => <FillerBox key={box}>more of the page</FillerBox>)}
          </section>
          {measuredFrom === 'little-page' && <span className="page-ring alarm-ringed" aria-hidden="true"/>}
        </section>
      </section>
      <Verdict aria-label="where Second went">{words.verdict}</Verdict>
      <ResultLine className="keyed-to-the-dot badge-before alarm-badge-before" label="Measured from:">
        {words.measuredFromWords}
      </ResultLine>
      <p className="paragraph">{words.stackingContext} Scroll the little page to see fixed and sticky at work.</p>
      {chosenPosition === 'absolute' && <ClearfixTray/>}
    </figure>
    <ExhibitFoot>
      <strong className="bold">Where Second goes.</strong> Give Second each position in turn and see where it goes, and
      what First and Third do.
    </ExhibitFoot>
  </Exhibit>;
};
