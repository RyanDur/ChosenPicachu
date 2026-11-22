export type Kind = 'piece' | 'native' | 'unseen' | 'clipped' | 'clip' | 'ring' | 'unseen-ring' | 'topmost';

type Looks = {
  worn: (kind: Kind) => string;
};

const looksOf: Record<Kind, string> = {
  piece: 'paper-filled drawn drawn-line',
  native: 'faded-mint-filled drawn drawn-line',
  unseen: 'hollow drawn drawn-line dashed-drawn',
  clipped: 'hollow drawn drawn-line dashed-drawn',
  clip: 'clip hollow drawn',
  ring: 'ring approach-filled ring-drawn',
  'unseen-ring': 'unseen-ring approach-filled ring-drawn',
  topmost: 'topmost paper-filled drawn'
};

export const looks: Looks = {
  worn: kind => looksOf[kind]
};
