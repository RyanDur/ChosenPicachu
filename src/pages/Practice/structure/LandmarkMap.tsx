import {FC} from 'react';
import wideFrame from '../drawings/landmark-map-wide.svg?url&no-inline';
import stackedFrame from '../drawings/landmark-map-stacked.svg?url&no-inline';
import {practiceDrawings} from '../drawings';
import '../PracticeDrawing.css';

const {wide, stacked} = practiceDrawings.byName['landmark-map'].sizes;

export const LandmarkMap: FC = () =>
  <figure className="practice-drawing">
    <picture className="center">
      <source media={practiceDrawings.phoneHeldUpright} srcSet={stackedFrame}
        width={stacked.width} height={stacked.height}/>
      <img className="drawing" src={wideFrame} width={wide.width} height={wide.height} alt=""/>
    </picture>
    <figcaption className="caption"><strong className="bold">The page’s table of contents.</strong> Each landmark, with
      its element and, where it has one, its name.
    </figcaption>
  </figure>;
