import * as D from 'schemawax';

export enum DemoTopics {
  accordions= 'accordions',
  zIndex = 'z-index',
  dragAndDrop = 'dragAndDrop',
  charts = 'charts',
  tables = 'tables',
}

export const demoTopicParam: D.Decoder<DemoTopics> = D.literalUnion(...Object.values(DemoTopics));
export type PropsWithClassName = { className?: string };