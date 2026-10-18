import {FC, useContext} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {inOrder, moments} from '@pages/Record/moments/moments';
import {momentAddress} from './MomentLink';
import {doorId, fromTheRecord} from '@pages/Record/moments/doors';
import {CurrentDoor} from './DoorSection';

export const FromTheRecord: FC = () =>
  useContext(CurrentDoor).either(door => <section className="door-evidence" aria-labelledby={`${doorId(door)} ${doorId(door)}-record`}>
    <h3 className="sub-title" id={`${doorId(door)}-record`}>from the record</h3>
    <ol className="moments" aria-label={`${door}, from the record`}>
      {inOrder.filter(key => fromTheRecord[door].includes(key)).map(key =>
        <li key={key}>
          <Link className="moment-line paragraph signpost" to={momentAddress(key)}>
            <time className="moment-year caption bold" dateTime={moments[key].year}>{moments[key].year}</time> {moments[key].title}
          </Link>
        </li>)}
    </ol>
    <p className="caption"><Link className="signpost" to={Paths.record}>the whole record</Link></p>
  </section>, () => null);
