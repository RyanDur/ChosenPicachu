import {FC, useId} from 'react';
import * as schema from 'schemawax';
import {maybe, not} from '@ryandur/sand';
import {classNames, useHydrated} from '@components';
import {useSearchParamsObject} from '@navigation/search-params';
import {carve, Line, lines, Snippet} from '../Recipe';
import {Exhibit, ExhibitFoot} from '../Exhibit';
import sheet from './MenuInTheTopLayer.css?sample';
import './LittleWindow.css';
import './MenuInTheTopLayer.css';

type Told = {verdict: string; comparedWith: string; rules: Line[]};

const markup: Line[] = [
  lines.plain('<section class="card one">'),
  ...lines.marked([
    lines.plain('  <button popovertarget="sort">'),
    lines.plain('    Sort by'),
    lines.plain('  </button>'),
    lines.plain('  <ul id="sort" popover>…</ul>')
  ]),
  lines.plain('</section>'),
  lines.plain('<section class="card two">…</section>')
];

const theBrowsersOwnRule: Line[] = [
  '/* the browser’s own rule */',
  '[popover] {',
  '  position: fixed;',
  '  inset: 0;',
  '  margin: auto;',
  '}'
].map(lines.plain);

const leftAlone: Told = {
  verdict: 'The list opens over both cards, with no z-index of its own. It sits in the middle of the window.',
  comparedWith: 'nothing. The top layer is above every stacking context on the page.',
  rules: theBrowsersOwnRule
};

const cardOneRaised: Told = {
  verdict: `${leftAlone.verdict} Card one now rises over card two’s edge, and the list stays above both.`,
  comparedWith: 'nothing. Card one’s 9999 is compared with card two, and the list is above them both in the top layer.',
  rules: [...lines.marked(lines.fromTheExhibit(carve.unit(sheet, '.one {\n            position: relative'))), ...theBrowsersOwnRule]
};

export const MenuInTheTopLayer: FC = () => {
  const {'card-one-z': cardOneZ, updateSearchParams, removeSearchParams} = useSearchParamsObject({
    'card-one-z': schema.literalUnion('9999')
  });
  const raised = maybe(cardOneZ).map(() => true).orElse(false);
  const {verdict, comparedWith, rules} = raised ? cardOneRaised : leftAlone;
  const hydrated = useHydrated();
  const sortBy = useId();
  const list = useId();

  return <Exhibit name="The menu in the top layer">
    <figure className="menu-in-the-top-layer field">
      <p className="paragraph">A popover is a box the browser shows on top of everything else on the page, and takes
        away again, with no script of ours. Menus, tooltips and banners are the usual ones. Two attributes make
        one. <code className="monospaced">popover</code> on the list says the list is a popover,
        and <code className="monospaced">popovertarget</code> on the button says which popover the button opens.</p>
      <p className="paragraph">The browser draws an open popover in the top layer, a layer of its own above the whole
        page. No stacking context holds the top layer, so no z-index on the page competes with it. The list stays where
        we wrote it, inside its card, so the Tab key reaches it right after its button.</p>
      <p className="paragraph">The top layer changes where the list sits. It no longer sits under its button. The
        browser’s own rule stretches a popover’s box over the whole window with <code
        className="monospaced">inset: 0</code>, and <code className="monospaced">margin: auto</code> centers the list
        inside it. We can write over either one.</p>
      <section className="little-window card hairline-outline rounded-corners">
        <p className="little-bar caption uppercase trim">The window</p>
        <section className="little-view">
          <section className={classNames('little-page focus-ringed', raised && 'card-one-raised')}
            aria-label="The little page" tabIndex={0}>
            <p className="little-box muted-dashed-outline rounded-corners caption">text on the page</p>
            <section className="one little-card plan-blue hairline-outline rounded-corners">
              <button type="button" tabIndex={0} className="button primary reachable" id={sortBy}
                popoverTarget={list}>Sort by
              </button>
              <p className="paragraph">Card one</p>
              <ul id={list} popover="auto" aria-labelledby={sortBy}
                className="sort-list card plan-mint hairline-outline rounded-corners lifted">
                {['Newest', 'Oldest'].map(choice => <li key={choice}>
                  <button type="button" tabIndex={0} className="button reachable" popoverTarget={list}
                    popoverTargetAction="hide">{choice}</button>
                </li>)}
              </ul>
            </section>
            <section className="two little-card plan-rose hairline-outline rounded-corners">
              <p className="paragraph">Card two</p>
              <button type="button" tabIndex={0} className="button reachable">Open</button>
            </section>
          </section>
        </section>
      </section>
      <label className="raise-card-one reachable">
        <input type="checkbox" checked={raised} disabled={not(hydrated)}
          onChange={({currentTarget}) => currentTarget.checked
            ? updateSearchParams({'card-one-z': '9999'})
            : removeSearchParams(['card-one-z'])}/>
        <span>Curious whether a z-index changes any of this? Give card one <code
          className="monospaced">z-index: 9999</code>.</span>
      </label>
      <section className="top-layer-code">
        <Snippet label="HTML" lines={markup}/>
        <Snippet label="CSS" lines={rules}/>
      </section>
      <output aria-label="what the list did" className="paragraph bold">{verdict}</output>
      <p className="paragraph">We leave the placement alone, so the browser’s own rule centers the list in the
        window.</p>
      <dl className="where-we-meet-it">
        <dt className="caption uppercase">Where we meet it</dt>
        <dd className="paragraph">A notice that belongs to the whole page.</dd>
      </dl>
      <output aria-label="what the list is compared with" className="paragraph">
        {`Compared with: ${comparedWith}`}</output>
      <p className="paragraph">Tab order: Sort by, then Newest and Oldest, then Open. The list never leaves its place in
        the code, so the order stays right.</p>
      <p className="paragraph">Opening and closing: the browser opens and closes the list with no script, closes it on
        Escape or a click outside, and gives focus back to the button.</p>
    </figure>
    <ExhibitFoot>
      <strong className="bold">The menu in the top layer.</strong> The list is a popover. Leave it where the browser
      puts it, or place it in the window with inset, with margin, or with one edge at a time.
    </ExhibitFoot>
  </Exhibit>;
};
