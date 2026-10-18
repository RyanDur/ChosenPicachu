import {FC, useContext} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {inOrder, moments} from '@pages/Record/moments/moments';
import {momentAddress} from './MomentLink';
import {concernId, fromTheRecord} from '@pages/Record/moments/concerns';
import {CurrentConcern} from './ConcernSection';

export const FromTheRecord: FC = () =>
  useContext(CurrentConcern).either(concern => <section className="concern-evidence" aria-labelledby={`${concernId(concern)} ${concernId(concern)}-record`}>
    <h3 className="sub-title" id={`${concernId(concern)}-record`}>from the record</h3>
    <ol className="moments" aria-label={`${concern}, from the record`}>
      {inOrder.filter(key => fromTheRecord[concern].includes(key)).map(key =>
        <li key={key}>
          <Link className="moment-line paragraph signpost" to={momentAddress(key)}>
            <time className="moment-year caption bold" dateTime={moments[key].date.year}>{moments[key].date.year}</time> {moments[key].title}
          </Link>
        </li>)}
    </ol>
    <p className="caption"><Link className="signpost" to={Paths.record}>the whole record</Link></p>
  </section>, () => null);
