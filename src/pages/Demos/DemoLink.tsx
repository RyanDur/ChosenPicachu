import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {maybe} from '@ryandur/sand';
import {classNames} from '@components';
import {useSearchParamsObject} from '@navigation/search-params';

type Props = PropsWithChildren<{to: string; heading?: string; rel?: string; className?: string}>;

export const DemoLink: FC<Props> = ({to, heading, rel, className, children}) => {
  const {searchFromShown} = useSearchParamsObject({});
  const fragment = maybe(heading).map(id => `#${id}`).orElse('');
  return <Link className={classNames(className, 'signpost')} rel={rel}
    to={`${to}${searchFromShown({})}${fragment}`}>{children}</Link>;
};
