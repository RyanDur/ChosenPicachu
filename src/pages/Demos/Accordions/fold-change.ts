export type Opened = {readonly type: 'opened'; readonly bar: string};
export type Closed = {readonly type: 'closed'; readonly bar: string};
export type AllClosed = {readonly type: 'allClosed'};

export const foldChange = {
  opened: (bar: string): Opened => ({type: 'opened', bar}),
  closed: (bar: string): Closed => ({type: 'closed', bar}),
  allClosed: (): AllClosed => ({type: 'allClosed'})
};
