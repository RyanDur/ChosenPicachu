import {FC, PropsWithChildren} from 'react';
import {DemoLink} from '@pages/Demos/DemoLink';
import {zIndexParts} from './part-pages';

export const WhyThirdIsOnTopLink: FC<PropsWithChildren> = ({children}) =>
  <DemoLink to={zIndexParts.addressOf('why-third-is-on-top')}>{children}</DemoLink>;
