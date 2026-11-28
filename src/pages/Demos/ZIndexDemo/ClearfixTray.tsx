import {FC, ReactNode, useId} from 'react';
import * as schema from 'schemawax';
import {maybe} from '@ryandur/sand';
import {Choice, PillGlider} from '@components/PillGlider';
import {classNames} from '@components';
import {useSearchParamsObject} from '@navigation/search-params';
import {carve, exhibitSteps, Line, lines, Snippet} from '../Recipe';
import {Verdict} from '../Exhibit';
import sheet from './ClearfixTray.css?sample';
import './ClearfixTray.css';

type Step = 'in-the-flow' | 'float' | 'the-clearfix' | 'what-we-have-now';

const steps: Choice<Step>[] = exhibitSteps.numbered([
  {words: 'In the flow', value: 'in-the-flow'},
  {words: 'Float', value: 'float'},
  {words: 'The clearfix', value: 'the-clearfix'},
  {words: 'What we have now', value: 'what-we-have-now'}
]);

type Told = {story: ReactNode; verdict: string; rules: Line[]; parentLooks: string};

const floated = carve.unit(sheet, '.kid {');

const told: Record<Step, Told> = {
  'in-the-flow': {
    story: 'A parent box grows to hold the boxes inside it, as long as they are in the flow.',
    verdict: 'The parent wraps First and Second.',
    rules: [lines.plain('/* none */')],
    parentLooks: ''
  },
  float: {
    story: <><code className="monospaced">float: left</code> takes a box out of the flow and pushes it to one side, so
      text can wrap around it. For years we floated boxes to set them side by side. The parent stops making room for
      them, as it does for an absolute box, and what comes after the parent moves up.</>,
    verdict: 'The parent collapses to a line. First and Second hang outside it, and the rest of the page slides up under them.',
    rules: lines.fromTheExhibit(lines.marked(floated)),
    parentLooks: 'floats'
  },
  'the-clearfix': {
    story: 'The clearfix was our fix. It adds an empty, unseen box at the end of the parent and tells that box to sit below every float. The parent stretches down to reach it, so it holds its floats again.',
    verdict: 'The parent holds its floats again, with one more rule and an unseen box.',
    rules: lines.fromTheExhibit([...floated, lines.blank, ...lines.marked(carve.unit(sheet, '.parent::after {'))]),
    parentLooks: 'floats clearfixed'
  },
  'what-we-have-now': {
    story: <>The platform now has a value for this. <code className="monospaced">display: flow-root</code> makes the
      parent hold its floats, with no extra box. We also float far less than we did, because flex and grid set boxes
      side by side and keep them in the flow.</>,
    verdict: 'The parent holds its floats, with one declaration.',
    rules: lines.fromTheExhibit([...floated, lines.blank, ...lines.marked(carve.unit(sheet, '.parent {'))]),
    parentLooks: 'floats flow-rooted'
  }
};

const markup: Line[] = [
  '<section class="parent">',
  '  <p class="kid">First</p>',
  '  <p class="kid">Second</p>',
  '</section>',
  '<p>more of the page</p>'
].map(lines.plain);

const firstStep: Step = 'in-the-flow';

export const ClearfixTray: FC = () => {
  const {clearfix: chosen, updateSearchParams, removeSearchParams} = useSearchParamsObject({
    clearfix: schema.literalUnion('in-the-flow', 'float', 'the-clearfix', 'what-we-have-now')
  });
  const shown = maybe(chosen);
  const isOpen = shown.map(() => true).orElse(false);
  const step = shown.orElse(firstStep);
  const {story, verdict, rules, parentLooks} = told[step];
  const pageLabelId = useId();

  return <section className="clearfix-offer">
    <p className="paragraph"><strong className="bold">Has a parent box collapsed on you?</strong> A box that leaves the
      flow does that to its parent. Floats did it too, and for years the clearfix was how we fixed it.</p>
    <details className="clearfix-tray" open={isOpen}
      onToggle={({currentTarget}) => {
        if (currentTarget.open === isOpen) return;
        if (currentTarget.open) updateSearchParams({clearfix: firstStep});
        else removeSearchParams(['clearfix']);
      }}>
      <summary className="tray-opener button primary reachable">{isOpen ? 'Close' : 'Show me the clearfix'}</summary>
      <section className="tray-content">
        <p className="caption uppercase" aria-hidden="true">The parent that lost its height</p>
        <section className="lost-height-steps">
          <PillGlider label="The parent that lost its height" name="clearfix" choices={steps} chosen={step}
            onChosen={next => updateSearchParams({clearfix: next})} wraps/>
        </section>
        <p className="paragraph">{story}</p>
        <section className="lost-height-stage">
          <section className="lost-height-code">
            <Snippet label="HTML" lines={markup}/>
            <Snippet label="CSS" lines={rules}/>
          </section>
          <section className="little-window card hairline-outline rounded-corners">
            <p className="little-bar caption uppercase field hairline-rule-below" id={pageLabelId}>The page</p>
            <section className={classNames('lost-height', parentLooks)} aria-labelledby={pageLabelId}>
              <section className="parent the-parent plan-sand ink-dashed-outline rounded-corners">
                <p className="kid little-box plan-blue hairline-outline rounded-corners">First</p>
                <p className="kid little-box plan-blue hairline-outline rounded-corners">Second</p>
              </section>
              <p className="little-box muted-dashed-outline rounded-corners caption">more of the page</p>
            </section>
          </section>
        </section>
        <Verdict aria-label="what the parent did">{verdict}</Verdict>
        <p className="paragraph">The dashed outline is the parent.</p>
      </section>
    </details>
  </section>;
};
