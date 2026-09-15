import type {Page} from '@playwright/test';

const resolved = (page: Page, property: string, token: string): Promise<string> =>
  page.evaluate(([property, name]) => {
    const swatch = document.createElement('span');
    swatch.style.setProperty(property, `var(${name})`);
    document.body.append(swatch);
    const value = getComputedStyle(swatch).getPropertyValue(property);
    const defined = getComputedStyle(swatch).getPropertyValue(name).trim();
    swatch.remove();
    if (defined === '') {
      throw new Error(`${name} is not a token this page defines`);
    }
    if (value === '' || value === 'none') {
      throw new Error(`${name} paints nothing for ${property}`);
    }
    return value;
  }, [property, token]);

export const looks = (page: Page) => ({
  resolved: (property: string, token: string): Promise<string> => resolved(page, property, token),
  ink: (token: string): Promise<string> => resolved(page, 'color', token)
});
