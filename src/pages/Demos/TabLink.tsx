import {FC, PropsWithChildren} from 'react';
import {DemoTopics} from '@pages/Demos/demo-topics';
import {demoTab} from '@pages/Demos/demo-tab';
import {DemoLink} from '@pages/Demos/DemoLink';

type Props = PropsWithChildren<{to: DemoTopics; heading?: string; rel?: string; className?: string}>;

export const TabLink: FC<Props> = ({to, ...link}) => <DemoLink to={demoTab.address(to)} {...link}/>;
