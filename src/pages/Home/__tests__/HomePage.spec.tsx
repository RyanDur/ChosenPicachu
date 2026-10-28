import {TestApp} from '@__test_support/TestApp';
import {render} from '@testing-library/react';
import {Paths} from '@pages/Paths';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {homePage} from '@pages/Home/__test_support/home';
import {britishSpellingsOnThePage} from '@__test_support/spelling';
import {DemoTopics} from '@pages/Demos/types';
import {spelledOut} from '@pages/Record/moments/spelled-out';

describe('the home page', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.home}/>);
    await homePage.arrived();
  });

  test('should spell its own prose the American way', () => {
    expect(britishSpellingsOnThePage()).toEqual([]);
  });

  test('should say what the site is about, then who it’s for, then what the sections and the Record give, then Practice and the Demos', () => {
    expect(homePage.paragraph(/^A webpage is built from three languages/)).toHaveTextContent('A webpage is built from three languages, and each has its own job. HTML says what things are, CSS says how they look, and JavaScript says how they respond: structure, presentation and behavior. This site is about that division of work: what each language is for, how it came to be that way, and how to build with it in mind.');
    expect(homePage.paragraph(/^It’s written for the developer/)).toHaveTextContent('It’s written for the developer who learned the three the way most of us did, one at a time and on the job, and so asks one of them to do most of the work. A job then ends up in a language that can do it, rather than the one it belongs to: a div standing in for a button, a class named for a margin, a script taking over scrolling, focus or the back button. Each works well enough to ship. The bugs come later, when someone uses the page with a keyboard, with a screen reader, on a phone. Much of this work is already done by the platform: the browser and the standards it follows. It keeps getting better, too, because the people who write the standards listen to developers, watch what they build, and adopt what proves itself across the browsers. So more code rarely fixes these bugs. Putting the job where it belongs does.');
    expect(homePage.paragraph(/^Below, each language has a section/)).toHaveTextContent('Below, each language has a section: what it says, the rule its history teaches, and where to read more. The Record tells how the work came to be divided. When one language could not yet do a job, another covered for it until its standard caught up and adopted the workaround, which is what HTML’s own design principles ask: when a practice is already widespread, “consider adopting it rather than forbidding it or inventing something new”. It goes through each language’s story, then every moment in order, then reads the three together.');
    expect(homePage.paragraph(/^Practice shows how I organize/)).toHaveTextContent('Practice shows how I organize each language, with a tab for each. The Demos put that practice to work: five features built from this site’s own code and explained beside it, that run from simple to expert. Two compare the trick we used before the platform could do the job with what it does now; the other three build drag sorting, charts and tables with no library for any of them.');
    expect(outOfReadingOrder([
      homePage.paragraph(/^A webpage is built from three languages/),
      homePage.paragraph(/^It’s written for the developer/),
      homePage.paragraph(/^Below, each language has a section/),
      homePage.paragraph(/^Practice shows how I organize/)
    ])).toEqual([]);
  });

  test('should count the demos as many as the Demos have tabs', () => {
    expect(homePage.paragraph(/^Practice shows how I organize/)).toHaveTextContent(`${spelledOut(Object.values(DemoTopics).length)} features`);
  });

  test('should carry one quotation in the opener, linked to HTML’s design principles', () => {
    const links = homePage.linksIn(homePage.paragraph(/^Below, each language has a section/));

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
    ['Structure', ['HTML says what each thing on the page is: a heading, a list, a button, a form, a fold that opens and shuts. An element is more than a label, though. The browser gives each of them behavior, and so do the tools people read pages with. A button can be reached with the Tab key and pressed with Enter or Space, as well as clicked. A form sends when Enter is pressed in one of its fields, and refuses an empty required field in the browser’s own words. A fold built from a details element opens and shuts from the mouse or the keyboard. A screen reader tells its user what each element is and what state it is in: a list and how many items it holds, a button and whether it is disabled, a fold and whether it is open. Its user can also jump from heading to heading. None of this needs a script, only the right element. Knowing which one is the hard part, and sometimes no element fits yet.', 'The same markup is read by more than the browser. A screen reader reads it aloud for someone who can’t see the page. A browser’s reader view shows it as plain, resizable text for someone with low vision, or for anyone who reads better without the clutter. A search engine reads it to learn what the page is about, and the next developer reads it to see how the page is built. Each of them finds the content by its elements, not by how it looks.', 'A button built from a div gets none of this, because a div has no meaning of its own: the browser gives it no behavior, and a screen reader has no role to announce. The role and a place in the Tab order each have to be added by hand, and the key presses with script. Until they are, a screen reader finds no button there, only text. So the rule is to choose the element that means what the content is, and add the look and the behavior on top of it.'], 'structure'],
    ['Presentation', ['CSS says how things look. Put a look in the style sheet, under a name that says why it looks that way, and it is written once. Change the rule and every element with that name changes. A style written on the element itself, or one set from script, lives only on that element, so the same look has to be written again for the next one. The sheet is also where three sources meet: the author’s styles, the user’s own sheet and the browser’s. The cascade settles which applies.', 'Motion belongs in the sheet too. A browser can animate transform and opacity cheaply, in many cases on its compositor thread, which moves layers already drawn, rather than the main thread the script runs on. So a transition the sheet owns can keep going while the script is busy, and a script that moves things frame by frame cannot. Script names the state, with a class or an attribute, and the sheet says how the state looks. When the sheet cannot yet say a look, the workaround sits beside the rule it stands in for, and goes when the platform catches up. So the rule is that a look belongs in the sheet, and the HTML never says how anything looks.'], 'presentation'],
    ['Behavior', ['JavaScript says how things respond. Script adds what the elements lack: a behavior no element has yet, which is what Brendan Eich built it for, and a request that brings new information into the page without loading a new one, which Jesse James Garrett named Ajax in 2005. The costs arrive when the script builds the whole page, as a single-page application does. Until it runs, the first thing the browser draws is blank, and no crawler or screen reader has a document to read. And because the app changes pages itself, the back button has to be rebuilt by hand.', 'Where a script does run, the state is what is true, an event is what happened, and the page is drawn from the two. That is the program’s core. Keep it apart from a framework such as React, and the framework can change around it while the core stays. So the rule is that the document comes first, and a script runs only where a part of the page must respond.'], 'behavior']
  ])('should state the %s claim, then send the reader on, to its story on the Record and to how I organize it on Practice', (concern, claim, id) => {
    expect(homePage.concernText(concern)).toEqual([...claim, 'Its story is on the Record.', 'How I organize it is on Practice.']);
    expect(homePage.storySignpost(concern)).toHaveAttribute('href', `${Paths.record}#${id}`);
    expect(homePage.practiceSignpost(concern)).toHaveAttribute('href', `${Paths.practice}${id}/`);
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

  test('should send the Structure claim\'s details element to the accordions demo', () => {
    expect(homePage.claimLinks('Structure').map(link => [link.textContent, link.getAttribute('href')]))
      .toEqual([['a details element', `${Paths.demos}accordions/`]]);
  });

  test('should send the Presentation motion claim to web.dev\'s account of which animations stay cheap, and the workaround to the z-index demo', () => {
    expect(homePage.claimLinks('Presentation').map(link => [link.textContent, link.getAttribute('href')])).toEqual([
      ['A browser can animate transform and opacity cheaply', 'https://web.dev/articles/animations-overview'],
      ['the workaround sits beside the rule it stands in for', `${Paths.demos}z-index/`]
    ]);
  });
});
