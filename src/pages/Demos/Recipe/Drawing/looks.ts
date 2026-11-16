export type Kind = 'piece' | 'native' | 'unseen' | 'clipped' | 'clip' | 'ring' | 'unseen-ring' | 'topmost';

type Looks = {
  worn: (kind: Kind) => string;
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
  worn: kind => `${kind} ${looksOf[kind]}`
};
