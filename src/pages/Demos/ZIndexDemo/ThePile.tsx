import {FC, useId, useState} from 'react';
import {Choice, PillGlider} from '@components/PillGlider';
import {classNames} from '@components';
import {carve, Line, lines, Snippet} from '../Recipe';
import {useControls} from '../Controls';
import {inOrder, RaisedCard} from '../ReaderSettings';
import sheet from './ThePile.css?sample';
import './ThePile.css';

type Step = 'overlap' | 'z-index';
type Card = Exclude<RaisedCard, 'none'>;

const names: Record<RaisedCard, string> = {none: 'None', first: 'First', second: 'Second', third: 'Third'};
const cards: Card[] = ['first', 'second', 'third'];
const steps: Choice<Step>[] = [{words: 'Overlap', value: 'overlap'}, {words: 'Z-index', value: 'z-index'}];
const cardsToRaise: Choice<RaisedCard>[] = inOrder.raisedCards.map(value => ({words: names[value], value}));

const stories: Record<Step, string> = {
  overlap: 'The z is a third direction: out of the page, toward us. It only matters where boxes overlap. There the browser has to draw one box over another, so it keeps them in an order, like a pile. A group of boxes it orders that way is a stacking context. With no z-index, the order inside it is the order in the code.',
  'z-index': 'A z-index is a number that gives a box its place in its stacking context, which is why we call it an index. Give one card a z-index and it moves to the top, wherever the code lists it.'
};

const markupShown = (raised: RaisedCard): Line[] => cards.map(card =>
  lines.plain(`<p class="${raised === card ? 'card raised' : 'card'}">${names[card]}</p>`));

const rulesShown = (raised: RaisedCard): Line[] => lines.fromTheExhibit([
  ...carve.unit(sheet, '.card {'),
  ...raised === 'none' ? [] : [lines.blank, ...carve.unit(sheet, '.raised {')]
]);

const verdictOn = (raised: RaisedCard): string => raised === 'none'
  ? 'Third is on top. It comes last in the code.'
  : `${names[raised]} is on top. Its z-index outranks the order in the code.`;

export const ThePile: FC = () => {
  const {raised: chosen, change} = useControls();
  const [picked, chooseStep] = useState<Step>();
  const step = picked ?? (chosen === 'none' ? 'overlap' : 'z-index');
  const raised = step === 'z-index' ? chosen : 'none';
  const title = useId();

  return <figure className="the-pile card rounded-corners lifted padded" aria-labelledby={title}>
    <p className="caption uppercase" aria-hidden="true">Exhibit</p>
    <h2 className="sub-title" id={title}>The pile</h2>
    <p className="caption uppercase" aria-hidden="true">Step</p>
    <PillGlider label="Step" name="pile-step" choices={steps} chosen={step} onChosen={chooseStep}/>
    <p className="paragraph">{stories[step]}</p>
    <section className="pile-stage">
      <section className="pile-code">
        <Snippet label="HTML" lines={markupShown(raised)}/>
        <Snippet label="CSS" lines={rulesShown(raised)}/>
      </section>
      <section className="pile-code">
        <p className="caption uppercase">What the browser draws · one stacking context</p>
        <section className="pile-drawing" aria-label="the pile">
          {cards.map(card => <p key={card} className={classNames(
            'card piled hairline-edged rounded-corners floating', raised === card && 'raised')}>
            {names[card]}</p>)}
        </section>
        <output className="paragraph bold">{verdictOn(raised)}</output>
      </section>
    </section>
    {step === 'z-index' && <>
      <p className="caption uppercase" aria-hidden="true">Give a z-index to</p>
      <PillGlider label="Give a z-index to" name="pile-raised" choices={cardsToRaise} chosen={chosen}
        onChosen={next => {
          chooseStep('z-index');
          change({raised: next});
        }}/>
    </>}
    <figcaption className="caption"><strong className="bold">Three cards.</strong> Two steps: an overlap, then a
      z-index.</figcaption>
  </figure>;
};
