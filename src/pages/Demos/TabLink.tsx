import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {maybe} from '@ryandur/sand';
import {useSearchParamsObject} from '@navigation/search-params';
import {DemoTopics} from '@pages/Demos/demo-topics';
import {demoTab} from '@pages/Demos/demo-tab';

type Props = PropsWithChildren<{to: DemoTopics; at?: string}>;

export const TabLink: FC<Props> = ({to, at, children}) => {
  const {searchFromShown} = useSearchParamsObject({});
  const fragment = maybe(at).map(id => `#${id}`).orElse('');
  return <Link className="signpost" to={`${demoTab.address(to)}${searchFromShown({})}${fragment}`}>{children}</Link>;
};
