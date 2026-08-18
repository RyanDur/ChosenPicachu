import {Browser, Locator, Page, expect} from '@playwright/test';
import {execFile} from 'node:child_process';
import {mkdir, readdir, rm} from 'node:fs/promises';
import {homedir} from 'node:os';
import {dirname, join} from 'node:path';
import {promisify} from 'node:util';

const run = promisify(execFile);

// playwright ships its own ffmpeg; the reels are cropped to the table with it
const ffmpegIn = async (cache: string): Promise<string | undefined> => {
  const entries = await readdir(cache, {withFileTypes: true}).catch(() => []);
  const home = entries.find(entry => entry.isDirectory() && entry.name.startsWith('ffmpeg-'));
  if (home === undefined) {
    return undefined;
  }
  const binaries = await readdir(join(cache, home.name));
  const binary = binaries.find(name => name.startsWith('ffmpeg'));
  return binary === undefined ? undefined : join(cache, home.name, binary);
};

const ffmpegPath = async (): Promise<string> => {
  const caches = [join(homedir(), 'Library/Caches/ms-playwright'), join(homedir(), '.cache/ms-playwright')];
  for (const cache of caches) {
    const found = await ffmpegIn(cache);
    if (found !== undefined) {
      return found;
    }
  }
  throw new Error('playwright\'s ffmpeg is not installed; run npx playwright install');
};

export const mediaRoot = 'src/pages/Demos/Tables/media';

export const reelFrame = {width: 1000, height: 760};

// the reels need a visible pointer: playwright's video does not record the cursor,
// so a synthetic one rides the real events the test dispatches
const syntheticCursor = () => {
  const cursor = document.createElement('div');
  cursor.className = 'capture-cursor';
  cursor.style.cssText = [
    'position: fixed', 'left: 0', 'top: 0', 'width: 18px', 'height: 18px',
    'border-radius: 50%', 'background: rgba(35, 35, 35, 0.72)',
    'border: 2px solid white', 'box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45)',
    'pointer-events: none', 'z-index: 2147483647',
    'transform: translate(-50%, -50%)', 'transition: width 90ms, height 90ms, background 90ms'
  ].join(';');
  document.addEventListener('DOMContentLoaded', () => document.body.append(cursor));
  document.addEventListener('pointermove', event => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  }, true);
  document.addEventListener('pointerdown', () => {
    cursor.style.width = '14px';
    cursor.style.height = '14px';
    cursor.style.background = 'rgba(38, 105, 75, 0.9)';
  }, true);
  document.addEventListener('pointerup', () => {
    cursor.style.width = '18px';
    cursor.style.height = '18px';
    cursor.style.background = 'rgba(35, 35, 35, 0.72)';
  }, true);
};

// the keyboard reel has no hand to watch: each keydown flashes its key on screen
const keypressOverlay = () => {
  const chip = document.createElement('div');
  chip.className = 'capture-keypress';
  chip.style.cssText = [
    'position: fixed', 'bottom: 18px', 'left: 50%', 'transform: translateX(-50%)',
    'padding: 6px 14px', 'border-radius: 8px', 'background: rgba(35, 35, 35, 0.85)',
    'color: white', 'font: 600 15px monospace', 'pointer-events: none',
    'z-index: 2147483647', 'opacity: 0', 'transition: opacity 120ms'
  ].join(';');
  document.addEventListener('DOMContentLoaded', () => document.body.append(chip));
  const names: Record<string, string> = {
    ArrowRight: '→', ArrowLeft: '←', ArrowUp: '↑', ArrowDown: '↓', Tab: 'Tab'
  };
  let fade = 0;
  document.addEventListener('keydown', event => {
    const name = names[event.key];
    if (name === undefined) {
      return;
    }
    chip.textContent = name;
    chip.style.opacity = '1';
    window.clearTimeout(fade);
    fade = window.setTimeout(() => {
      chip.style.opacity = '0';
    }, 600);
  }, true);
};

type Box = {x: number; y: number; width: number; height: number};

type Staged = {
  page: Page;
  finish: (path: string, frame: Box) => Promise<void>;
};

const contextFor = async (browser: Browser, record: boolean, keys: boolean) => {
  const context = await browser.newContext(record
    ? {recordVideo: {dir: 'test-results/media-raw', size: reelFrame}, viewport: reelFrame}
    : {viewport: reelFrame});
  await context.addInitScript(syntheticCursor);
  if (keys) {
    await context.addInitScript(keypressOverlay);
  }
  return context;
};

export const recording = async (browser: Browser, url: string, keys = false): Promise<Staged> => {
  const context = await contextFor(browser, true, keys);
  const page = await context.newPage();
  await page.goto(url);
  return {
    page,
    finish: async (path, frame) => {
      const video = page.video();
      await context.close();
      if (video === null) {
        throw new Error('no video was recorded');
      }
      await mkdir(dirname(path), {recursive: true});
      const raw = `${path}.raw.webm`;
      await video.saveAs(raw);
      const crop = `crop=${frame.width}:${frame.height}:${frame.x}:${frame.y}`;
      await run(await ffmpegPath(), ['-y', '-loglevel', 'error', '-i', raw,
        '-vf', crop, '-c:v', 'libvpx', '-b:v', '1M', path]);
      await rm(raw);
    }
  };
};

