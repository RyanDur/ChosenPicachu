import {onTestFinished} from 'vitest';
import {Workers} from '../usersServing';

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
      events.dispatchEvent(new Event('controllerchange'));
    },
    posted: () => posted,
    registered: () => registered,
    controlled: () => inControl
  };
};

// jsdom has no service workers, so a spec that needs the page's container lends navigator one until the test ends
export const lentToThePage = ({workers}: WatchedWorkers): void => {
  Object.defineProperty(navigator, 'serviceWorker', {configurable: true, value: workers});
  onTestFinished(() => {
    Reflect.deleteProperty(navigator, 'serviceWorker');
  });
};
