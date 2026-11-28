import {FC, Fragment, useId} from 'react';
import {Choice, PillGlider} from '@components/PillGlider';
import {classNames} from '@components';
import * as schema from 'schemawax';
import {useSearchParamsObject} from '@navigation/search-params';
import {carve, exhibitSteps, Line, lines, Snippet} from '../Recipe';
import {inOrder, RaisedCard, readerSettings} from '../ReaderSettings';
import {Exhibit, ExhibitFoot, Verdict} from '../Exhibit';
import sheet from './ThePile.css?sample';
import './ThePile.css';

type Step = 'block' | 'inline' | 'overlap' | 'z-index';
type Flow = Extract<Step, 'block' | 'inline'>;
type Card = Exclude<RaisedCard, 'none'>;

const names: Record<RaisedCard, string> = {none: 'None', first: 'First', second: 'Second', third: 'Third'};
const cards: Card[] = ['first', 'second', 'third'];
const steps: Choice<Step>[] = exhibitSteps.numbered([
  {words: 'Block', value: 'block'}, {words: 'Inline', value: 'inline'},
  {words: 'Overlap', value: 'overlap'}, {words: 'Z-index', value: 'z-index'}
]);
const flows: readonly Step[] = ['block', 'inline'];
const flowing = (step: Step): step is Flow => flows.includes(step);
const cardsToRaise: Choice<RaisedCard>[] = inOrder.raisedCards.map(value => ({words: names[value], value}));

const stories: Record<Step, string> = {
  block: 'Some boxes go down the page. Each one takes the whole width, so the next one starts below it. We call those blocks.',
  inline: 'Other boxes go along a line. Each one takes only the room it needs, so the next one sits beside it. When a line is full, the next box starts a new line. We call those inline.',
  overlap: 'The z is a third direction: out of the page, toward us. It only matters where boxes overlap. There the browser has to draw one box over another, so it keeps them in an order, like a pile. A group of boxes it orders that way is a stacking context. With no z-index, the order inside it is the order in the code.',
  'z-index': 'A z-index is a number that gives a box its place in its stacking context, which is why we call it an index. Give one card a z-index and it moves to the top, wherever the code lists it.'
};

const flowMarkup: Record<Flow, Line[]> = {
  block: cards.map(card => lines.plain(`<p>${names[card]}</p>`)),
  inline: [...cards.map(card => lines.plain(`<span>${names[card]}</span>`)),
    lines.aside('<!-- more of the page -->'), lines.aside('<!-- more of the page -->')]
};

const flowRules: Record<Flow, Line[]> = {
  block: [lines.aside('/* none. A p is a block. */')],
  inline: [lines.aside('/* none. A span is inline. */')]
};

const moreOfThePage = 'more\u00a0of\u00a0the\u00a0page';

const flowVerdicts: Record<Flow, string> = {
  block: 'First is at the top and Third is at the bottom.',
  inline: 'First is first on the line and Third is last.'
};

const markupShown = (raised: RaisedCard): Line[] => cards.map(card =>
  lines.plain(`<p class="${raised === card ? 'card raised' : 'card'}">${names[card]}</p>`));

const rulesShown = (raised: RaisedCard): Line[] => lines.fromTheExhibit([
  ...carve.unit(sheet, '.card {'),
  ...raised === 'none' ? [] : [lines.blank, ...carve.unit(sheet, '.raised {')]
]);

const verdicts: Record<RaisedCard, string> = {
  none: 'Third is on top. It comes last in the code.',
  first: 'First is on top. Its z-index outranks the order in the code.',
  second: 'Second is on top. Its z-index outranks the order in the code.',
  third: 'Third is on top. Its z-index and its place in the code agree.'
};

export const ThePile: FC = () => {
  const {pile, raised: chosen, updateSearchParams, removeSearchParams} = useSearchParamsObject(
    {pile: schema.literalUnion('block', 'inline', 'overlap', 'z-index'), raised: readerSettings.decoders.raised},
    {raised: 'none'});
  const step = pile ?? (chosen === 'none' ? 'block' : 'z-index');
  const chooseStep = (next: Step) => {
    if (next === 'block') removeSearchParams(['pile', 'raised']);
    else if (next === 'z-index') updateSearchParams({pile: next});
    else updateSearchParams({pile: next}, {without: ['raised']});
  };
  const raised = step === 'z-index' ? chosen : 'none';
  const drawingName = useId();

  return <Exhibit name="The pile">
    <figure className="the-pile field">
      <p className="caption uppercase" aria-hidden="true">Step</p>
      <section className="pile-steps">
        <PillGlider label="Step" name="pile" choices={steps} chosen={step} onChosen={chooseStep} wraps/>
      </section>
      <p className="paragraph">{stories[step]}</p>
      <section className="pile-code">
        <Snippet label="HTML" lines={flowing(step) ? flowMarkup[step] : markupShown(raised)}/>
        <Snippet label="CSS" lines={flowing(step) ? flowRules[step] : rulesShown(raised)}/>
      </section>
      {flowing(step)
        ? <section className="pile-code">
          <p className="caption uppercase" id={drawingName}>What the browser draws</p>
          <section className={classNames('flow-drawing', step === 'inline' && 'along-a-line lines-for-padded-boxes')}
            aria-labelledby={drawingName}>
            {step === 'block'
              ? cards.map(card => <p key={card} className="card hairline-edged rounded-corners">{names[card]}</p>)
              : <>
                {cards.map(card => <Fragment key={card}>
                  <span className="card hairline-edged rounded-corners">{names[card]}</span> </Fragment>)}
                <span className="caption muted-ink muted-dashed-outline rounded-corners" aria-hidden="true">
                  {moreOfThePage}</span> <span className="caption muted-ink muted-dashed-outline rounded-corners" aria-hidden="true">
                  {moreOfThePage}</span>
              </>}
          </section>
          <Verdict>{flowVerdicts[step]}</Verdict>
        </section>
        : <section className="pile-code">
          <p className="caption uppercase" id={drawingName}>What the browser draws · one stacking context</p>
          <section className="pile-drawing" aria-labelledby={drawingName}>
            {cards.map(card => <p key={card} className={classNames(
              'card piled hairline-edged rounded-corners floating', raised === card && 'raised')}>
              {names[card]}</p>)}
          </section>
          <Verdict>{verdicts[raised]}</Verdict>
        </section>}
      {step === 'z-index' && <>
        <p className="caption uppercase" aria-hidden="true">Give a z-index to</p>
        <PillGlider label="Give a z-index to" name="pile-raised" choices={cardsToRaise} chosen={chosen}
          onChosen={next => updateSearchParams({pile: 'z-index', raised: next})}/>
      </>}
    </figure>
    <ExhibitFoot><strong className="bold">Three cards.</strong> Four steps, each adding one thing: block, inline,
      overlap, then a z-index.</ExhibitFoot>
  </Exhibit>;
};
