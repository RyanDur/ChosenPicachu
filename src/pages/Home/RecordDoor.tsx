import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {inOrder, moments} from '@pages/Record/moments/moments';

export const RecordDoor: FC = () =>
  <section className="record-door trim-rule-above" aria-labelledby="the-record-door">
    <h2 className="door-title title" id="the-record-door">The record</h2>
    <p className="paragraph">
      How the web got the three languages: thirteen moments from 1989 on, each with its fuller story and its sources.
    </p>
    <ol className="moments" aria-label="the moments">
      {inOrder.map(key => moments[key]).map(({year, title, id}) =>
        <li key={id}>
          <Link className="moment-line paragraph signpost" to={`${Paths.record}#${id}`}>
            <time className="moment-year caption bold muted-ink" dateTime={year}>{year}</time> {title}
          </Link>
        </li>)}
    </ol>
    <p className="caption"><Link className="signpost" to={Paths.record}>read the record</Link></p>
  </section>;
