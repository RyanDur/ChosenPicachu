import {FC} from 'react';
import {plain, Snippet} from '../Recipe';
import {span, unit} from '../Recipe/carve';
import {NaturalZIndex} from './NaturalZIndex';
import {OneNumberLiftsOneCard, PileFromTheSide} from './Diagrams';
import {RaisedCard} from './raised';
import naturalSource from './NaturalZIndex.tsx?raw';
import zIndexCss from './ZIndexDemo.css?raw';
import '../Recipe/Runs.css';

const gap = plain(' ');

type Props = {
  raised: RaisedCard;
  onRaised: (card: RaisedCard) => void;
};

export const StackingExplained: FC<Props> = ({raised, onRaised}) =>
  <section aria-labelledby="third-on-top-heading" className="stacking-part">
    <h3 id="third-on-top-heading" className="title bold">Why Third is on top</h3>
    <NaturalZIndex className="card rounded-corners lifted padded" raised={raised} onRaised={onRaised}/>
    <ol className="runs card rounded-corners lifted padded">
      <li className="run">
        <p className="paragraph">The pile is a list of three cards, First, Second and Third, in that order in the
          code. Every card is positioned: its position is set to something other than static, the default, so it
          can be placed by offsets and can overlap another box. Each card is relative, and while the pile is
          collapsed each is absolute, which takes it out of the page’s flow, the run of boxes that make room for
          each other, and puts all three in the same spot. Where boxes overlap, the browser paints them one after
          another, and the one painted last covers the rest. That order is the stacking order. The z-index
          property changes it, and its starting value, auto, keeps a positioned card in the order the code lists
          it. No card here sets a z-index, so First is painted first, Third is painted last, and Third lands on
          top.</p>
        <Snippet label="HTML" lines={span(naturalSource, '<ol id="z-index-layers"', '</ol>')}/>
        <Snippet label="CSS" lines={[
          ...unit(zIndexCss, '.layer {'), gap,
          ...unit(zIndexCss, '.closed {')
        ]}/>
        <PileFromTheSide/>
      </li>
      <li className="run">
        <p className="paragraph">Choose a card with the pills above the pile, and the page adds the class raised to
          it. The stylesheet gives raised a z-index of 1. A positioned card with a z-index of 1 is painted after every
          card left at auto, so the raised card lands on top. The others keep their order under it: they are
          still at auto, and still painted in the order the code lists them. A z-index only shows where cards
          overlap. Expand the pile, and a raise changes nothing you can see. Collapse it again, and the raised
          card comes down on top.</p>
        <Snippet label="TS" lines={unit(naturalSource, 'const layer =')}/>
        <Snippet label="CSS" lines={unit(zIndexCss, '.raised {')}/>
        <OneNumberLiftsOneCard/>
      </li>
    </ol>
  </section>;
