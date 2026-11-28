import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {demosAt, demoTabs, pageFoot} from '@pages/Demos/__test_support';
import {explanation, recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {accordionsTab} from '@pages/Demos/Accordions/__test_support/tab';

const platformWay = 'accordions/what-the-platform-gives-now';
const title = 'What the platform gives now';
const build = '?type=inclusive&style=drawer';
const remembers = demosAt('accordions/a-box-remembers-the-fold', build);

describe('what the platform gives now, on its own page', () => {
  test('should say its place in the accordions book', async () => {
    render(<TestApp at={demosAt(platformWay)}/>);

    expect(await accordionsTab.place()).toHaveTextContent('Accordions · part 5 of 6');
  });

  test('should link the first accordion it builds on to its heading on the tab, with the fold choices carried', async () => {
    const from = demosAt(platformWay, build);
    render(<TestApp at={from}/>);

    await accordionsTab.followInIntroduction(title, 'An accordion in HTML alone');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions', build));
    expect(appAddress.fragment()).toBe('#html-alone-heading');
  });

  test('should link the exhibit’s source, where details and summary are defined, to its heading on the tab, with the fold choices carried', async () => {
    const from = demosAt(platformWay, build);
    render(<TestApp at={from}/>);

    await accordionsTab.followInIntroduction(title, 'The exhibit’s source');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions', build));
    expect(appAddress.fragment()).toBe('#exhibit-source-heading');
  });

  test('should link the build it replaces to part 2’s page, with the fold choices carried', async () => {
    const from = demosAt(platformWay, build);
    render(<TestApp at={from}/>);

    await accordionsTab.followInIntroduction(title, 'A box remembers the fold, and a rule reads it');

    expect(await appAddress.movedOnFrom(from)).toBe(remembers);
  });

  test('a reader who arrives with inclusive can choose exclusive on the page, and gets the exclusive details build', async () => {
    render(<TestApp at={demosAt(platformWay, '?type=inclusive')}/>);
    const part = await explanation.part(title);

    await accordionsTab.choose('fold type', 'Exclusive');

    expect(accordionsTab.exhibitsIn(part)).toEqual(['Exclusive accordion using details elements']);
  });

  test('should lead back to part four’s page and on to part six’s, by number and title, with the fold choices carried', async () => {
    render(<TestApp at={demosAt(platformWay, build)}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Previous: 4. The measured height', demosAt('accordions/the-measured-height', build)],
      ['Next: 6. How a sliding fold moves', demosAt('accordions/how-a-sliding-fold-moves', build)]
    ]);
  });

  test('should title its page with its tab', async () => {
    render(<TestApp at={demosAt(platformWay)}/>);

    expect(await demoTabs.title('Demos Accordions')).toBeInTheDocument();
  });

  test('should show, with inclusive chosen, the inclusive details build under the platform', async () => {
    render(<TestApp at={demosAt(platformWay, '?type=inclusive')}/>);

    const explained = await explanation.part(title);

    expect(accordionsTab.exhibitsIn(explained)).toEqual(['Inclusive accordion using details elements']);
  });

  test('should show, with exclusive chosen, the exclusive details build under the platform', async () => {
    render(<TestApp at={demosAt(platformWay, '?type=exclusive')}/>);

    const explained = await explanation.part(title);

    expect(accordionsTab.exhibitsIn(explained)).toEqual(['Exclusive accordion using details elements']);
  });

  test('should link, with inclusive chosen, the run that introduces details to the build’s source on GitHub', async () => {
    render(<TestApp at={demosAt(platformWay, '?type=inclusive')}/>);

    const explained = await explanation.part(title);

    expect(explanation.sourcesBeside(explained, /This build uses details and summary/)).toEqual(['Accordions/InclusiveToggleAccordion.tsx on GitHub']);
  });

  test('should link, with exclusive chosen, the run that introduces details to the build’s source on GitHub', async () => {
    render(<TestApp at={demosAt(platformWay, '?type=exclusive')}/>);

    const explained = await explanation.part(title);

    expect(explanation.sourcesBeside(explained, /This build uses details and summary/)).toEqual(['Accordions/ExclusiveToggleAccordion.tsx on GitHub']);
  });

  test('should answer the drawer, through the fold motion dial, with what it does and what a reader who asks for less motion gets', async () => {
    render(<TestApp at={demosAt(platformWay, '?style=drawer')}/>);

    const reading = accordionsTab.readingIn(await accordionsTab.choiceRow('fold motion'));

    expect(reading).toHaveTextContent('The text slides down from under its bar.');
    expect(reading).toHaveTextContent('If your system asks for less motion, every fold here opens at once, whichever you choose.');
  });

  test('should still show the first platform fold’s text after the reader chooses another motion', async () => {
    render(<TestApp at={demosAt(platformWay)}/>);
    const platform = await explanation.part(title);
    const text = await accordionsTab.openFirstFoldIn(platform, 'Exclusive accordion using details elements');

    await accordionsTab.choose('fold motion', 'Drawer');

    expect(text).toBeVisible();
  });

  test('should draw, with inclusive chosen, under the platform, each mechanism in order, found by its name', async () => {
    render(<TestApp at={demosAt(platformWay, '?type=inclusive')}/>);

    const platform = await explanation.part(title);

    expect(explanation.drawingsTitled(platform, ['One job, two ways', 'Three pieces become two', 'Sized to the text'])).toEqual(explanation.drawingsIn(platform));
  });

  test('should draw, with exclusive chosen, under the platform, each mechanism in order, found by its name', async () => {
    render(<TestApp at={demosAt(platformWay, '?type=exclusive')}/>);

    const platform = await explanation.part(title);

    expect(explanation.drawingsTitled(platform, ['One job, two ways', 'Three pieces become two', 'Sized to the text'])).toEqual(explanation.drawingsIn(platform));
  });

  test('should link the checkbox build, at its first use in what the platform gives and in How details works, to part 2’s page', async () => {
    render(<TestApp at={demosAt(platformWay, build)}/>);

    const part = await explanation.part(title);

    expect(explanation.linksNamed(part, 'the checkbox build').map(link => link.getAttribute('href'))).toEqual([remembers, remembers]);
  });

  test('should, with inclusive chosen, link the checkbox build’s folds to part 2’s page', async () => {
    render(<TestApp at={demosAt(platformWay, build)}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(part, 'the checkbox build’s folds')).toHaveAttribute('href', remembers);
  });

  test('should link classes in How details works to part 2’s page, where class is defined', async () => {
    render(<TestApp at={demosAt(platformWay, build)}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(part, 'classes')).toHaveAttribute('href', remembers);
  });

  test('should link the known-height build’s bars to part 2’s page', async () => {
    render(<TestApp at={demosAt(platformWay, build)}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(part, 'the known-height build’s bars')).toHaveAttribute('href', remembers);
  });

  test('should show, with exclusive chosen, what the closed fold "How details works" holds once its bar is pressed', async () => {
    render(<TestApp at={demosAt(platformWay, '?type=exclusive')}/>);
    const fold = recipeFolds.story(await explanation.part(title), 'How details works');
    const depth = explanation.runsIn(fold)[0];
    expect(depth).not.toBeVisible();

    await accordionsTab.openFold(fold);

    expect(depth).toBeVisible();
  });
});
