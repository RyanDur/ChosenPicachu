import type {Page} from '@playwright/test';

export const resolved = (page: Page, property: string, token: string): Promise<string> =>
  page.evaluate(([property, name]) => {
    const swatch = document.createElement('span');
    swatch.style.setProperty(property, `var(${name})`);
    document.body.append(swatch);
    const value = getComputedStyle(swatch).getPropertyValue(property);
    swatch.remove();
    if (value === '' || value === 'none') {
      throw new Error(`${name} paints nothing for ${property}`);
    }
    return value;
  }, [property, token]);

export const inkNamed = (page: Page, token: string): Promise<string> => resolved(page, 'color', token);
