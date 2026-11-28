import {FC} from 'react';
import {DemoTopics} from '@pages/Demos';
import {DemoLink} from '@pages/Demos/DemoLink';
import {TabLink} from '@pages/Demos/TabLink';
import {accordionParts} from './part-pages';
import {tabHeadings} from './tab-headings';

const remembersTheFold = 'a-box-remembers-the-fold';
const remembersTheFoldTitle = accordionParts.told(remembersTheFold).name;
const remembersTheFoldAt = accordionParts.addressOf(remembersTheFold);

export const ClassGloss: FC = () => <>
  A class is a name a style
  sheet’s <TabLink to={DemoTopics.accordions} heading={tabHeadings.exhibitSource}>rules</TabLink> pick out, as taught
  in the accordions part <DemoLink to={remembersTheFoldAt}><cite>{remembersTheFoldTitle}</cite></DemoLink>.
</>;
