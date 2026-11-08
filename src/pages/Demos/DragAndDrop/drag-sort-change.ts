type Lifted = {readonly type: 'lifted'; readonly item: string};
type Released = {readonly type: 'released'};
type Crossed = {readonly type: 'crossed'; readonly at: number; readonly homeward: boolean};
type Hovered = {readonly type: 'hovered'; readonly at: number};
type Left = {readonly type: 'left'};
type Stepped = {readonly type: 'stepped'; readonly item: string; readonly step: 1 | -1};
type Slid = {readonly type: 'slid'; readonly item: string};
type Gripped = {readonly type: 'gripped'; readonly item: string};
type LetGo = {readonly type: 'letGo'};

export type DragSortChange = Lifted | Released | Crossed | Hovered | Left | Stepped | Slid | Gripped | LetGo;

export const dragSortChange = {
  lifted: (item: string): Lifted => ({type: 'lifted', item}),
  released: (): Released => ({type: 'released'}),
  crossed: (at: number, homeward: boolean): Crossed => ({type: 'crossed', at, homeward}),
  hovered: (at: number): Hovered => ({type: 'hovered', at}),
  left: (): Left => ({type: 'left'}),
  stepped: (item: string, step: 1 | -1): Stepped => ({type: 'stepped', item, step}),
  slid: (item: string): Slid => ({type: 'slid', item}),
  gripped: (item: string): Gripped => ({type: 'gripped', item}),
  letGo: (): LetGo => ({type: 'letGo'})
};
