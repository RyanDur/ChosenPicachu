import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';
import {afterAll, afterEach, beforeAll, expect} from 'vitest';
import 'vitest-location-mock';
import {server} from './src/test-support/server';

beforeAll(() => server.listen({onUnhandledRequest: 'error'}));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

expect.extend(matchers);
