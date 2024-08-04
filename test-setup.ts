import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';
import {expect, vi} from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import 'vitest-fetch-mock';

const fetchMocker = createFetchMock(vi);

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMocker.enableMocks();
expect.extend(matchers);
