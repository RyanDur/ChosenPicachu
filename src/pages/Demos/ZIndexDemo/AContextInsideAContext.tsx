import {FC, useId} from 'react';
import {Choice, PillGlider} from '@components/PillGlider';
import {classNames} from '@components';
import {carve, Line, lines, Snippet, useExhibitStep} from '../Recipe';
import sheet from './AContextInsideAContext.css?sample';
import './AContextInsideAContext.css';

type Step = 'the-page' | 'a-context-inside' | 'the-list-inside' | 'the-list-outside';

const steps: Choice<Step>[] = [
  {words: 'The page', value: 'the-page'},
  {words: 'A context inside', value: 'a-context-inside'},
  {words: 'The list inside', value: 'the-list-inside'},
  {words: 'The list outside', value: 'the-list-outside'}
];

type Told = {story: string; verdict: string; markup: Line[]; rules: Line[]};

const ruleFor = (anchor: string): Line[] => carve.unit(sheet, anchor);

const rulesShown = (...rules: Line[][]): Line[] =>
  lines.fromTheExhibit(rules.flatMap((rule, at) => at === 0 ? rule : [lines.blank, ...rule]));

const cardsBeside = [
  lines.plain('<section class="card card-a">Card A</section>'),
  lines.plain('<section class="card card-b">Card B</section>')
];

const told: Record<Step, Told> = {
  'the-page': {
    story: 'A stacking context is a group of boxes the browser orders together, as it did with the pile. Here the page holds two cards.',
    verdict: 'Card A forms no context yet.',
    markup: cardsBeside,
    rules: rulesShown(ruleFor('.card-b {'))
  },
  'a-context-inside': {
    story: 'Contexts nest, the way elements do. Card A now forms a context of its own. The browser ranks the boxes inside card A only against each other, then stacks card A as one box in the page.',
    verdict: 'Card A is now a context inside the page.',
    markup: cardsBeside,
    rules: rulesShown(ruleFor('.card-b {'), lines.marked(ruleFor('.card-a {')))
  },
  'the-list-inside': {
    story: 'We write a list inside card A and give it a z-index of 9999. The browser ranks that 9999 only against what else is in card A. Then it stacks card A as one box against card B, and there card B’s 1 is the larger number.',
    verdict: 'The list opens under card B.',
    markup: [
      lines.plain('<section class="card card-a">'),
      lines.plain('  Card A'),
      ...lines.marked([lines.plain('  <ul class="list">…</ul>')]),
      lines.plain('</section>'),
      lines.plain('<section class="card card-b">Card B</section>')
    ],
    rules: rulesShown(ruleFor('.card-b {'), ruleFor('.card-a {'), lines.marked(ruleFor('.list {')))
  },
  'the-list-outside': {
    story: 'Now we write the list at the page’s level, beside the cards. The browser compares its 9999 with card B’s 1, and the list wins. The number did not change. Where we wrote the list did.',
    verdict: 'The list opens over card B.',
    markup: [...cardsBeside, ...lines.marked([lines.plain('<ul class="list">…</ul>')])],
    rules: rulesShown(ruleFor('.card-b {'), ruleFor('.card-a {'), ruleFor('.list {'))
  }
};

const TheList: FC = () => <ul className="list listed card hairline-edged rounded-corners plan-mint">
  <li>List · 9999</li>
</ul>;

export const AContextInsideAContext: FC = () => {
  const {step, numberedSteps, choose: chooseStep} = useExhibitStep('nesting', steps, 'the-page');
  const title = useId();
  const drawingName = useId();
  const isolating = step !== 'the-page';
  const {story, verdict, markup, rules} = told[step];

  return <figure className="context-inside card rounded-corners lifted padded" aria-labelledby={title}>
    <p className="caption uppercase" aria-hidden="true">Exhibit</p>
    <p className="sub-title" id={title}>A context inside a context</p>
    <p className="caption uppercase" aria-hidden="true">Step</p>
    <section className="nesting-steps">
      <PillGlider label="Step" name="nesting" choices={numberedSteps} chosen={step} onChosen={chooseStep} wraps/>
    </section>
    <p className="paragraph">{story}</p>
    <section className="nesting-code">
      <Snippet label="HTML" lines={markup}/>
      <Snippet label="CSS" lines={rules}/>
    </section>
    <section className="nesting-code">
      <p className="caption uppercase" id={drawingName}>What the browser draws</p>
      <section className={classNames('nesting-drawing muted-dashed-outline rounded-corners', isolating && 'isolating')}
        aria-labelledby={drawingName}>
        <section className={classNames('card-a nested-card shorter card rounded-corners plan-blue',
          isolating ? 'ink-dashed-outline' : 'hairline-edged')}>
          {isolating ? 'Card A · a context of its own' : 'Card A'}
          {step === 'the-list-inside' && <TheList/>}
        </section>
        <section className="card-b nested-card taller card hairline-edged rounded-corners plan-rose">
          Card B · z-index: 1
        </section>
        {step === 'the-list-outside' && <TheList/>}
      </section>
      <output aria-label="what the browser drew" className="paragraph bold">{verdict}</output>
    </section>
    <figcaption className="caption"><strong className="bold">A context inside a context.</strong> Four steps: the
      page, a context inside it, a list written inside, then the same list written outside. The numbers stay the
      same.</figcaption>
  </figure>;
};
