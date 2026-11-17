import {writeFile} from 'node:fs/promises';
import {test as journey} from './journey';

// #446: CI saw the z-index page lose a followed link's fragment twice (43974457481, 43985257596), and no one has found
// what wrote `?news=top` without it. A failing run's report names each writer; this goes with the fix.
const recordEachWrite = (): void => {
  // Chromium keeps 10 frames, which can stop inside React's event handling before the code that asked for the write
  Error.stackTraceLimit = 50;
  const record: unknown = Reflect.get(globalThis, 'recordHistoryWrite');
  for (const method of ['pushState', 'replaceState'] as const) {
    const write = history[method].bind(history);
    history[method] = (data, unused, url) => {
      if (typeof record === 'function') record({method, url: String(url ?? location.href), stack: new Error().stack});
      write(data, unused, url);
    };
  }
};

export const test = journey.extend<{historyWrites: void}>({
  historyWrites: [async ({page}, use, testInfo) => {
    const writes: unknown[] = [];
    await page.exposeFunction('recordHistoryWrite', (write: unknown) => writes.push(write));
    await page.addInitScript(recordEachWrite);
    await use();
    if (testInfo.status !== testInfo.expectedStatus) {
      const path = testInfo.outputPath('history-writes.json');
      await writeFile(path, JSON.stringify(writes, null, 2));
      await testInfo.attach('history writes', {path, contentType: 'application/json'});
    }
  }, {auto: true}]
});
