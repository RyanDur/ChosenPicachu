import type {Page} from '@playwright/test';

export type Look = Record<string, string>;

const frames = 10;

export const heldStill = async (page: Page): Promise<() => Promise<void>> => {
  await page.clock.setFixedTime(new Date('2026-01-01T12:00:00Z'));
  await page.addInitScript(() => {
    let state = 2026;
    Math.random = () => {
      state = state * 16807 % 2147483647;
      return (state - 1) / 2147483646;
    };
  });
  let sent = 0;
  let opened = false;
  await page.routeWebSocket(/ws-feed/, socket => {
    opened = true;
    const server = socket.connectToServer();
    server.onMessage(message => {
      if (sent < frames) {
        sent += 1;
        socket.send(message);
      }
    });
  });
  return async () => {
    const until = Date.now() + 8_000;
    while (opened && sent < frames && Date.now() < until) await page.waitForTimeout(100);
    await page.waitForLoadState('networkidle', {timeout: 10_000}).catch(() => undefined);
    await page.evaluate(async () => {
      await document.fonts.ready;
      // a lazy image below the fold never loads unless scrolled to, and Firefox leaves it waiting
      const loading = [...document.images].filter(image => !image.complete && image.loading !== 'lazy').map(image => new Promise(done => {
        image.addEventListener('load', done, {once: true});
        image.addEventListener('error', done, {once: true});
      }));
      await Promise.race([Promise.all(loading), new Promise(done => setTimeout(done, 5_000))]);
      await new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)));
    });
  };
};

const looks = [
  'display', 'visibility', 'opacity', 'color', 'background-color', 'background-image',
  'border-top-width', 'border-top-style', 'border-top-color', 'border-right-width', 'border-right-style', 'border-right-color',
  'border-bottom-width', 'border-bottom-style', 'border-bottom-color', 'border-left-width', 'border-left-style', 'border-left-color',
  'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius',
  'outline-style', 'outline-width', 'outline-color', 'outline-offset', 'box-shadow',
  'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'text-transform', 'text-decoration-line',
  'fill', 'stroke', 'stroke-width', 'transform', 'cursor'
];

export const lookOf = (page: Page): Promise<Look> => page.evaluate(properties => {
  const look: Record<string, string> = {};
  const keyOf = (element: Element): string => {
    const steps: string[] = [];
    for (let at: Element | null = element; at !== null && at !== document.documentElement; at = at.parentElement) {
      const parent: Element | null = at.parentElement;
      const sameTag = parent === null ? [at] : [...parent.children].filter(sibling => sibling.tagName === at?.tagName);
      steps.unshift(`${at.tagName.toLowerCase()}${at.id === '' ? '' : `#${at.id}`}${sameTag.length > 1 ? `[${sameTag.indexOf(at)}]` : ''}`);
      if (at.id !== '') break;
    }
    return steps.join('>');
  };
  const record = (key: string, style: CSSStyleDeclaration) => {
    for (const property of properties) look[`${key} ${property}`] = style.getPropertyValue(property);
  };
  for (const element of document.body.querySelectorAll('*')) {
    const key = keyOf(element);
    const style = getComputedStyle(element);
    record(key, style);
    const {x, y, width, height} = element.getBoundingClientRect();
    look[`${key} box`] = [x, y, width, height].map(n => Math.round(n * 2) / 2).join(',');
    for (const pseudo of ['::before', '::after']) {
      const part = getComputedStyle(element, pseudo);
      if (part.content !== 'none' && part.content !== 'normal') record(`${key}${pseudo}`, part);
    }
    if (element instanceof HTMLDialogElement && element.open) record(`${key}::backdrop`, getComputedStyle(element, '::backdrop'));
  }
  return look;
}, looks);

export const differences = (before: Look, after: Look): string[] => {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...keys].filter(key => before[key] !== after[key])
    .map(key => `${key}: ${before[key] ?? '(absent)'} → ${after[key] ?? '(absent)'}`);
};
