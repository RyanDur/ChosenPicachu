import {FC, PropsWithChildren, ReactNode} from 'react';
import {Choice, PillGlider} from '@components/PillGlider';
import {DemoTopics} from '@pages/Demos';
import {TabLink} from '@pages/Demos/TabLink';
import {carve, Line, lines, Snippet, useExhibitStep} from '../Recipe';
import {Exhibit, ExhibitFoot, ResultLine, Verdict} from '../Exhibit';
import sheet from './BannerAtTheEdge.css?sample';
import './LittleWindow.css';
import './BannerAtTheEdge.css';

type Step = 'written-in-a-card' | 'moved-to-the-page' | 'a-bigger-number-arrives';

const steps: Choice<Step>[] = [
  {words: 'Written in a card', value: 'written-in-a-card'},
  {words: 'Moved to the page', value: 'moved-to-the-page'},
  {words: 'A bigger number arrives', value: 'a-bigger-number-arrives'}
];

type Told = {
  story: ReactNode;
  whereWeMeetIt: string;
  verdict: string;
  comparedWith: string;
  tabOrder: string;
  markup: Line[];
  rules: Line[];
};

const theBanner = (indent: string): Line[] =>
  lines.marked([lines.plain(`${indent}<p class="banner">… <button>×</button></p>`)]);

const theCards = (inCardOne: Line[]): Line[] => [
  lines.plain('<section class="little-card one">'),
  lines.plain('  <button>Raise a banner</button>'),
  ...inCardOne,
  lines.plain('</section>'),
  lines.plain('<p>text on the page</p>'),
  lines.plain('<section class="little-card two">'),
  lines.plain('  <button>Open</button>'),
  lines.plain('</section>')
];

const theRules: Line[] = lines.fromTheExhibit([
  ...carve.unit(sheet, '.little-card {'), lines.blank, ...carve.unit(sheet, '.banner {\n        position: fixed')
]);

const theHelpButton: Line[] = lines.marked([lines.plain('<button class="help">Help</button>')]);

const theHelpRule: Line[] = lines.marked(lines.fromTheExhibit(carve.unit(sheet, '.help {\n        position: fixed')));

const told: Record<Step, Told> = {
  'written-in-a-card': {
    story: <>For years we pinned a banner to the window with <code className="monospaced">position: fixed</code> and
      gave it a big z-index. Here it is written inside card one, the card that raised it. Card one forms a <TabLink
      to={DemoTopics.zIndex}>stacking context</TabLink>, so the banner’s 9999 counts only inside that card. Plain text
      passes under the banner, and card two passes over it.</>,
    whereWeMeetIt: 'A notice or a toast written inside the component that raised it.',
    verdict: 'Card two is drawn over the banner.',
    comparedWith: 'what else is inside card one. Card one, as one box, is then compared with card two.',
    tabOrder: 'Raise a banner, then the banner’s dismiss button, then Open.',
    markup: theCards(theBanner('  ')),
    rules: theRules
  },
  'moved-to-the-page': {
    story: <>Our fix was to write the banner somewhere else: last on the page, outside every card. Now the browser
      compares its 9999 with the cards themselves, and the banner stays on top. The move has a cost. The Tab key and a
      screen reader follow the order of the code, so the banner now comes after everything else on the page, far from
      the button that raised it. We patched that with script that moves focus, or with a <code
      className="monospaced">tabindex</code>, and kept each patch right by hand.</>,
    whereWeMeetIt: 'Banners, toasts and dialogs moved to the end of the page, often by a library.',
    verdict: 'The banner is drawn over card two, and its dismiss button is now the last stop for the Tab key.',
    comparedWith: 'everything written at the page’s level, card two included.',
    tabOrder: 'Raise a banner, then Open, then the banner’s dismiss button, last on the page.',
    markup: [...theCards([]), ...theBanner('')],
    rules: theRules
  },
  'a-bigger-number-arrives': {
    story: <>The page’s level has a second cost. The banner is compared with every other number written there. A
      help button arrives with 10000 and covers the banner’s end. We answer with 10001, and the numbers keep climbing.
      The next part shows what the browser gives us now.</>,
    whereWeMeetIt: 'Style sheets with z-index values of 9999, 99999 and higher.',
    verdict: 'The help button is drawn over the banner’s end.',
    comparedWith: 'everything written at the page’s level, the help button included.',
    tabOrder: 'Raise a banner, then Open, then the banner’s dismiss button, then Help.',
    markup: [...theCards([]), ...theBanner(''), ...theHelpButton],
    rules: [...theRules, lines.blank, ...theHelpRule]
  }
};

