import {FC, useId, useState} from 'react';
import {Choice, PillGlider} from '@components/PillGlider';
import {classNames} from '@components';
import {carve, Line, lines, Snippet} from '../Recipe';
import sheet from './AContextInsideAContext.css?sample';
import './AContextInsideAContext.css';

type Step = 'one-context' | 'two-contexts' | 'list-inside' | 'list-outside';

const steps: Choice<Step>[] = [
  {words: 'One context', value: 'one-context'},
  {words: 'Two contexts', value: 'two-contexts'},
  {words: 'List inside', value: 'list-inside'},
  {words: 'List outside', value: 'list-outside'}
];

type Told = {story: string; verdict: string; markup: string[]; rules: string[]};

const told: Record<Step, Told> = {
  'one-context': {
    story: 'A stacking context is a group of boxes the browser orders together, as it did with the pile. Here the page is one context, and it holds two cards.',
    verdict: 'One context: the page.',
    markup: ['<section class="card a">Card A</section>', '<section class="card b">Card B</section>'],
    rules: ['.b {']
  },
  'two-contexts': {
    story: 'Contexts nest, the way elements do. Card A now has isolation: isolate, which makes a box a stacking context of its own and changes nothing else about it. The browser orders the boxes inside card A only against each other, then stacks card A as one box in the page.',
    verdict: 'Two contexts: the page, and card A inside it.',
    markup: ['<section class="card a">Card A</section>', '<section class="card b">Card B</section>'],
    rules: ['.b {', '.a {']
  },
  'list-inside': {
    story: 'We write a list inside card A and give it a z-index of 9999. The browser compares that 9999 only against what else is in card A. Then it stacks card A as one box against card B, and there card B’s 1 is the larger number.',
    verdict: 'The list opens under card B.',
    markup: [
      '<section class="card a">',
      '  Card A',
      '  <ul class="list">…</ul>',
      '</section>',
      '<section class="card b">Card B</section>'
    ],
    rules: ['.b {', '.a {', '.list {']
  },
  'list-outside': {
    story: 'Now we write the list at the page’s level, beside the cards. The browser compares its 9999 with card B’s 1, and the list wins. The number did not change. Where we wrote the list did.',
    verdict: 'The list opens over card B.',
    markup: [
      '<section class="card a">Card A</section>',
      '<section class="card b">Card B</section>',
      '<ul class="list">…</ul>'
    ],
    rules: ['.b {', '.a {', '.list {']
  }
};

const rulesShown = (anchors: string[]): Line[] => lines.fromTheExhibit(
  anchors.flatMap((anchor, at) => at === 0 ? carve.unit(sheet, anchor) : [lines.blank, ...carve.unit(sheet, anchor)]));

const TheList: FC = () => <ul className="list listed card hairline-edged rounded-corners plan-mint">
  <li>List · 9999</li>
</ul>;

export const AContextInsideAContext: FC = () => {
  const [step, chooseStep] = useState<Step>('one-context');
  const title = useId();
  const isolating = step !== 'one-context';
  const {story, verdict, markup, rules} = told[step];

  return <figure className="context-inside card rounded-corners lifted padded" aria-labelledby={title}>
    <p className="caption uppercase" aria-hidden="true">Exhibit</p>
    <p className="sub-title" id={title}>A context inside a context</p>
    <p className="caption uppercase" aria-hidden="true">Step</p>
    <PillGlider label="Step" name="nesting-step" choices={steps} chosen={step} onChosen={chooseStep}/>
    <p className="paragraph">{story}</p>
    <section className="nesting-stage">
      <section className="nesting-code">
        <Snippet label="HTML" lines={markup.map(lines.plain)}/>
        <Snippet label="CSS" lines={rulesShown(rules)}/>
      </section>
      <section className="nesting-code">
        <p className="caption uppercase" aria-hidden="true">What the browser draws</p>
        <section className={classNames('nesting-drawing muted-dashed-outline rounded-corners', isolating && 'isolating')}
          aria-label="What the browser draws">
          <section className={classNames('a nested-card shorter card rounded-corners plan-blue',
            isolating ? 'alarm-dashed-outline' : 'hairline-edged')}>
            {isolating ? 'Card A · a context of its own' : 'Card A'}
            {step === 'list-inside' && <TheList/>}
          </section>
          <section className="b nested-card taller card hairline-edged rounded-corners plan-sand">
            Card B · z-index: 1
          </section>
          {step === 'list-outside' && <TheList/>}
        </section>
        <output aria-label="what the browser drew" className="paragraph bold">{verdict}</output>
      </section>
    </section>
    <figcaption className="caption"><strong className="bold">A context inside a context.</strong> Four steps: one
      context, a context inside it, a list written inside, then the same list written outside. The numbers stay the
      same.</figcaption>
  </figure>;
};
