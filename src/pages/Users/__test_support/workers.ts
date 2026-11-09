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

const forThisTest = (descriptor?: PropertyDescriptor): void => {
  const standing = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker');
  Reflect.deleteProperty(navigator, 'serviceWorker');
  if (descriptor) Object.defineProperty(navigator, 'serviceWorker', descriptor);
  onTestFinished(() => {
    Reflect.deleteProperty(navigator, 'serviceWorker');
    if (standing) Object.defineProperty(navigator, 'serviceWorker', standing);
  });
};

export const lentToThePage = ({workers}: WatchedWorkers): void =>
  forThisTest({configurable: true, value: workers});

export const noWorkersOnThePage = (): void => forThisTest();
