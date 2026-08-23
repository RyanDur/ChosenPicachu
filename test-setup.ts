import './src/test-support/env';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';
import {afterAll, afterEach, beforeAll, expect} from 'vitest';
import 'vitest-location-mock';
import {server} from './src/test-support/server';

beforeAll(() => server.listen({onUnhandledRequest: 'error'}));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

expect.extend(matchers);

// jsdom lacks these platform pieces; the suite supplies inert ones
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
