type Armed = {readonly type: 'armed'; readonly at: number};
type Disarmed = {readonly type: 'disarmed'};
type Lifted = {readonly type: 'lifted'; readonly at: number; readonly pointer: number};
type Swapped = {readonly type: 'swapped'; readonly held: number; readonly to: number; readonly pointer: number};
type Released = {readonly type: 'released'};
type Settled = {readonly type: 'settled'};

export type ChartTravelChange = Armed | Disarmed | Lifted | Swapped | Released | Settled;

export const chartTravelChange = {
  armed: (at: number): Armed => ({type: 'armed', at}),
  disarmed: (): Disarmed => ({type: 'disarmed'}),
  lifted: (at: number, pointer: number): Lifted => ({type: 'lifted', at, pointer}),
  swapped: (held: number, to: number, pointer: number): Swapped => ({type: 'swapped', held, to, pointer}),
  released: (): Released => ({type: 'released'}),
  settled: (): Settled => ({type: 'settled'})
};
