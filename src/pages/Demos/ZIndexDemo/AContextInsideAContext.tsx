import {FC, useId} from 'react';
import {Choice, PillGlider} from '@components/PillGlider';
import {classNames} from '@components';
import {carve, Line, lines, Snippet, useExhibitStep} from '../Recipe';
import sheet from './AContextInsideAContext.css?sample';
import './AContextInsideAContext.css';

type Step = 'one-context' | 'a-context-inside' | 'the-list-inside' | 'the-list-outside';

const steps: Choice<Step>[] = [
  {words: 'One context', value: 'one-context'},
  {words: 'A context inside', value: 'a-context-inside'},
  {words: 'The list inside', value: 'the-list-inside'},
  {words: 'The list outside', value: 'the-list-outside'}
];

type Told = {story: string; verdict: string; markup: Line[]; rules: Line[]};

const ruleFor = (anchor: string): Line[] => carve.unit(sheet, anchor);

const rulesShown = (...rules: Line[][]): Line[] =>
  lines.fromTheExhibit(rules.flatMap((rule, at) => at === 0 ? rule : [lines.blank, ...rule]));

const cardsBeside = [lines.plain('<section class="card a">Card A</section>'), lines.plain('<section class="card b">Card B</section>')];

const told: Record<Step, Told> = {
  'one-context': {
    story: 'A stacking context is a group of boxes the browser orders together, as it did with the pile. Here the page is one context, and it holds two cards.',
    verdict: 'One context: the page.',
    markup: cardsBeside,
    rules: rulesShown(ruleFor('.b {'))
  },
  'a-context-inside': {
    story: 'Contexts nest, the way elements do. Card A now forms a context of its own. The browser ranks the boxes inside card A only against each other, then stacks card A as one box in the page.',
    verdict: 'Two contexts: the page, and card A inside it.',
    markup: cardsBeside,
    rules: rulesShown(ruleFor('.b {'), lines.marked(ruleFor('.a {')))
  },
  'the-list-inside': {
    story: 'We write a list inside card A and give it a z-index of 9999. The browser ranks that 9999 only against what else is in card A. Then it stacks card A as one box against card B, and there card B’s 1 is the larger number.',
    verdict: 'The list opens under card B.',
    markup: [
      lines.plain('<section class="card a">'),
      lines.plain('  Card A'),
      ...lines.marked([lines.plain('  <ul class="list">…</ul>')]),
      lines.plain('</section>'),
      lines.plain('<section class="card b">Card B</section>')
    ],
    rules: rulesShown(ruleFor('.b {'), ruleFor('.a {'), lines.marked(ruleFor('.list {')))
  },
  'the-list-outside': {
    story: 'Now we write the list at the page’s level, beside the cards. The browser compares its 9999 with card B’s 1, and the list wins. The number did not change. Where we wrote the list did.',
    verdict: 'The list opens over card B.',
    markup: [...cardsBeside, ...lines.marked([lines.plain('<ul class="list">…</ul>')])],
    rules: rulesShown(ruleFor('.b {'), ruleFor('.a {'), ruleFor('.list {'))
  }
};

const TheList: FC = () => <ul className="list listed card hairline-edged rounded-corners plan-mint">
  <li>List · 9999</li>
</ul>;

export const AContextInsideAContext: FC = () => {
  const {step, numberedSteps, choose: chooseStep} = useExhibitStep('nesting', steps, 'one-context');
  const title = useId();
  const isolating = step !== 'one-context';
  const {story, verdict, markup, rules} = told[step];

  return <figure className="context-inside card rounded-corners lifted padded" aria-labelledby={title}>
    <p className="caption uppercase" aria-hidden="true">Exhibit</p>
    <p className="sub-title" id={title}>A context inside a context</p>
    <p className="caption uppercase" aria-hidden="true">Step</p>
    <section className="nesting-steps">
      <PillGlider label="Step" name="nesting" choices={numberedSteps} chosen={step} onChosen={chooseStep} wraps/>
    </section>
    <p className="paragraph">{story}</p>
    <section className="nesting-stage">
      <section className="nesting-code">
        <Snippet label="HTML" lines={markup}/>
        <Snippet label="CSS" lines={rules}/>
      </section>
      <section className="nesting-code">
        <p className="caption uppercase" aria-hidden="true">What the browser draws</p>
        <section className={classNames('nesting-drawing muted-dashed-outline rounded-corners', isolating && 'isolating')}
          aria-label="What the browser draws">
          <section className={classNames('a nested-card shorter card rounded-corners plan-blue',
            isolating ? 'ink-dashed-outline' : 'hairline-edged')}>
            {isolating ? 'Card A · a context of its own' : 'Card A'}
            {step === 'the-list-inside' && <TheList/>}
          </section>
          <section className="b nested-card taller card hairline-edged rounded-corners plan-rose">
            Card B · z-index: 1
          </section>
          {step === 'the-list-outside' && <TheList/>}
        </section>
        <output aria-label="what the browser drew" className="paragraph bold">{verdict}</output>
      </section>
    </section>
    <figcaption className="caption"><strong className="bold">A context inside a context.</strong> Four steps: one
      context, a context inside it, a list written inside, then the same list written outside. The numbers stay the
      same.</figcaption>
  </figure>;
};
