import {FC, PropsWithChildren} from 'react';
import {DemoLink} from '@pages/Demos/DemoLink';
import {ZIndexPart, zIndexParts} from './part-pages';

export const PartTermLink: FC<PropsWithChildren<{part: ZIndexPart}>> = ({part, children}) =>
  <DemoLink to={zIndexParts.addressOf(part)}>{children}</DemoLink>;
