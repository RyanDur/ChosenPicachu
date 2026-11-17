import {FC, PropsWithChildren} from 'react';
import {DemoTopics} from '@pages/Demos/demo-topics';
import {demoTab} from '@pages/Demos/demo-tab';
import {DemoLink} from '@pages/Demos/DemoLink';

type Props = PropsWithChildren<{to: DemoTopics; heading?: string}>;

export const TabLink: FC<Props> = ({to, heading, children}) =>
  <DemoLink to={demoTab.address(to)} heading={heading}>{children}</DemoLink>;
