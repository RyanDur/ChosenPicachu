export enum AboutTopics {
  accordions= 'accordions',
  zIndex = 'z-index'
}

export const isATopic = (value: unknown): value is AboutTopics => {
  return Object.values<unknown>(AboutTopics).includes(value);
};
