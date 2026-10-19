import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {Concern, concernId} from '@pages/Record/moments/concerns';
import {storyAddress} from '@pages/Record/MomentLink';
import {practiceAddress} from '@pages/Practice/types';

export const ConcernSection: FC<PropsWithChildren<{concern: Concern}>> = ({concern, children}) =>
  <section className="concern trim-rule-above" aria-labelledby={concernId(concern)}>
    <h2 className="concern-title title" id={concernId(concern)}>{concern}</h2>
    {children}
    <p className="paragraph"><Link className="signpost" to={storyAddress(concern)}>Its story is on the record.</Link></p>
    <p className="paragraph"><Link className="signpost" to={practiceAddress(concern)}>How I organize it is on Practice.</Link></p>
  </section>;
