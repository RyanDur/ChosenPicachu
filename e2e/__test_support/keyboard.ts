import type {Locator, Page} from '@playwright/test';
import {not} from '@ryandur/sand';

// WebKit's Tab skips controls unless the system's keyboard navigation is on, and Alt+Tab reaches every one
export const pressTab = (page: Page, {backwards = false} = {}): Promise<void> => {
  const tab = page.context().browser()?.browserType().name() === 'webkit' ? 'Alt+Tab' : 'Tab';
  return page.keyboard.press(backwards ? `Shift+${tab}` : tab);
};

export const tabsTo = async (page: Page, control: Locator, {within = 80} = {}): Promise<void> => {
  for (let press = 0; press < within && not(await control.evaluate(element => element === document.activeElement)); press++) {
    await pressTab(page);
  }
};
