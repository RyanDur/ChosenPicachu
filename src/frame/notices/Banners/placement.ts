export type Side = 'top' | 'middle' | 'bottom';
export type Align = 'left' | 'center' | 'right';
export type Entrance = 'above' | 'below' | 'left' | 'right';
export type Stack = 'down' | 'up' | 'left' | 'right';

export type Placement = {
  readonly side: Side;
  readonly align: Align;
  readonly enter: Entrance;
  readonly stack: Stack;
};

export const unplaced: Placement = {side: 'top', align: 'center', enter: 'above', stack: 'down'};
