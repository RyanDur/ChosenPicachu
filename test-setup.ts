import './src/__test_support/env';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';
import {afterAll, afterEach, beforeAll, beforeEach, expect, vi} from 'vitest';
import 'vitest-location-mock';
import {faker} from '@faker-js/faker';
import {seed} from '@components/fibs';
import {server} from '@__test_support/server';

faker.seed(1978);
seed('the same draw every run');

beforeAll(() => server.listen({onUnhandledRequest: 'error'}));
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

// vitest hides a passing test's stderr, so a test that writes to console.error fails here instead
beforeEach(() => {
  const errorsWritten = vi.spyOn(console, 'error');
  return () => {
    const written = errorsWritten.mock.calls.length;
    errorsWritten.mockRestore();
    if (written) throw new Error('the test wrote to console.error; its stderr shows what');
  };
});

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
Document.prototype.getAnimations = () => [];
HTMLElement.prototype.showPopover = () => undefined;
Element.prototype.scrollIntoView = () => undefined;
window.scrollTo = () => undefined;
Element.prototype.scrollTo = () => undefined;
HTMLElement.prototype.hidePopover = () => undefined;
// jsdom has no service worker container, so every page gets one its worker already controls
Object.defineProperty(navigator, 'serviceWorker', {configurable: true, value: {controller: {}}});
globalThis.ResizeObserver = class {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
};
