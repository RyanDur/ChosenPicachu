import {render} from '@testing-library/react';
import {appAddress} from '@__test_support/address';
import {site} from '@pages/__test_support';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@pages/Paths';
import {practiceAt, practicePage} from '@pages/Practice/__test_support/practice';

const appContinuum = 'https://www.appcontinuum.io/';

describe('the practice page', () => {
  test('should open on Structure, at its own address, when no tab is named', async () => {
    render(<TestApp at={Paths.practice}/>);

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Structure');
    expect(appAddress.shown()).toBe(practiceAt('structure'));
  });

  test('should send a link saved as ?tab=structure to that tab\'s own address', async () => {
    render(<TestApp at={`${Paths.practice}?tab=structure`}/>);

    expect(await appAddress.movedOnFrom(`${Paths.practice}?tab=structure`)).toBe(practiceAt('structure'));
  });

  test('should send a link saved as ?tab=presentation to that tab\'s own address', async () => {
    render(<TestApp at={`${Paths.practice}?tab=presentation`}/>);

    expect(await appAddress.movedOnFrom(`${Paths.practice}?tab=presentation`)).toBe(practiceAt('presentation'));
  });

  test('should send a link saved as ?tab=behavior to that tab\'s own address', async () => {
    render(<TestApp at={`${Paths.practice}?tab=behavior`}/>);

    expect(await appAddress.movedOnFrom(`${Paths.practice}?tab=behavior`)).toBe(practiceAt('behavior'));
  });

  test('should be no such room at a tab the page does not have', async () => {
    render(<TestApp at={practiceAt('interaction')}/>);

    expect(await site.pageTitled()).toHaveTextContent('No such room');
  });

  test('should link each tab to its own address', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');

    expect(practicePage.tabAddresses()).toEqual(['structure', 'presentation', 'behavior'].map(practiceAt));
  });

  test('should open a link saved under the old tab name, dynamic, on the Behavior tab', async () => {
    render(<TestApp at={`${Paths.practice}?tab=dynamic`}/>);

    expect(await practicePage.arrivedOn('Behavior')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Behavior');
    expect(appAddress.shown()).toBe(practiceAt('behavior'));
  });

  test('should open a link saved under the old tab name, dynamic-interaction, on the Behavior tab', async () => {
    render(<TestApp at={`${Paths.practice}?tab=dynamic-interaction`}/>);

    expect(await practicePage.arrivedOn('Behavior')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Behavior');
    expect(appAddress.shown()).toBe(practiceAt('behavior'));
  });

  test('should open on Structure when the address names constructor, a word every object answers to', async () => {
    render(<TestApp at={`${Paths.practice}?tab=constructor`}/>);

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Structure');
    expect(appAddress.shown()).toBe(practiceAt('structure'));
  });

  test('should open on Structure when the address names toString, a word every object answers to', async () => {
    render(<TestApp at={`${Paths.practice}?tab=toString`}/>);

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Structure');
    expect(appAddress.shown()).toBe(practiceAt('structure'));
  });

  test('should open on Structure when the address names __proto__, a word every object answers to', async () => {
    render(<TestApp at={`${Paths.practice}?tab=__proto__`}/>);

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Structure');
    expect(appAddress.shown()).toBe(practiceAt('structure'));
  });

  test('should open on Structure, marked as the current tab, when an old address names a tab the page does not have', async () => {
    render(<TestApp at={`${Paths.practice}?tab=interaction`}/>);

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Structure');
    expect(appAddress.shown()).toBe(practiceAt('structure'));
  });

  test('should say what each tab holds, and that one principle runs through all three', async () => {
    render(<TestApp at={Paths.practice}/>);
    const opener = await practicePage.opener();

    expect(opener).toHaveTextContent(
      'Each tab below is one of the three concerns and says how I organize it: the rules I keep, the moments in the Record that taught them, and the test that tells me a rule holds. The demos show the rules at work. One principle runs through all three, and it is worth saying once before the tabs apply it.');
  });

  test('should say the principle: the code says what it means, for the reader who was not there', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.opener();
    const principle = practicePage.openingParagraph(/^Code is read more often than it is written/);

    expect(principle).toHaveTextContent(
      'Code is read more often than it is written, and the reader is usually someone who was not there, including me when I come back to it. So I organize for the reader: the code says what it means. An element says what the thing is. When no element does, I make one and name it for the one behavior it adds. A class says what the element is, what it needs, or what is true right now, and the sheet says what that means today. An event says what happened, in the past tense. A type says what is true and refuses what cannot be. A condition reads as a sentence, has, not, empty, the same words the sheet uses in :has(), :not() and :empty. Files sit by feature too, so a change to the gallery is in the gallery. The Application Continuum, a guide to organizing an application as it grows, lays files out that way. It ranks the work plainly: “Naming, organizing, and reducing circular dependencies are the three most important things you’ll ever do as a programmer”.');
  });

  test('should open on two paragraphs, what the tabs hold and the principle, and nothing more before the tabs', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.opener();

    expect(practicePage.beforeTheTabs()).toEqual([
      expect.stringMatching(/^Each tab below is one of the three concerns/),
      expect.stringMatching(/^Code is read more often than it is written/)
    ]);
  });

  test('should link the Application Continuum, and the quotation from it, to the Continuum', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.opener();

    expect(practicePage.linksIn(/^Code is read more often than it is written/)).toEqual([
      ['The Application Continuum', appContinuum],
      ['“Naming, organizing, and reducing circular dependencies are the three most important things you’ll ever do as a programmer”', appContinuum]
    ]);
  });

  test('should read Presentation’s practice when the reader picks its tab from Structure', async () => {
    render(<TestApp at={practiceAt('structure')}/>);

    await practicePage.pickTab('Presentation');

    expect(await practicePage.arrivedOn('Presentation')).toBeInTheDocument();
    expect(practicePage.partHeading('What organizing CSS has to solve')).toBeInTheDocument();
  });

  test('should read Behavior’s practice when the reader picks its tab from Presentation', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);

    await practicePage.pickTab('Behavior');

    expect(await practicePage.arrivedOn('Behavior')).toBeInTheDocument();
    expect(practicePage.paragraph(/^Behavior splits into what is true and what happened/)).toBeInTheDocument();
  });

  test('should read Structure’s practice when the reader picks its tab from Behavior', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);

    await practicePage.pickTab('Structure');

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.paragraph(/^I start from what the content is and pick the element for it/)).toBeInTheDocument();
  });
});
