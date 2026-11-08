import {FC} from 'react';
import {Link} from 'react-router';
import {Concern, concerns} from '../concerns';
import {moments} from '../calendar';
import {recordAddress} from '../addresses';
import {StructureStory} from './StructureStory';
import {PresentationStory} from './PresentationStory';
import {BehaviorStory} from './BehaviorStory';

const stories: Record<Concern, FC> = {
  'Structure': StructureStory,
  'Presentation': PresentationStory,
  'Behavior': BehaviorStory
};

const StoryOf: FC<{concern: Concern}> = ({concern}) => {
  const Essay = stories[concern];
  return <section className="story trim-rule-above" aria-labelledby={concerns.idOf(concern)} tabIndex={-1}>
    <h2 className="record-title title" id={concerns.idOf(concern)}>{concern}</h2>
    <Essay/>
    <h3 className="sub-title">the moments it rests on</h3>
    <ol className="story-moments" aria-label={`${concern}, the moments it rests on`}>
      {moments.inOrder.filter(key => concerns.momentsByConcern[concern].includes(key)).map(key =>
        <li key={key}>
          <Link className="story-moment paragraph signpost" to={recordAddress.ofMoment(key)}>
            <time className="story-moment-year caption bold" dateTime={moments.headings[key].date.year}>
              {moments.headings[key].date.year}
            </time>{' '}
            {moments.headings[key].title}
          </Link>
        </li>)}
    </ol>
  </section>;
};

export const Stories: FC = () =>
  <>
    {concerns.inOrder.map(concern => <StoryOf key={concern} concern={concern}/>)}
  </>;
