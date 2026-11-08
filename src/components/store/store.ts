import {Slice} from './slices';

export type Listener<State, Action> =
  (previous: State, current: () => State, dispatch: (action: Action) => void, action: Action) => void;

export type Store<State, Action> = {
  readonly state: State;
  readonly dispatch: (action: Action) => void;
  readonly subscribe: (listener: Listener<State, Action>) => () => void;
};

export type Middleware<State, Action> =
  (api: Pick<Store<State, Action>, 'state' | 'dispatch'>) =>
  (next: Store<State, Action>['dispatch']) =>
  Store<State, Action>['dispatch'];

type Held<State, Action> = {
  readonly state: State;
  readonly listeners: readonly Listener<State, Action>[];
};

type Storing<State, Action> = {
  readonly slice: Slice<State, Action>;
  readonly middleware?: readonly Middleware<State, Action>[];
};

export const store = <State, Action>(
  {slice: {initial, reduce: reducer}, middleware = []}: Storing<State, Action>
): Store<State, Action> => {
  let held: Held<State, Action> = {state: initial, listeners: []};
  const current = (): State => held.state;
  const hold = (state: State, action: Action): void => {
    const previous = held.state;
    held = {...held, state};
    held.listeners.forEach(listener => listener(previous, current, top, action));
  };

  const api: Pick<Store<State, Action>, 'state' | 'dispatch'> = {
    get state() {
      return held.state;
    },
    dispatch: action => top(action)
  };
  const reduce = (action: Action): void => hold(reducer(held.state, action), action);
  const top = middleware.reduceRight((next, layer) => layer(api)(next), reduce);

  return Object.freeze({
    get state() {
      return held.state;
    },
    dispatch: top,
    subscribe: (listener: Listener<State, Action>) => {
      held = {...held, listeners: [...held.listeners, listener]};
      return () => {
        held = {...held, listeners: held.listeners.filter(heard => heard !== listener)};
      };
    }
  });
};
