import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {MomentKey, inOrder, moments} from '@pages/Record/moments/moments';
import {momentAddress} from './MomentLink';
import {Door, doorId} from './door';

export const FromTheRecord: FC<{door: Door; keys: readonly MomentKey[]}> = ({door, keys}) =>
  <section className="door-evidence" aria-labelledby={`${doorId(door)} ${doorId(door)}-record`}>
    <h3 className="sub-title" id={`${doorId(door)}-record`}>from the record</h3>
    <ol className="moments" aria-label={`${door}, from the record`}>
      {inOrder.filter(key => keys.includes(key)).map(key =>
        <li key={key}>
          <Link className="moment-line paragraph signpost" to={momentAddress(key)}>
            <time className="moment-year caption bold" dateTime={moments[key].year}>{moments[key].year}</time> {moments[key].title}
          </Link>
        </li>)}
    </ol>
    <p className="caption"><Link className="signpost" to={Paths.record}>the whole record</Link></p>
  </section>;
