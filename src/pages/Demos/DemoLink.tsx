import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {classNames, PropsWithClassName} from '@components';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';

type Props = PropsWithClassName<PropsWithChildren<{to: string; heading?: string}>>;

export const DemoLink: FC<Props> = ({to, heading, className, children}) =>
  <Link className={classNames(className, 'signpost')} to={useCarriedAddress()(to, heading)}>{children}</Link>;
