import {createContext, FC, PropsWithChildren} from 'react';
import {Maybe, nothing, some} from '@ryandur/sand';
import {Concern, concernId} from '@pages/Record/moments/concerns';

const noConcernSectionMounted: Maybe<Concern> = nothing();

export const CurrentConcern = createContext<Maybe<Concern>>(noConcernSectionMounted);

export const ConcernSection: FC<PropsWithChildren<{concern: Concern}>> = ({concern, children}) =>
  <section className="concern trim-rule-above" aria-labelledby={concernId(concern)}>
    <h2 className="concern-title title" id={concernId(concern)}>{concern}</h2>
    <CurrentConcern.Provider value={some(concern)}>{children}</CurrentConcern.Provider>
  </section>;
