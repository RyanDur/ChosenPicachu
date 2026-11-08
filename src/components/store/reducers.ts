export type Reducer<State, Action> = (state: State, action: Action) => State;

const combined = <State, Action>(...reducersInOrder: Reducer<State, Action>[]): Reducer<State, Action> =>
  (state, action) => reducersInOrder.reduce((reduced, reducer) => reducer(reduced, action), state);

export const reducers = {combined};
