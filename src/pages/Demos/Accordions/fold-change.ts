export type Opened = {readonly type: 'opened'; readonly fold: string};
export type Closed = {readonly type: 'closed'; readonly fold: string};
export type AllClosed = {readonly type: 'allClosed'};

export const foldChange = {
  opened: (fold: string): Opened => ({type: 'opened', fold}),
  closed: (fold: string): Closed => ({type: 'closed', fold}),
  allClosed: (): AllClosed => ({type: 'allClosed'})
};
