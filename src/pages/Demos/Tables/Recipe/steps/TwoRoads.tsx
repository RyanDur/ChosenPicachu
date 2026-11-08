import {TabLink} from '@pages/Demos/TabLink';
import {FC} from 'react';
import {DemoTopics} from '../../../demo-topics';
import {Mdn, Tell} from '../../../Recipe';

export const TwoRoads: FC = () =>
  <Tell>There are two ways to drag something across a page, and I built both.
    The <TabLink to={DemoTopics.dragAndDrop}>Drag sort list demo</TabLink> uses
    the native API, where the platform brings most of the behavior for very little code;
    its edges (the snapshot that cannot be animated, the cursor that belongs to the
    platform, the macOS cancel) are that demo’s own story. This table uses <Mdn path="Web/API/Pointer_events">pointer
      events</Mdn>, which leave every pixel of the drag
    to the code, and no drag-and-drop library is anywhere in the build.</Tell>;
