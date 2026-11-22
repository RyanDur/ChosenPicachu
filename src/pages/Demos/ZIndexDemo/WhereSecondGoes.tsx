import {FC, PropsWithChildren, ReactNode, useState} from 'react';
import {not} from '@ryandur/sand';
import {Choice, PillGlider} from '@components/PillGlider';
import {classNames} from '@components';
import {DemoTopics} from '@pages/Demos';
import {TabLink} from '@pages/Demos/TabLink';
import {carve, Line, lines, Snippet} from '../Recipe';
import sheet from './WhereSecondGoes.css?sample';
import {PartTermLink} from './PartTermLink';
import './WhereSecondGoes.css';

const positions = ['static', 'relative', 'absolute', 'fixed', 'sticky'] as const;

type Position = typeof positions[number];

type Told = {
  story: ReactNode;
  whereWeMeetIt: string;
  verdict: string;
  measuredFrom: string;
  stackingContext: ReactNode;
};

const stackingContextLink = <TabLink to={DemoTopics.zIndex}>stacking context</TabLink>;
const positionedLink = <PartTermLink part="why-third-is-on-top">positioned</PartTermLink>;

const formsNone = <>It forms no {stackingContextLink}.</>;
const formsNoneUnlessAZIndex = <>It forms no {stackingContextLink}, unless we also give it a z-index.</>;
const formsOneByItself = <>It forms a {stackingContextLink} by itself.</>;

const told: Record<Position, Told> = {
  static: {
    story: 'Every box starts as position: static. The browser places it in the flow, as a block or inline, and ignores top and left.',
    whereWeMeetIt: 'Every box, until we say otherwise.',
    verdict: 'Second sits between First and Third. The 16px and 24px do nothing.',
    measuredFrom: 'nowhere. The browser ignores top and left.',
    stackingContext: formsNone
  },
  relative: {
    story: 'position: relative moves the box from the place the flow gave it, by top and left. The flow keeps that place open, so the boxes around it do not move.',
    whereWeMeetIt: 'A small nudge, or a parent we want a badge or a menu placed against.',
    verdict: 'Second moves 16px down and 24px right. Its old place stays open, and Third does not move.',
    measuredFrom: 'the box’s own place in the flow, shown as the dashed red outline.',
    stackingContext: formsNoneUnlessAZIndex
  },
  absolute: {
    story: <>position: absolute takes the box out of the flow, so the boxes after it close the gap. The browser measures
      top and left from the nearest {positionedLink} ancestor. Here that is the parent, because we gave it position:
      relative.</>,
    whereWeMeetIt: 'A badge on a corner, a menu under its button, a close button in a dialog’s corner.',
    verdict: 'Second leaves the flow, and Third moves up into its place. Second sits 16px down and 24px in from the parent’s corner, drawn over First. It scrolls with the page.',
    measuredFrom: 'the parent’s corner, at the red dot. The parent is outlined in red because it is positioned.',
    stackingContext: formsNoneUnlessAZIndex
  },
  fixed: {
    story: 'position: fixed takes the box out of the flow and measures top and left from the window, not the page. When the page scrolls, the box stays where it is. The little window’s view, the area under its bar, has a transform, so fixed is measured from it and not from the browser’s window.',
    whereWeMeetIt: 'A banner, a chat button, a header pinned to the window.',
    verdict: 'Second leaves the flow and stays put in the window while the page scrolls under it.',
    measuredFrom: 'the view’s corner, at the red dot.',
    stackingContext: formsOneByItself
  },
  sticky: {
    story: 'position: sticky leaves the box in the flow until scrolling would carry it past the edge we name, here top: 0. Then it stays at that edge.',
    whereWeMeetIt: 'A table’s header row, or a heading that stays while its section scrolls.',
    verdict: 'Second scrolls with the page, then stays at the top while the rest of its parent scrolls under it. It leaves when its parent does.',
    measuredFrom: 'the top edge of the box that scrolls, shown as the red line.',
    stackingContext: formsOneByItself
  }
};

const withNoPositionedParent: Pick<Told, 'story' | 'verdict' | 'measuredFrom'> = {
  story: <>The parent has no position now. Nothing above Second in the HTML shown here is {positionedLink}, so the
    browser measures top and left from the corner of the page itself. The little page stands in for it here. Expect
    this whenever nothing above an absolute box is positioned.</>,
  verdict: 'Second sits 16px down and 24px in from the page’s corner, over the top of the page and outside its parent. It still scrolls with the page.',
  measuredFrom: 'the little page’s corner, at the red dot. It stands in for the page’s corner: nothing above Second is positioned, so the browser goes past the parent to the page.'
};

type WhatEachPositionTells = {
  inOrder: readonly Position[];
  told: (position: Position, parentPositioned: boolean) => Told;
};

const whatEachPositionTells: WhatEachPositionTells = {
  inOrder: positions,
  told: (position, parentPositioned) =>
    position === 'absolute' && not(parentPositioned) ? {...told[position], ...withNoPositionedParent} : told[position]
};

type ParentPosition = 'positioned' | 'not-positioned';

const positionChoices: Choice<Position>[] = whatEachPositionTells.inOrder
  .map(position => ({words: position, value: position}));
