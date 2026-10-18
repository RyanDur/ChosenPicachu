import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {MomentKey, moments} from '@pages/Record/moments/moments';

export const momentAddress = (key: MomentKey): string => `${Paths.record}#${moments[key].id}`;

export const MomentLink: FC<PropsWithChildren<{to: MomentKey}>> = ({to, children}) =>
  <Link className="signpost" to={momentAddress(to)}>{children}</Link>;
