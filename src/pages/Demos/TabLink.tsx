import {FC, PropsWithChildren} from 'react';
import {useLocation} from 'react-router';
import {not} from '@ryandur/sand';
import {DemoTopics} from '@pages/Demos/demo-topics';
import {demoTab} from '@pages/Demos/demo-tab';
import {DemoLink} from '@pages/Demos/DemoLink';

type Props = PropsWithChildren<{to: DemoTopics; heading?: string}>;

export const TabLink: FC<Props> = ({to, heading, children}) => {
  const address = demoTab.address(to);
  const onItsPage = useLocation().pathname === address && not(heading);
  return onItsPage ? children : <DemoLink to={address} heading={heading}>{children}</DemoLink>;
};
