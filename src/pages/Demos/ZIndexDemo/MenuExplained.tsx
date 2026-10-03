import {FC} from 'react';
import {plain, Snippet} from '../Recipe';
import {span, unit} from '../Recipe/carve';
import {TrappedMenu} from './TrappedMenu';
import {ANumberInsideALayer, Where9999IsCompared} from './Diagrams';
import {CardOne} from './card-one';
import trappedSource from './TrappedMenu.tsx?raw';
import zIndexCss from './ZIndexDemo.css?raw';
import '../Recipe/Runs.css';

const gap = plain(' ');

type Props = {
  cardOne: CardOne;
  onCardOne: (cardOne: CardOne) => void;
};

export const MenuExplained: FC<Props> = ({cardOne, onCardOne}) =>
  <section aria-labelledby="9999-still-loses-heading" className="stacking-part">
    <h3 id="9999-still-loses-heading" className="title bold">Why 9999 still loses</h3>
    <TrappedMenu cardOne={cardOne} onCardOne={onCardOne}/>
    <ol className="runs card rounded-corners lifted padded">
      <li className="run">
        <p className="paragraph">Open Sort by. The list has a z-index of 9999, and card two has a z-index of 1,
          yet the list opens under card two: its top shows in the gap between the cards, and its bottom shows
          below card two. Move through it with the arrow keys, and the choice in focus moves where you cannot
          see it, under card two. The menu works. It is drawn in the wrong place.</p>
        <Snippet label="CSS" lines={[
          ...unit(zIndexCss, '.sort-choices {'), gap,
          ...unit(zIndexCss, '.old-way-card {'), gap,
          ...unit(zIndexCss, '.forms-context {')
        ]}/>
      </li>
      <li className="run">
        <p className="paragraph">Card one is positioned and has a z-index of 1, so it forms a stacking context: a
          layer the browser paints as one, the card and everything inside it together. Inside that layer, the
          list’s 9999 puts it above card one’s own face. Outside it, the 9999 counts for nothing.</p>
        <ANumberInsideALayer/>
      </li>
      <li className="run">
        <p className="paragraph">A z-index is compared only with the others in the same stacking context. The page
          itself is a stacking context, the root one. There the browser compares card one and card two, 1 against
          1, and a tie goes to the one later in the code, so card two is painted over card one, list and all. No
          number on the list can change that, because the list is never compared with card two.</p>
        <Where9999IsCompared/>
      </li>
      <li className="run">
        <p className="paragraph">Uncheck Card one has z-index: 1, and card one’s z-index goes back to auto. The card
          is still positioned, but at auto it forms no stacking context, so the list joins the page’s context, and
          its 9999 is compared with card two’s 1. The list opens over card two. Check it again, and the card forms
          its layer again, with the list inside it.</p>
        <Snippet label="HTML" lines={[
          ...span(trappedSource, '<label className="context-choice">', '</label>'), gap,
          ...span(trappedSource, "<li className={classNames('old-way-card", "'forms-context')}>")
        ]}/>
      </li>
    </ol>
  </section>;
