import {FoldType} from '../Controls';

export type FoldInput = 'checkbox' | 'radio';

type FoldInputs = {
  of: (foldType: FoldType) => FoldInput;
};

const inputs: Record<FoldType, FoldInput> = {inclusive: 'checkbox', exclusive: 'radio'};

export const foldInput: FoldInputs = {
  of: foldType => inputs[foldType]
};
