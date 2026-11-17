import {FC, PropsWithChildren} from 'react';
import {DemoLink} from '@pages/Demos/DemoLink';
import {accordionParts} from './part-pages';

export const RemembersTheFoldLink: FC<PropsWithChildren> = ({children}) =>
  <DemoLink to={accordionParts.addressOf('a-box-remembers-the-fold')}>{children}</DemoLink>;
