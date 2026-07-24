import * as D from 'schemawax';

export enum AboutTopics {
  accordions= 'accordions',
  zIndex = 'z-index',
  dragAndDrop = 'dragAndDrop',
}

export const aboutTopicParam: D.Decoder<AboutTopics> = D.literalUnion(...Object.values(AboutTopics));
export type PropsWithClassName = { className?: string };