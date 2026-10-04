import type {Page} from '@playwright/test';

// WebKit's Tab skips controls unless the system's keyboard navigation is on, and Alt+Tab reaches every one
export const pressTab = (page: Page, {backwards = false} = {}): Promise<void> => {
  const tab = page.context().browser()?.browserType().name() === 'webkit' ? 'Alt+Tab' : 'Tab';
  return page.keyboard.press(backwards ? `Shift+${tab}` : tab);
};
