import {FC, PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {DemoTopics, demoAddress} from '@pages/Demos/types';

export const TabLink: FC<PropsWithChildren<{to: DemoTopics}>> = ({to, children}) =>
  <Link className="signpost" to={demoAddress(to)}>{children}</Link>;
