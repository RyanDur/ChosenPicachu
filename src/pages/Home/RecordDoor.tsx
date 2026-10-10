import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';

export const RecordDoor: FC = () =>
  <section className="record-door door trim-rule-above" aria-labelledby="the-record-door">
    <h2 className="door-title title" id="the-record-door">The record</h2>
    <p className="paragraph">
      How the web got the three languages: thirteen moments from 1989 on, each with its fuller story and its sources.
    </p>
    <p className="caption"><Link className="signpost" to={Paths.record}>read the record</Link></p>
  </section>;
