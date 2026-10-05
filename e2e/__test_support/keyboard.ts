import type {Locator, Page} from '@playwright/test';

// WebKit's Tab skips controls unless the system's keyboard navigation is on, and Alt+Tab reaches every one
export const pressTab = (page: Page, {backwards = false} = {}): Promise<void> => {
  const tab = page.context().browser()?.browserType().name() === 'webkit' ? 'Alt+Tab' : 'Tab';
  return page.keyboard.press(backwards ? `Shift+${tab}` : tab);
};

export const tabsTo = async (page: Page, control: Locator, {within = 80} = {}): Promise<boolean> => {
  for (let press = 0; press < within; press++) {
    await pressTab(page);
    if (await control.evaluate(element => element === document.activeElement)) return true;
  }
  return false;
};
