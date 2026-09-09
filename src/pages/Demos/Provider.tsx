import {Dispatch, PropsWithChildren, ReactNode, createContext, useContext, useSyncExternalStore} from 'react';
import {DemosAction, DemosState, DemosStore, demosSlice} from './store';

type DemosContext = {
  state: DemosState;
  dispatch: Dispatch<DemosAction>;
};

const Demos = createContext<DemosContext>({state: demosSlice.initial, dispatch: () => undefined});

export const DemosProvider = ({store, children}: PropsWithChildren<{store: DemosStore}>): ReactNode => {
  const state = useSyncExternalStore(store.subscribe, () => store.state);

  return <Demos.Provider value={{state, dispatch: store.dispatch}}>
    {children}
  </Demos.Provider>;
};

export const useDemosSelector = <Slice,>(select: (state: DemosState) => Slice): Slice => select(useContext(Demos).state);

export const useDemosDispatch = (): Dispatch<DemosAction> => useContext(Demos).dispatch;
