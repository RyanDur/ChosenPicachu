# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.e2e.ts >> the vam gallery hangs art from the real museum
- Location: e2e/smoke.e2e.ts:6:3

# Error details

```
Error: expect(locator).not.toBeEmpty() failed

Locator:  locator('figure.frame figcaption').first()
Expected: not empty
Received: empty
Timeout:  5000ms

Call log:
  - Expect "not toBeEmpty" with timeout 5000ms
  - waiting for locator('figure.frame figcaption').first()
    14 × locator resolved to <figcaption class="title"></figcaption>
       - unexpected value "empty"

```

```yaml
- banner:
  - heading "Gallery" [level=1]
  - combobox "Search For:"
  - text: "Search For:"
  - button "reset search"
  - button "submit search" [disabled]
- main:
  - navigation:
    - heading "The Art Institute of Chicago" [level=3]:
      - link "The Art Institute of Chicago":
        - /url: /ChosenPicachu/gallery?page=1&size=8&tab=aic
    - heading "Harvard Art Museums" [level=3]:
      - link "Harvard Art Museums":
        - /url: /ChosenPicachu/gallery?page=1&size=8&tab=harvard
    - heading "The Victoria and Albert Museum" [level=3]:
      - link "The Victoria and Albert Museum":
        - /url: /ChosenPicachu/gallery?page=1&size=8&tab=vam
  - figure:
    - link:
      - /url: /ChosenPicachu/gallery/O507242?tab=vam
  - figure:
    - link:
      - /url: /ChosenPicachu/gallery/O507241?tab=vam
  - figure:
    - link:
      - /url: /ChosenPicachu/gallery/O507240?tab=vam
  - figure:
    - link:
      - /url: /ChosenPicachu/gallery/O507239?tab=vam
  - figure:
    - link:
      - /url: /ChosenPicachu/gallery/O507238?tab=vam
  - figure:
    - link:
      - /url: /ChosenPicachu/gallery/O507237?tab=vam
  - figure:
    - link:
      - /url: /ChosenPicachu/gallery/O507236?tab=vam
  - figure:
    - link:
      - /url: /ChosenPicachu/gallery/O507235?tab=vam
- article:
  - 'spinbutton "Page #1"'
  - text: "Page #1"
  - spinbutton "8 Per Page"
  - text: 8 Per Page
  - button "Go"
- contentinfo:
  - navigation:
    - article
    - article:
      - article: 1 - 8
      - article: of
      - article: "741125"
    - link "NEXT":
      - /url: /ChosenPicachu/gallery?page=2&size=8&tab=vam
    - link "LAST":
      - /url: /ChosenPicachu/gallery?page=1247&size=8&tab=vam
- complementary:
  - navigation:
    - link "Home":
      - /url: /ChosenPicachu/
    - link "About":
      - /url: /ChosenPicachu/about?tab=
    - link "Users":
      - /url: /ChosenPicachu/users
    - link "Gallery":
      - /url: /ChosenPicachu/gallery?page=1&size=8&tab=aic
    - link "Games":
      - /url: /ChosenPicachu/games
    - link "Repo":
      - /url: https://github.com/RyanDur/ChosenPicachu
  - article:
    - heading "ICONS" [level=2]
```

# Test source

```ts
  1  | import {expect, test} from '@playwright/test';
  2  | 
  3  | const tabs = ['aic', 'harvard', 'vam'];
  4  | 
  5  | for (const tab of tabs) {
  6  |   test(`the ${tab} gallery hangs art from the real museum`, async ({page}) => {
  7  |     await page.goto(`gallery?page=1&size=8&tab=${tab}`);
  8  | 
  9  |     await expect(page.locator('figure.frame')).toHaveCount(8, {timeout: 30_000});
  10 |     await expect(page.getByTestId('empty-gallery')).toHaveCount(0);
> 11 |     await expect(page.locator('figure.frame figcaption').first()).not.toBeEmpty();
     |                                                                       ^ Error: expect(locator).not.toBeEmpty() failed
  12 |   });
  13 | }
  14 | 
  15 | test('an aic search still hangs art', async ({page}) => {
  16 |   await page.goto('gallery?page=1&size=8&tab=aic&search=monet');
  17 | 
  18 |   await expect(page.locator('figure.frame')).toHaveCount(8, {timeout: 30_000});
  19 |   await expect(page.getByTestId('empty-gallery')).toHaveCount(0);
  20 | });
  21 | 
```