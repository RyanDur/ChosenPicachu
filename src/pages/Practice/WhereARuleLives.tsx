import {FC} from 'react';
import wideFrame from './drawings/where-a-rule-lives-wide.svg?url&no-inline';
import stackedFrame from './drawings/where-a-rule-lives-stacked.svg?url&no-inline';
import {whereARuleLivesSizes} from './whereARuleLivesFrames';
import './PracticeDrawing.css';
import './WhereARuleLives.css';

const {wide, stacked} = whereARuleLivesSizes;

export const WhereARuleLives: FC = () =>
  <figure className="where-a-rule-lives practice-drawing">
    <picture className="center">
      <source media="(width <= 600px)" srcSet={stackedFrame} width={stacked.width} height={stacked.height}/>
      <img className="drawing" src={wideFrame} width={wide.width} height={wide.height} alt=""/>
    </picture>
    <figcaption className="caption"><strong className="bold">Where a rule lives.</strong> The shared words live in{' '}
      <code className="monospaced">src/styles</code>, by concern. A component’s structure lives beside the component.
    </figcaption>
  </figure>;
