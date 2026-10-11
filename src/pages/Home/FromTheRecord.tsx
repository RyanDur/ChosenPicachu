import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {MomentKey, moments} from '@pages/Record/moments/moments';

export const FromTheRecord: FC<{language: string; keys: readonly MomentKey[]}> = ({language, keys}) => <>
  <p className="caption muted-ink">from the record</p>
  <ol className="moments" aria-label={`${language}, from the record`}>
    {keys.map(key => moments[key]).map(({year, title, id}) =>
      <li key={id}>
        <Link className="moment-line paragraph signpost" to={`${Paths.record}#${id}`}>
          <time className="moment-year caption bold" dateTime={year}>{year}</time> {title}
        </Link>
      </li>)}
  </ol>
  <p className="caption"><Link className="signpost" to={Paths.record}>the whole record</Link></p>
</>;
