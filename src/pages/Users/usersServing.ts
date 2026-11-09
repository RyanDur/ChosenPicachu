import {asyncResult, Maybe, maybe, nothing, some} from '@ryandur/sand';
import {usersServer} from './usersServer';

export type Workers = {
  readonly controller: object | null;
  readonly register: (script: string) => Promise<unknown>;
  readonly ready: Promise<{readonly active: {readonly postMessage: (message: string) => void} | null}>;
  readonly addEventListener: (type: 'controllerchange', listener: () => void, options: AddEventListenerOptions) => void;
};

export type Reaching = {
  readonly reached: () => void;
  readonly unreachable: () => void;
};

type UsersServing = {
  reach: (workers: Maybe<Workers>, reaching: Reaching) => () => void;
};

const patience = 10_000;
const script = `${import.meta.env.BASE_URL}${usersServer.script}`;
const unwatched = (): void => undefined;

const askedToClaim = (workers: Workers): void => {
  asyncResult(workers.ready).onSuccess(({active}) => active?.postMessage(usersServer.loadedUncontrolled));
};

const watchedForControl = (workers: Workers, {reached, unreachable}: Reaching): () => void => {
  const watch = new AbortController();
  const reported = new AbortController();
  const unreachableOnce = (): void => {
    if (reported.signal.aborted) return;
    reported.abort();
    unreachable();
  };
  const waiting = setTimeout(unreachableOnce, patience);
  const stopWatching = (): void => {
    clearTimeout(waiting);
    watch.abort();
  };
  const ended = (outcome: () => void) => (): void => {
    if (watch.signal.aborted) return;
    stopWatching();
    outcome();
  };
  workers.addEventListener('controllerchange', ended(reached), {signal: watch.signal});
  asyncResult(workers.register(script))
    .onSuccess(() => maybe(workers.controller).either(ended(reached), () => askedToClaim(workers)))
    .onFailure(ended(unreachableOnce));
  return stopWatching;
};

const uncontrolled = (workers: Workers): Maybe<Workers> =>
  maybe(workers.controller).either(nothing, () => some(workers));

const reachedAtOnce = ({reached}: Reaching): () => void => {
  reached();
  return unwatched;
};

export const usersServing: UsersServing = {
  reach: (workers, reaching) => workers
    .mBind(uncontrolled)
    .either(container => watchedForControl(container, reaching), () => reachedAtOnce(reaching))
};
