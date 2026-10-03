import type {Locator, Page} from '@playwright/test';

export type Build = 'the measured checkbox build' | 'the measured radio build' | 'the checkbox build' | 'the radio build' | 'the inclusive details build' | 'the details build' | 'the grid checkbox build' | 'the grid radio build';

export const builds: Build[] = ['the checkbox build', 'the radio build', 'the inclusive details build', 'the details build', 'the grid checkbox build', 'the grid radio build'];

export const measuredBuilds: Build[] = ['the measured checkbox build', 'the measured radio build'];

const headings: Record<Build, string> = {
  'the measured checkbox build': 'Accordion using checkboxes and a measured height',
  'the measured radio build': 'Accordion using a radio group and a measured height',
  'the checkbox build': 'Accordion using checkboxes and a known height',
  'the radio build': 'Accordion using a radio group and a known height',
  'the inclusive details build': 'Inclusive accordion using details elements',
  'the details build': 'Exclusive accordion using details elements',
  'the grid checkbox build': 'Inclusive accordion using checkboxes',
  'the grid radio build': 'Exclusive accordion using radio group'
};

export type Part = {
  fold: Locator;
  showsText: () => Promise<boolean>;
  open: () => Promise<void>;
  close: () => Promise<void>;
  openByKeyboard: () => Promise<void>;
  isOpen: () => Promise<boolean>;
};

export const nameOn = (fold: Locator): Locator => fold.getByText(/^\w+$/).first();

const focusAndPress = async (page: Page, control: Locator, key: string, times = 1): Promise<void> => {
  await control.focus();
  for (let press = 0; press < times; press += 1) {
    await page.keyboard.press(key);
  }
};

type Where = {page: Page; fold: Locator; article: Locator; index: number};

const textShownIn = (fold: Locator) => async (): Promise<boolean> => {
  const text = fold.getByRole('paragraph', {includeHidden: true});
  if (!await text.isVisible()) {
    return false;
  }
  await fold.scrollIntoViewIfNeeded();
  return text.evaluate(element => new Promise<boolean>(resolve => {
    const watch = new IntersectionObserver(([seen]) => {
      watch.disconnect();
      resolve(seen.intersectionRatio > 0);
    });
    watch.observe(element);
  }));
};

const detailsPart = (page: Page, fold: Locator): Omit<Part, 'showsText'> => ({
  fold,
  open: () => nameOn(fold).click(),
  close: () => nameOn(fold).click(),
  openByKeyboard: () => focusAndPress(page, nameOn(fold), 'Enter'),
  isOpen: () => fold.evaluate(details => details.hasAttribute('open'))
});

const checkboxPart = (page: Page, fold: Locator): Omit<Part, 'showsText'> => ({
  fold,
  open: () => nameOn(fold).click(),
  close: () => nameOn(fold).click(),
  openByKeyboard: () => focusAndPress(page, fold.getByRole('checkbox'), 'Space'),
  isOpen: () => fold.getByRole('checkbox').isChecked()
});

const radioPart = ({page, fold, article, index}: Where): Omit<Part, 'showsText'> => ({
  fold,
  open: () => nameOn(fold).click(),
  close: () => article.getByText('Close', {exact: true}).first().click(),
  openByKeyboard: () => focusAndPress(page, article.getByRole('radio', {name: 'Close', exact: true}), 'ArrowDown', index + 1),
  isOpen: () => fold.getByRole('radio').isChecked()
});

const partIn: Record<Build, (where: Where) => Omit<Part, 'showsText'>> = {
  'the measured checkbox build': ({page, fold}) => checkboxPart(page, fold),
  'the measured radio build': where => radioPart(where),
  'the checkbox build': ({page, fold}) => checkboxPart(page, fold),
  'the radio build': where => radioPart(where),
  'the inclusive details build': ({page, fold}) => detailsPart(page, fold),
  'the details build': ({page, fold}) => detailsPart(page, fold),
  'the grid checkbox build': ({page, fold}) => checkboxPart(page, fold),
  'the grid radio build': ({page, fold, article, index}) => ({
    fold,
    open: () => nameOn(fold).click(),
    close: () => nameOn(fold).click(),
    openByKeyboard: () => index === 0
      ? focusAndPress(page, fold.getByRole('radio'), 'Space')
      : focusAndPress(page, article.getByRole('radio').first(), 'ArrowDown', index),
    isOpen: () => fold.getByRole('radio').isChecked()
  })
};

const exclusiveBuilds: Build[] = ['the measured radio build', 'the radio build', 'the details build', 'the grid radio build'];

