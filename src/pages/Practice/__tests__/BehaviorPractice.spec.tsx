import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@pages/Paths';
import {practiceAt, practicePage} from '@pages/Practice/__test_support/practice';
import {britishSpellingsOnThePage} from '@__test_support/spelling';

describe('the Behavior practice tab', () => {
  test('should spell the Behavior tab\'s prose the American way', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(britishSpellingsOnThePage()).toEqual([]);
  });

  test('should follow the Behavior tab’s first rule with the principle applied to it: an event and a type are names', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(practicePage.paragraphAfter(/^Behavior splits into what is true and what happened/))
      .toEqual(expect.stringMatching(/^An event is a name for what happened\./));
  });

  test('should open the Behavior tab from its address, reading how I organize it from its first rule to its test', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);

    expect(await practicePage.arrivedOn('Behavior')).toBeInTheDocument();
    expect(practicePage.currentTab()).toBe('Behavior');
    expect(practicePage.paragraph(/^Behavior splits into what is true and what happened/)).toBeInTheDocument();
    expect(practicePage.paragraph(/^The test is to read the state on its own/)).toBeInTheDocument();
  });

  test('should tell how I organize behavior on the Behavior tab', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(practicePage.heading()).toBeVisible();
    expect(practicePage.link(/operable through a keyboard interface/))
      .toHaveAttribute('href', expect.stringContaining('w3.org'));
    expect(practicePage.paragraph(/so I name them in the past tense: lifted, dropped, chosen\./)).toBeInTheDocument();
    expect(practicePage.paragraph(/I keep the state in one place, and replacing it is the only way anything on screen changes\./)).toBeInTheDocument();
    expect(practicePage.paragraph(/^Behavior splits into what is true and what happened/))
      .toHaveTextContent(/AngularJS, in the 2010 moment, bound model and view both ways\. I keep one direction\./);
    expect(practicePage.paragraph(/^Not every event starts at the pointer/))
      .toHaveTextContent(/The 2005 moment is where that pattern got its name, Ajax, and became ordinary\./);
    expect(practicePage.paragraph(/so I test them on their own with no page involved\./)).toBeInTheDocument();
    expect(practicePage.paragraph(/The page announces each change too: a sighted reader watches the order change, and a screen reader user hears the same change read out\./)).toBeInTheDocument();
    expect(practicePage.paragraph(/Change the framework, or remove it, and only the shell changes/)).toBeInTheDocument();
    expect(practicePage.paragraph(/The test is to read the state on its own/)).toBeInTheDocument();
  });

  test('should rest Behavior’s practice on its own moments, each citation naming the year of the moment it opens', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');

    expect(practicePage.citations()).toEqual([['2010', `${Paths.record}#the-application-needs-a-frame`], ['2005', `${Paths.record}#the-page-needs-to-update-in-place`], ['2010', `${Paths.record}#the-application-needs-a-frame`], ['2013', `${Paths.record}#someone-needs-components`], ['2016', `${Paths.record}#the-document-needs-to-come-first`]]);
  });
});
