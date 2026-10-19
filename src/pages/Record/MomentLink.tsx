import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {MomentKey, moments} from '@pages/Record/moments/moments';
import {Concern, concernId} from '@pages/Record/moments/concerns';

export const momentAddress = (key: MomentKey): string => `${Paths.record}#${moments[key].id}`;

export const storyAddress = (concern: Concern): string => `${Paths.record}#${concernId(concern)}`;

export const MomentLink: FC<PropsWithChildren<{to: MomentKey}>> = ({to, children}) =>
  <Link className="signpost" to={momentAddress(to)}>{children}</Link>;
