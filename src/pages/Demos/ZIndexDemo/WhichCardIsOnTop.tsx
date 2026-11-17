import {FC} from 'react';
import {Reveal, Snippet, lines} from '../Recipe';
import {CardTwoOnTop} from './CardTwoOnTop';
import {partHeadings} from './part-headings';
import '../Runs.css';
import './ZIndexDemo.css';

const cards = [
  lines.plain('<ol class="cards">'),
  lines.plain('  <li class="card card-one">'),
  lines.plain('    <ul class="list">…</ul>'),
  lines.plain('  </li>'),
  lines.plain('  <li class="card card-two">…</li>'),
  lines.plain('  <li class="card card-three">…</li>'),
  lines.plain('</ol>')
];

const theirNumbers = [
  lines.plain('.cards {'),
  lines.plain('  position: relative;'),
  lines.plain('  isolation: isolate;'),
  lines.plain('}'),
  lines.blank,
  lines.plain('.card {'),
  lines.plain('  position: absolute;'),
  lines.plain('  inset: 0;'),
  lines.plain('}'),
  lines.blank,
  lines.plain('.card-one {'),
  lines.plain('  z-index: 1;'),
  lines.plain('}'),
  lines.blank,
  lines.plain('.list {'),
  lines.plain('  position: absolute;'),
  lines.plain('  z-index: 9999;'),
  lines.plain('}'),
  lines.blank,
  lines.plain('.card-two {'),
  lines.plain('  z-index: 2;'),
  lines.plain('}'),
  lines.blank,
  lines.plain('.card-three {'),
  lines.plain('  z-index: auto;'),
  lines.plain('}')
];

export const WhichCardIsOnTop: FC = () =>
  <section aria-labelledby={partHeadings.whichCardIsOnTop} className="stacking-part">
    <h3 id={partHeadings.whichCardIsOnTop} className="sub-title bold">Which card is on top?</h3>
    <ol className="runs card rounded-corners lifted padded">
      <li className="run">
        <p className="paragraph">Three cards sit over the same spot. Card one has a z-index of 1, and the list inside it
          has 9999. Card two has 2. Card three has auto and comes last in the code. Which one paints on top, and
          why?</p>
        <Snippet label="HTML" lines={cards}/>
        <Snippet label="CSS" lines={theirNumbers}/>
      </li>
      <li className="run">
        <Reveal summary="show the answer">
          <p className="paragraph">Card two. Card one forms a stacking context, so the list’s 9999 is compared only
            inside card one. <code className="monospaced">.cards</code> forms a stacking context too,
            with <code className="monospaced unbroken">isolation: isolate</code>, and inside it card one’s 1 is
            compared with card two’s 2, and card two wins. Card three is later in the code, but a positioned box with a
            z-index of auto paints under every box in the same stacking context that has a positive z-index, so it is
            under both.</p>
          <CardTwoOnTop/>
        </Reveal>
      </li>
    </ol>
  </section>;