export const showing = (build: Build, style: 'reveal' | 'drawer' | 'static' = 'reveal'): string =>
  `demos/?tab=accordions&type=${exclusiveBuilds.includes(build) ? 'exclusive' : 'inclusive'}&style=${style}`;

const detailsBuilds: Build[] = ['the inclusive details build', 'the details build'];

const closeBarsBeforeTheParts = (build: Build): number => build === 'the radio build' || build === 'the measured radio build' ? 1 : 0;

export type Travel = {from: number; to: number};

export type Turn = {before: number; turned: number; end: number};

const pressedAtAQuarter = async (fold: Locator, first: Locator, second: Locator, travel: Travel): Promise<Turn> =>
  fold.evaluate((element, {firstPress, secondPress, from, to}) => new Promise<Turn>((resolve, reject) => {
    if (!(firstPress instanceof HTMLElement && secondPress instanceof HTMLElement)) {
      reject(new Error('a press is not an element that can be clicked'));
      return;
    }
    const height = (): number => element.getBoundingClientRect().height;
    const moving = (): boolean => element.getAnimations({subtree: true})
      .some(motion => motion instanceof CSSTransition && motion.transitionProperty === 'height');
    const passedAQuarter = (reached: number): boolean => to > from ? reached > from + (to - from) / 4 : reached < from - (from - to) / 4;
    const atEnd = (turn: Omit<Turn, 'end'>) => (): void => {
      if (moving()) {
        requestAnimationFrame(atEnd(turn));
      } else {
        resolve({...turn, end: height()});
      }
    };
    const watched = (): void => {
      const before = height();
      if (passedAQuarter(before)) {
        secondPress.click();
        requestAnimationFrame(atEnd({before, turned: height()}));
      } else if (moving()) {
        requestAnimationFrame(watched);
      } else {
        resolve({before, turned: before, end: before});
      }
    };
    firstPress.click();
    requestAnimationFrame(watched);
  }), {firstPress: await first.elementHandle(), secondPress: await second.elementHandle(), ...travel});

export const accordionsTab = (page: Page) => {
  const built = (build: Build): Locator =>
    page.getByRole('article').filter({has: page.getByRole('heading', {name: headings[build], exact: true})}).first();
  const folds = (build: Build): Locator =>
    detailsBuilds.includes(build) ? built(build).getByRole('group') : built(build).getByRole('listitem');
  const pressesOfTheFirstPart = (build: Build): {opens: Locator; shuts: Locator} => {
    const fold = folds(build).nth(closeBarsBeforeTheParts(build));
    const opens = fold.getByRole(exclusiveBuilds.includes(build) ? 'radio' : 'checkbox');
    return {opens, shuts: exclusiveBuilds.includes(build) ? built(build).getByRole('radio', {name: 'Close', exact: true}).first() : opens};
  };
  const partOf = (build: Build, index: number): Part => {
    const fold = folds(build).nth(index + closeBarsBeforeTheParts(build));
    return {...partIn[build]({page, fold, article: built(build), index}), showsText: textShownIn(fold)};
  };
  return {
    partOf,
    holdsFocus: (build: Build): Promise<boolean> => built(build).evaluate(article => article.contains(document.activeElement)),
    firstPartOf: (build: Build): Part => partOf(build, 0),
    closesThenOpensTheFirstPartInOneFrame: async (build: Build): Promise<void> => {
      const {opens, shuts} = pressesOfTheFirstPart(build);
      await shuts.evaluate((shut, open) => {
        if (!(shut instanceof HTMLElement && open instanceof HTMLElement)) {
          throw new Error('a press is not an element that can be clicked');
        }
        shut.click();
        open.click();
      }, await opens.elementHandle());
    },
    pressesTheFirstPartAgainAtAQuarter: async (build: Build, first: 'open' | 'close', travel: Travel): Promise<Turn> => {
      const {opens, shuts} = pressesOfTheFirstPart(build);
      const fold = partOf(build, 0).fold;
      return first === 'open' ? pressedAtAQuarter(fold, opens, shuts, travel) : pressedAtAQuarter(fold, shuts, opens, travel);
    },
    opensTheFirstPartThenChoosesAtAQuarter: async (build: Build, motion: 'Static', travel: Travel): Promise<Turn> =>
      pressedAtAQuarter(partOf(build, 0).fold, pressesOfTheFirstPart(build).opens,
        page.getByRole('group', {name: 'fold motion'}).getByRole('radio', {name: motion}), travel),
    partsOf: async (build: Build): Promise<Part[]> =>
      (await folds(build).all()).slice(closeBarsBeforeTheParts(build)).map((_fold, index) => partOf(build, index))
  };
};

export const textOf = (part: Part): Locator => part.fold.getByRole('paragraph', {includeHidden: true});
