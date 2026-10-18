import {FC, PropsWithChildren, useContext} from 'react';
import {concernId} from '@pages/Record/moments/concerns';
import {CurrentConcern} from './ConcernSection';

export const HowIOrganizeIt: FC<PropsWithChildren> = ({children}) =>
  useContext(CurrentConcern).either(concern => <section className="concern-practice" aria-labelledby={`${concernId(concern)} ${concernId(concern)}-practice`}>
    <h3 className="sub-title" id={`${concernId(concern)}-practice`}>how I organize it</h3>
    {children}
  </section>, () => null);
