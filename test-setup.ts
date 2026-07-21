import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';
import {afterAll, afterEach, beforeAll, expect} from 'vitest';
import 'vitest-location-mock';
import {server} from './src/__tests__/util/server';

beforeAll(() => server.listen({onUnhandledRequest: 'error'}));
server.events.on('request:start', ({request}) => console.error('REQ:', request.method, request.url));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

expect.extend(matchers);
