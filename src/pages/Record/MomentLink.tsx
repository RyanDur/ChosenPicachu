import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {MomentKey} from './calendar';
import {recordAddress} from './addresses';

export const MomentLink: FC<PropsWithChildren<{to: MomentKey}>> = ({to, children}) =>
  <Link className="signpost" to={recordAddress.ofMoment(to)}>{children}</Link>;