export const staged = async (browser: Browser, url: string): Promise<Page> => {
  const context = await contextFor(browser, false, false);
  const page = await context.newPage();
  await page.goto(url);
  return page;
};

export const livingCard = async (page: Page): Promise<Locator> => {
  const card = page.getByRole('region', {name: 'live aggregations'});
  await expect(card.getByRole('columnheader', {name: /trades/}).first()).toBeVisible();
  await expect(card.locator('tbody')).toContainText('$', {timeout: 30_000});
  await card.evaluate(element => {
    window.scrollTo({top: element.getBoundingClientRect().top + window.scrollY - 16});
  });
  await page.waitForTimeout(400);
  return card;
};

const boxOf = async (target: Locator) => {
  const box = await target.boundingBox();
  if (box === null) {
    throw new Error('the element never stood');
  }
  return box;
};

// everything frames the table alone: the reels crop to this box, and the
// posters and stills shoot the same one, so every face of a story matches
export const tableFrame = async (card: Locator): Promise<Box> => {
  const box = await boxOf(card.locator('table').first());
  const pad = 6;
  const width = Math.floor((box.width + pad * 2) / 2) * 2;
  const height = Math.floor((box.height + pad * 2) / 2) * 2;
  return {x: Math.max(0, Math.round(box.x - pad)), y: Math.max(0, Math.round(box.y - pad)), width, height};
};

export const shot = async (page: Page, frame: Box, path: string): Promise<void> => {
  await mkdir(dirname(path), {recursive: true});
  await page.screenshot({path, clip: frame});
};

// the keypress chip is born at the viewport's foot; the crop needs it on the table
export const chipInto = (page: Page, frame: Box): Promise<void> =>
  page.evaluate(({frame}) => {
    const chip = document.querySelector('.capture-keypress');
    if (chip instanceof HTMLElement) {
      chip.style.bottom = 'auto';
      chip.style.top = `${frame.y + frame.height - 54}px`;
      chip.style.left = `${frame.x + frame.width / 2}px`;
    }
  }, {frame});

// callouts are baked into the frame here, during capture: only the test knows
// where the ghost stands at this instant
export const callout = (page: Page, box: Box, label: string, inside = false): Promise<void> =>
  page.evaluate(({box, label, inside}) => {
    const outline = document.createElement('div');
    outline.className = 'capture-callout';
    outline.style.cssText = [
      'position: fixed', `left: ${box.x - 3}px`, `top: ${box.y - 3}px`,
      `width: ${box.width}px`, `height: ${box.height}px`,
      'border: 3px solid rgba(38, 105, 75, 0.95)', 'border-radius: 6px',
      'pointer-events: none', 'z-index: 2147483646'
    ].join(';');
    const chip = document.createElement('div');
    chip.className = 'capture-callout';
    chip.textContent = label;
    const chipTop = inside ? box.y + box.height - 34 : box.y + box.height + 6;
    chip.style.cssText = [
      'position: fixed', `left: ${box.x - 3}px`, `top: ${chipTop}px`,
      'padding: 3px 10px', 'border-radius: 6px',
      'background: rgba(38, 105, 75, 0.95)', 'color: white',
      'font: 600 13px system-ui, sans-serif', 'pointer-events: none',
      'z-index: 2147483646', 'white-space: nowrap'
    ].join(';');
    document.body.append(outline, chip);
  }, {box, label, inside});

export const calloutOn = async (target: Locator, label: string, inside = false): Promise<void> => {
  const box = await boxOf(target);
  await callout(target.page(), box, label, inside);
};

export const clearCallouts = (page: Page): Promise<void> =>
  page.evaluate(() => {
    [...document.querySelectorAll('.capture-callout')].forEach(node => node.remove());
  });

export const headerOrder = (card: Locator): Promise<string[]> =>
  card.locator('thead th').evaluateAll(headers =>
    headers.map(header => header.className.split(' ')[1]));

type Gait = {steps?: number; anchor?: number};

export const slowDrag = async (page: Page, from: Box, toX: number, gait: Gait = {}): Promise<void> => {
  const steps = gait.steps === undefined ? 30 : gait.steps;
  const anchor = gait.anchor === undefined ? 0.5 : gait.anchor;
  const start = {x: from.x + from.width * anchor, y: from.y + from.height / 2};
  for (let step = 1; step <= steps; step++) {
    await page.mouse.move(start.x + (toX - start.x) * (step / steps), start.y);
    await page.waitForTimeout(55);
  }
};

export const grabbed = async (page: Page, target: Locator, anchor = 0.5): Promise<Box> => {
  const box = await boxOf(target);
  await page.mouse.move(box.x + box.width * anchor, box.y + box.height / 2);
  await page.waitForTimeout(500);
  await page.mouse.down();
  await page.waitForTimeout(350);
  return box;
};

export const boxFor = boxOf;
