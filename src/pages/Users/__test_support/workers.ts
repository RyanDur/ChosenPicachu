import {Environment, Workers} from '@transport';

export type WatchedWorkers = {
  readonly workers: Workers;
  readonly takeControl: () => void;
  readonly posted: () => readonly string[];
  readonly registered: () => number;
  readonly controlled: () => boolean;
};

type Container = {
  readonly controlled?: boolean;
  readonly registering?: Promise<unknown>;
};

export const workersContainer = (
  {controlled = false, registering = Promise.resolve({})}: Container = {}
): WatchedWorkers => {
  const events = new EventTarget();
  const posted: string[] = [];
  let registered = 0;
  let inControl = controlled;
  const workers = {
    controller: inControl ? {} : null,
    register: () => {
      registered += 1;
      return registering;
    },
    ready: Promise.resolve({active: {postMessage: (message: string) => posted.push(message)}}),
    addEventListener: events.addEventListener.bind(events)
  };
  return {
    workers,
    takeControl: () => {
      inControl = true;
      workers.controller = {};
      setTimeout(() => events.dispatchEvent(new Event('controllerchange')));
    },
    posted: () => posted,
    registered: () => registered,
    controlled: () => inControl
  };
};

type LentLater = {
  readonly environment: Partial<Environment>;
  readonly lend: (watched: WatchedWorkers) => void;
};

export const lentToThePage = ({workers}: WatchedWorkers): Partial<Environment> => ({workers});

export const noWorkersOnThePage: Partial<Environment> = {workers: undefined};

export const lentLater = (): LentLater => {
  let lent: Workers | undefined;
  return {
    environment: {
      get workers() {
        return lent;
      }
    },
    lend: ({workers}) => {
      lent = workers;
    }
  };
};
