export type Kind = 'piece' | 'native' | 'unseen' | 'clipped' | 'clip' | 'ring' | 'unseen-ring' | 'topmost';
export type At = {x: number; y: number};
export type Sized = At & {width: number; height: number};

type Looks = {
  of: (kind: Kind) => string;
};

const looksOf: Record<Kind, string> = {
  piece: 'paper-filled drawn',
  native: 'faded-mint-filled drawn',
  unseen: 'hollow drawn',
  clipped: 'hollow drawn',
  clip: 'hollow drawn',
  ring: 'approach-filled ring-drawn',
  'unseen-ring': 'approach-filled ring-drawn',
  topmost: 'paper-filled drawn'
};

export const looks: Looks = {
  of: kind => `${kind} ${looksOf[kind]}`
};
