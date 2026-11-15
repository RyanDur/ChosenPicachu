import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {useSearchParamsObject} from '@navigation/search-params';
import {DemoTopics} from '@pages/Demos/demo-topics';
import {demoTab} from '@pages/Demos/demo-tab';

export const TabLink: FC<PropsWithChildren<{to: DemoTopics}>> = ({to, children}) => {
  const {searchFromShown} = useSearchParamsObject({});
  return <Link className="signpost" to={`${demoTab.address(to)}${searchFromShown({})}`}>{children}</Link>;
};
