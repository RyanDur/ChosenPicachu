import {FC, PropsWithChildren} from 'react';
import {Concern, concernId} from '@pages/Record/moments/concerns';

export const ConcernSection: FC<PropsWithChildren<{concern: Concern}>> = ({concern, children}) =>
  <section className="concern trim-rule-above" aria-labelledby={concernId(concern)}>
    <h2 className="concern-title title" id={concernId(concern)}>{concern}</h2>
    {children}
  </section>;
