import {FC, useState} from 'react';
import {Choice, PillGlider} from '@components/PillGlider';
import {classNames} from '@components';
import {carve, Line, lines, Snippet} from '../Recipe';
import sheet from './WhereSecondGoes.css?sample';
import {Position, whereSecondGoes} from './where-second-goes';
import './WhereSecondGoes.css';

type Parent = 'positioned' | 'not-positioned';

const positionChoices: Choice<Position>[] = whereSecondGoes.positions.map(value => ({words: value, value}));
const parentChoices: Choice<Parent>[] = [
  {words: 'position: relative', value: 'positioned'},
  {words: 'not positioned', value: 'not-positioned'}
];

const Fillers: FC<{words: string; count: number}> = ({words, count}) => <>{Array.from({length: count}, (_, at) =>
  <p className="little-box muted-dashed-outline rounded-corners caption" key={at}>{words}</p>)}</>;

const pageMarkup = (position: Position, parentPositioned: boolean): string[] => [
  '<p>the top of the page</p>',
  parentPositioned ? '<section class="parent positioned">' : '<section class="parent">',
  '  <p>First</p>',
  `  <p class="second ${position}">Second</p>`,
  '  <p>Third</p>',
  '  <p>more inside the parent</p>',
  '</section>'
];

const insideTheTransformedView = (markup: string[]): string[] =>
  ['<section class="little-view transformed">', ...markup.map(line => `  ${line}`), '</section>'];

const markupShown = (position: Position, parentPositioned: boolean): Line[] => {
  const markup = pageMarkup(position, parentPositioned);
  return (position === 'fixed' ? insideTheTransformedView(markup) : markup).map(lines.plain);
};

const rulesShown = (position: Position, parentPositioned: boolean): Line[] => lines.fromTheExhibit([
  ...carve.unit(sheet, `.second.${position} {`),
  ...position === 'absolute' && parentPositioned ? [lines.blank, ...carve.unit(sheet, '.parent.positioned {')] : [],
  ...position === 'fixed' ? [lines.blank, ...carve.unit(sheet, '.little-view.transformed {')] : []
]);

const MeasuredFrom: FC = () => <span className="measured-from alarm-dot" aria-hidden="true"/>;

export const WhereSecondGoes: FC = () => {
  const [position, choosePosition] = useState<Position>('static');
  const [parent, chooseParent] = useState<Parent>('positioned');
  const absolute = position === 'absolute';
  const parentPositioned = absolute && parent === 'positioned';
  const told = whereSecondGoes.told(position, parent === 'positioned');

  return <figure className="where-second-goes">
    <p className="caption uppercase" aria-hidden="true">Second’s position is</p>
    <PillGlider label="Second’s position is" name="second-position" choices={positionChoices} chosen={position}
      onChosen={choosePosition}/>
    {absolute && <>
      <p className="caption uppercase" aria-hidden="true">And its parent is</p>
      <PillGlider label="And its parent is" name="parent-position" choices={parentChoices} chosen={parent}
        onChosen={chooseParent}/>
    </>}
    <p className="paragraph">{told.story}</p>
    <dl className="where-we-meet-it">
      <dt className="caption uppercase">Where we meet it</dt>
      <dd className="paragraph">{told.where}</dd>
    </dl>
    <section className="position-stage">
      <Snippet label="HTML" lines={markupShown(position, parentPositioned)}/>
      <Snippet label="CSS" lines={rulesShown(position, parentPositioned)}/>
      <section className="little-window card hairline-outline rounded-corners">
        <p className="little-bar caption uppercase trim">The window</p>
        <section className="little-view transformed">
          {position === 'fixed' && <MeasuredFrom/>}
          {position === 'sticky' && <span className="sticking-edge alarm-backed" aria-hidden="true"/>}
          <section className={classNames('little-page', absolute && !parentPositioned && 'alarm-ringed')}
            aria-label="The little page" tabIndex={0}>
            {absolute && !parentPositioned && <MeasuredFrom/>}
            <p className="page-top little-box muted-dashed-outline rounded-corners caption">the top of the page</p>
            <section className={classNames('parent little-parent plan-sand muted-dashed-outline rounded-corners',
              parentPositioned && 'positioned alarm-ringed')}>
              {parentPositioned && <MeasuredFrom/>}
              <p className="little-box plan-blue hairline-outline rounded-corners">First</p>
              <p className={classNames('second little-box plan-mint hairline-outline rounded-corners', position)}>
                Second
                {position === 'relative' &&
                  <span className="old-place alarm-dashed-outline rounded-corners" aria-hidden="true"/>}
              </p>
              <p className="little-box plan-blue hairline-outline rounded-corners">Third</p>
              <Fillers words="more inside the parent" count={6}/>
            </section>
            <Fillers words="more of the page" count={4}/>
          </section>
        </section>
      </section>
    </section>
    <output aria-label="where Second went" className="paragraph">{told.verdict}</output>
    <output aria-label="what Second is measured from" className="paragraph">
      {`Measured from: ${told.measuredFrom}`}</output>
    <p className="paragraph">{told.context} Scroll the little page to see fixed and sticky at work.</p>
    <figcaption className="caption"><strong className="bold">Where Second goes.</strong> Give Second each position in
      turn and see where it goes, and what First and Third do.</figcaption>
  </figure>;
};
