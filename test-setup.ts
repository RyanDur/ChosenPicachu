import './src/__test_support/env';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';
import {afterAll, afterEach, beforeAll, beforeEach, expect} from 'vitest';
import 'vitest-location-mock';
import {faker} from '@faker-js/faker';
import {seed} from '@components/fibs';
import {server, usersServed} from '@__test_support/server';
import {createRandomUsers} from '@backend/users/core';
import {subscribed} from '@__test_support/feed';

faker.seed(1978);
seed('the same draw every run');

beforeAll(() => server.listen({onUnhandledRequest: 'error'}));
beforeEach(() => usersServed(createRandomUsers()));
afterEach(() => {
  server.resetHandlers();
  subscribed.clear();
});
afterAll(() => server.close());

expect.extend(matchers);

// jsdom lacks these platform pieces; the suite supplies inert ones
// React picks the unprefixed animationend only when AnimationEvent exists at load
globalThis.AnimationEvent ??= class extends Event {
  readonly animationName = '';
  readonly elapsedTime = 0;
  readonly pseudoElement = '';
};
HTMLElement.prototype.setPointerCapture = () => undefined;
Element.prototype.getAnimations = () => [];
HTMLElement.prototype.showPopover = () => undefined;
Element.prototype.scrollIntoView = () => undefined;
window.scrollTo = () => undefined;
Element.prototype.scrollTo = () => undefined;
HTMLElement.prototype.hidePopover = () => undefined;
globalThis.ResizeObserver = class {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
};
