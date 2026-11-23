import {DemoTopics} from './demo-topics';
import {demoTab} from './demo-tab';
import type {Behind, Onward} from './PartFoot';

const behind = (topic: DemoTopics): Behind =>
  demoTab.previous(topic).map((previous): Behind => ({kind: 'tab', topic: previous})).orElse({kind: 'first-part'});

const onward = (topic: DemoTopics): Onward =>
  demoTab.next(topic).map((next): Onward => ({kind: 'tab', topic: next})).orElse({kind: 'last-part-said'});

type BookEnds = {
  behind: (topic: DemoTopics) => Behind;
  onward: (topic: DemoTopics) => Onward;
};

export const bookEnds: BookEnds = {behind, onward};
