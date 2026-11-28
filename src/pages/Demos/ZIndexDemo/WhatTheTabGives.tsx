import {FC} from 'react';
import {TabLink} from '@pages/Demos/TabLink';
import {DemoTopics} from '@pages/Demos';
import {DemoLink} from '@pages/Demos/DemoLink';
import {accordionParts} from '@pages/Demos/Accordions/part-pages';
import {PartLink} from './PartLink';
import {zIndexParts} from './part-pages';

const popoverPart = zIndexParts.told('why-the-popover-wins').ordinal;

export const WhatTheTabGives: FC = () =>
  <section className="tab-introduction">
    <p className="paragraph">By the end you can say why the browser draws one box over another, why 9999 can still
      lose, and how a popover gets over everything on the page.</p>
    <p className="paragraph">This tab assumes what the <TabLink to={DemoTopics.accordions}>accordions
      tab</TabLink> gives: an element, an
      attribute, <DemoLink to={accordionParts.addressOf('a-box-remembers-the-fold')}>a class</DemoLink>, a dial
      and <DemoLink to={accordionParts.addressOf('the-measured-height')}>a custom property</DemoLink>.</p>
    <p className="paragraph">Later tabs build on part {popoverPart}, <PartLink part="why-the-popover-wins"/>: React, a
      component, its state, an event, a popover, and this site’s Menu component. The charts and tables tabs use all
      of these, and the drag sort tab uses all but the menu.</p>
  </section>;