const fourTexts = ['first', 'second', 'third', 'fourth'];

const LittleButton: FC<PropsWithChildren<{'aria-label'?: string}>> = ({children, 'aria-label': named}) =>
  <button type="button" tabIndex={0} aria-label={named}
    className="button card hairline-outline rounded-corners paragraph ink attentive reachable badge-before alarm-badge-before">
    {children}
  </button>;

const TextOnThePage: FC = () =>
  <p className="little-box muted-dashed-outline rounded-corners caption">text on the page</p>;

const TheBanner: FC = () => <p className="banner plan-mint hairline-outline rounded-corners caption">
  <span>Banner · 9999</span>
  <LittleButton aria-label="Dismiss the banner">×</LittleButton>
</p>;

const TheHelpButton: FC = () =>
  <button type="button" tabIndex={0}
    className="help button inverse-filled rounded-corners caption attentive reachable badge-before alarm-badge-before">
    Help · 10000
  </button>;

export const BannerAtTheEdge: FC = () => {
  const {step, numberedSteps, choose: chooseStep} = useExhibitStep('banner', steps, 'written-in-a-card');
  const {story, whereWeMeetIt, verdict, comparedWith, tabOrder, markup, rules} = told[step];

  return <Exhibit name="A fixed banner, in a card and on the page">
    <figure className="banner-at-the-edge code-beside-window field">
      <p className="caption uppercase" aria-hidden="true">Step</p>
      <PillGlider label="Step" name="banner" choices={numberedSteps} chosen={step} onChosen={chooseStep} wraps/>
      <p className="paragraph">{story}</p>
      <dl className="where-we-meet-it">
        <dt className="caption uppercase">Where we meet it</dt>
        <dd className="paragraph">{whereWeMeetIt}</dd>
      </dl>
      <p className="paragraph">The buttons in the drawing do nothing when pressed. They are there to show the Tab
        stops.</p>
      <Snippet label="HTML" lines={markup}/>
      <Snippet label="CSS" lines={rules}/>
      <section className="little-window card hairline-outline rounded-corners">
        <p className="little-bar caption uppercase field hairline-rule-below">The window</p>
        <section className="little-view">
          <section className="little-page focus-ringed" aria-label="The little page" tabIndex={0}>
            <section className="one little-card plan-blue ink-dashed-outline rounded-corners">
              <p className="paragraph">Card one</p>
              <LittleButton>Raise a banner</LittleButton>
              {step === 'written-in-a-card' && <TheBanner/>}
            </section>
            <TextOnThePage/>
            <section className="two little-card plan-rose hairline-outline rounded-corners">
              <p className="paragraph">Card two · 1</p>
              <LittleButton>Open</LittleButton>
            </section>
            {fourTexts.map(text => <TextOnThePage key={text}/>)}
            {step !== 'written-in-a-card' && <TheBanner/>}
            {step === 'a-bigger-number-arrives' && <TheHelpButton/>}
          </section>
        </section>
      </section>
      <Verdict aria-label="what the browser drew">{verdict}</Verdict>
      <ResultLine label="Compared with:">{comparedWith}</ResultLine>
      <ResultLine label="Tab order:">
        {tabOrder} The red numbers in the drawing show it. A screen reader reads the page in the same order.
      </ResultLine>
    </figure>
    <ExhibitFoot>
      <strong className="bold">A fixed banner, in a card and on the page.</strong> Three steps: the banner written inside
      a card, the same banner written at the page’s level and what that does to the Tab order, and what happens there
      when a bigger number arrives.
    </ExhibitFoot>
  </Exhibit>;
};
