import {render} from '@testing-library/react';
import {appAddress} from '@__test_support/address';
import {site} from '@pages/__test_support';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@navigation';
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

  test('should link the Application Continuum, and the quotation from it, to the Continuum', async () => {
    render(<TestApp at={Paths.practice}/>);
    await practicePage.arrivedOn('Structure');

    expect(practicePage.openingLinks()).toEqual([
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

  test('should mark Behavior as the current tab when the reader picks it from Presentation', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);

    await practicePage.pickTab('Behavior');

    expect(await practicePage.arrivedOn('Behavior')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Behavior');
  });

  test('should read Structure’s practice when the reader picks its tab from Behavior', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);

    await practicePage.pickTab('Structure');

    expect(await practicePage.arrivedOn('Structure')).toBeInTheDocument();
    expect(practicePage.partHeading('What organizing markup has to solve')).toBeInTheDocument();
  });
});
