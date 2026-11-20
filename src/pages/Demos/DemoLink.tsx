import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {not} from '@ryandur/sand';
import {classNames, PropsWithClassName} from '@components';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';

type Props = PropsWithClassName<PropsWithChildren<{to: string; heading?: string; 'aria-current'?: 'page'}>>;

export const DemoLink: FC<Props> = ({to, heading, 'aria-current': ariaCurrent, className, children}) =>
  <Link className={classNames(className, not(ariaCurrent) && 'signpost')} to={useCarriedAddress()(to, heading)}
    aria-current={ariaCurrent}>{children}</Link>;
