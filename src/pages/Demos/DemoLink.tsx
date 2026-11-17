import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';

type Props = PropsWithChildren<{to: string; heading?: string; search?: Record<string, string>}>;

export const DemoLink: FC<Props> = ({to, heading, search, children}) =>
  <Link className="signpost" to={useCarriedAddress()(to, heading, search)}>{children}</Link>;
