import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {maybe} from '@ryandur/sand';
import {useSearchParamsObject} from '@navigation/search-params';

type Props = PropsWithChildren<{to: string; heading?: string}>;

export const DemoLink: FC<Props> = ({to, heading, children}) => {
  const {searchFromShown} = useSearchParamsObject({});
  const fragment = maybe(heading).map(id => `#${id}`).orElse('');
  return <Link className="signpost" to={`${to}${searchFromShown({})}${fragment}`}>{children}</Link>;
};
