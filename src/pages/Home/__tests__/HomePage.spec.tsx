import {TestApp} from '@__test_support/TestApp';
import {render} from '@testing-library/react';
import {Paths} from '@pages/Paths';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {homePage} from '@pages/Home/__test_support/home';

describe('the home page', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.home}/>);
    await homePage.arrived();
  });

  test('should open on the thesis, then say who the site is for, then what the sections, the Record, Practice and the Demos give', () => {
    expect(homePage.paragraph(/^A webpage is three languages working in concert/)).toHaveTextContent('A webpage is three languages working in concert. HTML says what things are, CSS says how they look, and JavaScript says how they respond. Each was designed to handle a specific concern. When one could not yet do a job, another covered for it until the standard caught up and adopted the workaround, which is what HTML’s own design principles ask: when a practice is already widespread, “consider adopting it rather than forbidding it or inventing something new”.');
    expect(homePage.paragraph(/^This site is for the developer/)).toHaveTextContent('This site is for the developer who has hit a bug on a page and wants to know what the platform meant. Many of us write one of the three languages well and the other two by habit, and the bug lives where the habit and the platform disagree. The habit might be a div where a button was meant, a class that names a margin instead of the reason for it, or a script that rebuilds what the browser already does: scrolling, focus, the back button. Each one works on the day it is written. The fix, when it stops working, is rarely more code. It is finding which language the job belonged to, and letting that language do it.');
    expect(homePage.paragraph(/^Below, each language has one section/)).toHaveTextContent('Below, each language has one section: what it says, the rule its history teaches, and where to read more. The Record tells each language’s story, then every moment in order, then reads the three together. Practice shows how I organize each one, with a tab for each language. The Demos are where I put the practice to work: five features built from this site’s own code and explained beside it. Two compare the trick we used before the platform could do the job with what it does now; the other three show what the platform does with no library at all.');
    expect(outOfReadingOrder([
      homePage.paragraph(/^A webpage is three languages working in concert/),
      homePage.paragraph(/^This site is for the developer/),
      homePage.paragraph(/^Below, each language has one section/)
    ])).toEqual([]);
  });

  test('should carry one quotation in the opening, linked to HTML’s design principles', () => {
    const links = homePage.linksIn(homePage.paragraph(/^A webpage is three languages working in concert/));

    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName('“consider adopting it rather than forbidding it or inventing something new”');
    expect(links[0]).toHaveAttribute('href', 'https://www.w3.org/TR/html-design-principles/');
  });

  test('should offer three concerns, each named by its responsibility and opened by its quotation', () => {
    expect(homePage.concernHeadings()).toEqual(['Structure', 'Presentation', 'Behavior']);
    expect(homePage.quotationIn('Structure')).toHaveTextContent(/identifies the meaning, purpose, and structure/);
    expect(homePage.quotationIn('Presentation')).toHaveTextContent(/separation of HTML from CSS/);
    expect(homePage.quotationIn('Behavior')).toHaveTextContent(/a much livelier Web/);
  });

  test.each([
    ['Structure', ['HTML says what each thing on the page is: a heading, a list, a button, a form. Choose the element that means the content and its behavior comes with it, before any script arrives: a button presses from the keyboard, a details opens and shuts, and a screen reader is told the role and the state. The same markup tells the next person what the page is, and a search engine and a reader mode read the meaning, not the look. Build a button from a div and script instead, and the keyboard, the focus and the role each have to be added back by hand. Until they are, a screen reader finds no button there, only text. So the rule is to choose the element that means what the content is, and add the look and the behavior on top of it.'], 'structure'],
    ['Presentation', ['CSS says how things look. Put a look in the style sheet, under a name that says why it looks that way, and it is written once. Change the rule and every element with that name changes. A style written on the element itself, or one set from script, lives only on that element, so the same look has to be written again for the next one. The sheet is also where three sources meet: the author’s styles, the user’s own sheet and the browser’s. The cascade settles which applies.', 'Motion belongs in the sheet too. A browser can animate transform and opacity cheaply, in many cases on its compositor thread, which moves layers already drawn, rather than the main thread the script runs on. So a transition the sheet owns can keep going while the script is busy, and a script that moves things frame by frame cannot. Script names the state, with a class or an attribute, and the sheet says how the state looks. When the sheet cannot yet say a look, the workaround sits beside the rule it stands in for, and goes when the platform catches up. So the rule is that a look belongs in the sheet, and the HTML never says how anything looks.'], 'presentation'],
    ['Behavior', ['JavaScript says how things respond. Script adds what the elements lack: a behavior no element has yet, which is what Brendan Eich built it for, and a request that brings new information into the page without loading a new one, which Jesse James Garrett named Ajax in 2005. The costs arrive when the script builds the whole page, as a single-page application does. Until it runs, the first thing the browser draws is blank, and no crawler or screen reader has a document to read. And because the app changes pages itself, the back button has to be rebuilt by hand.', 'Where a script does run, the state is what is true, an event is what happened, and the page is drawn from the two. That is the program’s core. Keep it apart from a framework such as React, and the framework can change around it while the core stays. So the rule is that the document comes first, and a script runs only where a part of the page must respond.'], 'behavior']
  ])('should state the %s claim, then send the reader on, to its story on the Record and to how I organize it on Practice', (concern, claim, id) => {
    expect(homePage.concernText(concern)).toEqual([...claim, 'Its story is on the Record.', 'How I organize it is on Practice.']);
    expect(homePage.storySignpost(concern)).toHaveAttribute('href', `${Paths.record}#${id}`);
    expect(homePage.practiceSignpost(concern)).toHaveAttribute('href', `${Paths.practice}?tab=${id}`);
    expect(outOfReadingOrder([
      homePage.concernHeading(concern),
      homePage.quotationIn(concern),
      ...homePage.claim(concern),
      homePage.storySignpost(concern),
      homePage.practiceSignpost(concern)
    ])).toEqual([]);
  });

  test('should send the Behavior quotation\'s source to the Internet Archive\'s copy of Eich\'s interview, the live page being gone', () => {
    expect(homePage.quotationSource('Behavior')).toHaveAttribute('href', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html');
  });

  test('should send the Presentation motion claim to web.dev\'s account of which animations stay cheap, and the workaround to the z-index demo', () => {
    expect(homePage.claimLinks('Presentation').map(link => [link.textContent, link.getAttribute('href')])).toEqual([
      ['A browser can animate transform and opacity cheaply', 'https://web.dev/articles/animations-overview'],
      ['the workaround sits beside the rule it stands in for', `${Paths.demos}?tab=z-index`]
    ]);
  });
});
