import {FC} from 'react';
import {DemoLink} from '@pages/Demos/DemoLink';
import {ZIndexPart, zIndexParts} from './part-pages';

export const PartLink: FC<{part: ZIndexPart}> = ({part}) =>
  <DemoLink to={zIndexParts.addressOf(part)}><cite>{zIndexParts.told(part).name}</cite></DemoLink>;
