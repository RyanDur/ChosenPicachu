import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {DemoTopics} from '@pages/Demos/demo-topics';
import {demoTab} from '@pages/Demos/demo-tab';

export const TabLink: FC<PropsWithChildren<{to: DemoTopics}>> = ({to, children}) =>
  <Link className="signpost" to={demoTab.address(to)}>{children}</Link>;
