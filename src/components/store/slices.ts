import {Reducer} from './reducers';

export type Slice<State, Action> = {
  readonly initial: State;
  readonly reduce: Reducer<State, Action>;
};

export type Slices<State, Action> = {
  readonly [Key in keyof State]-?: Slice<State[Key], Action>;
};

const keysOf = <State extends object, Action>(keyedSlices: Slices<State, Action>): readonly (keyof State)[] => {
  const keys: (keyof State)[] = [];
  for (const key in keyedSlices) {
    keys.push(key);
  }
  return keys;
};

// a fold over the keys has no State to start from; the seed is the one value the compiler is told about
const seed = <State>(): State => ({} as State);

const combined = <State extends object, Action>(keyedSlices: Slices<State, Action>): Slice<State, Action> => ({
  initial: keysOf(keyedSlices).reduce((state, key) => ({...state, [key]: keyedSlices[key].initial}), seed<State>()),
  reduce: (state, action) =>
    keysOf(keyedSlices).reduce((next, key) => ({...next, [key]: keyedSlices[key].reduce(state[key], action)}), state)
});

export const slices = {combined};