const parentPositionChoices: Choice<ParentPosition>[] = [
  {words: 'position: relative', value: 'positioned'},
  {words: 'not positioned', value: 'not-positioned'}
];

const FilledBox: FC<PropsWithChildren> = ({children}) =>
  <p className="little-box muted-dashed-outline rounded-corners caption">{children}</p>;

const FilledParent: FC<PropsWithChildren> = ({children}) =>
  <>{Array.from({length: 6}, (_, at) => <FilledBox key={at}>{children}</FilledBox>)}</>;

const FilledPage: FC<PropsWithChildren> = ({children}) =>
  <>{Array.from({length: 4}, (_, at) => <FilledBox key={at}>{children}</FilledBox>)}</>;

const pageMarkup = (position: Position, measuredFromTheParent: boolean): string[] => [
  '<p>the top of the page</p>',
  measuredFromTheParent ? '<section class="parent positioned">' : '<section class="parent">',
  '  <p>First</p>',
  `  <p class="second ${position}">Second</p>`,
  '  <p>Third</p>',
  '  <p>more inside the parent</p>',
  '</section>'
];

const insideTheTransformedView = (markup: string[]): string[] =>
  ['<section class="little-view transformed">', ...markup.map(line => `  ${line}`), '</section>'];

const markupShown = (position: Position, measuredFromTheParent: boolean): Line[] => {
  const markup = pageMarkup(position, measuredFromTheParent);
  return (position === 'fixed' ? insideTheTransformedView(markup) : markup).map(lines.plain);
};

const rulesShown = (position: Position, measuredFromTheParent: boolean): Line[] => lines.fromTheExhibit([
  ...carve.unit(sheet, `.second.${position} {`),
  ...measuredFromTheParent ? [lines.blank, ...carve.unit(sheet, '.parent.positioned {')] : [],
  ...position === 'fixed' ? [lines.blank, ...carve.unit(sheet, '.little-view.transformed {')] : []
]);

const MeasuredFrom: FC = () => <span className="measured-from alarm-dot" aria-hidden="true"/>;

export const WhereSecondGoes: FC = () => {
  const [position, choosePosition] = useState<Position>('static');
  const [parentPosition, chooseParentPosition] = useState<ParentPosition>('positioned');
  const absolute = position === 'absolute';
  const measuredFromTheParent = absolute && parentPosition === 'positioned';
  const shown = whatEachPositionTells.told(position, parentPosition === 'positioned');

  return <figure className="where-second-goes">
    <p className="caption uppercase" aria-hidden="true">Second’s position is</p>
    <PillGlider label="Second’s position is" name="second-position" choices={positionChoices} chosen={position}
      onChosen={choosePosition}/>
    {absolute && <>
      <p className="caption uppercase" aria-hidden="true">And its parent is</p>
      <PillGlider label="And its parent is" name="parent-position" choices={parentPositionChoices}
        chosen={parentPosition} onChosen={chooseParentPosition}/>
    </>}
    <p className="paragraph">{shown.story}</p>
    <dl className="where-we-meet-it">
      <dt className="caption uppercase">Where we meet it</dt>
      <dd className="paragraph">{shown.whereWeMeetIt}</dd>
    </dl>
    <Snippet label="HTML" lines={markupShown(position, measuredFromTheParent)}/>
    <Snippet label="CSS" lines={rulesShown(position, measuredFromTheParent)}/>
    <section className="little-window card hairline-outline rounded-corners">
      <p className="little-bar caption uppercase trim">The window</p>
      <section className="little-view transformed">
        {position === 'fixed' && <MeasuredFrom/>}
        {position === 'sticky' && <span className="sticking-edge alarm-backed" aria-hidden="true"/>}
        <section className={classNames('little-page focus-ringed',
          absolute && not(measuredFromTheParent) && 'alarm-ringed')}
        aria-label="The little page" tabIndex={0}>
          {absolute && not(measuredFromTheParent) && <MeasuredFrom/>}
          <p className="page-top little-box muted-dashed-outline rounded-corners caption">the top of the page</p>
          <section className={classNames('parent little-parent plan-sand muted-dashed-outline rounded-corners',
            measuredFromTheParent && 'positioned alarm-ringed')}>
            {measuredFromTheParent && <MeasuredFrom/>}
            <p className="little-box plan-blue hairline-outline rounded-corners">First</p>
            <p className={classNames('second little-box plan-mint hairline-outline rounded-corners', position)}>
              Second
              {position === 'relative' &&
                <span className="old-place alarm-dashed-outline rounded-corners" aria-hidden="true"/>}
            </p>
            <p className="little-box plan-blue hairline-outline rounded-corners">Third</p>
            <FilledParent>more inside the parent</FilledParent>
          </section>
          <FilledPage>more of the page</FilledPage>
        </section>
      </section>
    </section>
    <output aria-label="where Second went" className="paragraph">{shown.verdict}</output>
    <output aria-label="what Second is measured from" className="paragraph">
      {`Measured from: ${shown.measuredFrom}`}</output>
    <p className="paragraph">{shown.stackingContext} Scroll the little page to see fixed and sticky at work.</p>
    <figcaption className="caption"><strong className="bold">Where Second goes.</strong> Give Second each position in
      turn and see where it goes, and what First and Third do.</figcaption>
  </figure>;
};
