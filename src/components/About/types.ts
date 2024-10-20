export enum AboutTopics {
  accordions= 'accordions',
  zIndex = 'z-index',
  dragAndDrop = 'dragAndDrop',
}

export const isATopic = (value: unknown): value is AboutTopics =>
  Object.values<unknown>(AboutTopics).includes(value);
