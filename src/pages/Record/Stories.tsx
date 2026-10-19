import {FC} from 'react';
import {Link} from 'react-router';
import {Concern, concernId, concernsInOrder, fromTheRecord} from './moments/concerns';
import {inOrder, moments} from './moments/moments';
import {momentAddress} from './MomentLink';
import {StructureStory} from './stories/StructureStory';
import {PresentationStory} from './stories/PresentationStory';
import {DynamicStory} from './stories/DynamicStory';

const stories: Record<Concern, FC> = {
  'Structure': StructureStory,
  'Presentation': PresentationStory,
  'Dynamic': DynamicStory
};

const StoryOf: FC<{concern: Concern}> = ({concern}) => {
  const Essay = stories[concern];
  return <section className="story trim-rule-above" aria-labelledby={concernId(concern)} tabIndex={-1}>
    <h2 className="record-title title" id={concernId(concern)}>{concern}</h2>
    <Essay/>
    <h3 className="sub-title">the moments it rests on</h3>
    <ol className="story-moments" aria-label={`${concern}, the moments it rests on`}>
      {inOrder.filter(key => fromTheRecord[concern].includes(key)).map(key =>
        <li key={key}>
          <Link className="story-moment paragraph signpost" to={momentAddress(key)}>
            <time className="story-moment-year caption bold" dateTime={moments[key].date.year}>{moments[key].date.year}</time>{' '}
            {moments[key].title}
          </Link>
        </li>)}
    </ol>
  </section>;
};

export const Stories: FC = () =>
  <>
    {concernsInOrder.map(concern => <StoryOf key={concern} concern={concern}/>)}
  </>;
