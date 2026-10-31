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

  test('should say why the site was made, then what it is about, then who it’s for, then what the sections and the Record give, then Practice and the Demos', () => {
    expect(homePage.paragraph(/^I made this site/)).toHaveTextContent('I made this site because I couldn’t find one about how HTML, CSS and JavaScript work together. There is plenty on each. MDN documents all three in depth, the standards define each in its own specification, and courses teach them one at a time. What I wanted was the view a working developer needs: how each language does its own job well, and how each covers for another’s weakness until the platform closes it. The closest I found is Jeremy Keith’s Resilient Web Design, which treats the three as layers and tells their history, without code, by design. This site follows the same three through working code.');
    expect(homePage.paragraph(/^A webpage is built from three languages/)).toHaveTextContent('A webpage is built from three languages, and each has its own job. HTML says what things are, CSS says how they look, and JavaScript says how they respond: structure, presentation and behavior. This site is about how they share that work: what each language is for, how they came to divide it, and how to build with that in mind.');
    expect(homePage.paragraph(/^It’s written for the developer/)).toHaveTextContent('It’s written for the developer who learned the three the way most of us did, one at a time and on the job, and so asks one of them to do most of the work. A job then ends up in a language that can do it, rather than the one it belongs to: a div standing in for a button, a look written on the element itself, a script taking over scrolling, focus or the back button. Each works well enough to ship. The bugs come later, when someone uses the page with a keyboard, with a screen reader, on a phone. Much of this work is already done by the platform: the browser and the standards it follows. It keeps getting better, too, because the people who write the standards listen to developers, watch what they build, and adopt what proves itself across the browsers. So more code rarely fixes these bugs. Putting the job where it belongs does.');
    expect(homePage.paragraph(/^Below, each language has a section/)).toHaveTextContent('Below, each language has a section: what it says, what its history teaches, and where to read more. The Record tells how the work came to be divided, by the pattern HTML’s own design principles ask for: when a practice is already widespread, “consider adopting it rather than forbidding it or inventing something new”. It goes through each language’s story, then every moment in order, then reads the three together.');
    expect(homePage.paragraph(/^Practice shows how I organize/)).toHaveTextContent('Practice shows how I organize each language, with a tab for each. The Demos put that practice to work: five features built from this site’s own code and explained beside it, that run from simple to expert. Two compare the trick we used before the platform could do the job with what it does now; the other three build drag sorting, charts and tables with no library for any of them.');
    expect(outOfReadingOrder([
      homePage.paragraph(/^I made this site/),
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
    ['Structure', ['HTML says what each thing on the page is: a heading, a list, a button, a form, a fold that opens and shuts. An element is more than a label, though. The browser gives each of them behavior, and so do the tools people read pages with. A button can be reached with the Tab key and pressed with Enter or Space, as well as clicked. A form sends when Enter is pressed in one of its fields, and refuses an empty required field in the browser’s own words. A fold built from a details element opens and shuts from the mouse or the keyboard, a job that took a script for years before the element arrived. A screen reader tells its user what each element is and what state it is in: a list and how many items it holds, a button and whether it is disabled, a fold and whether it is open. Its user can also jump from heading to heading. None of this needs a script, only the right element. Knowing which one is the hard part, and sometimes no element fits yet.', 'The same markup is read by more than the browser. A screen reader reads it aloud for someone who can’t see the page. A browser’s reader view shows it as plain, resizable text for someone with low vision, or for anyone who reads better without the clutter. A search engine reads it to learn what the page is about, and the next developer reads it to see how the page is built. Each of them finds the content by its elements, not by how it looks.', 'A button built from a div gets none of this, because a div has no meaning of its own: the browser gives it no behavior, and a screen reader has no role to announce. The role and a place in the Tab order each have to be added by hand, and the key presses with script. Until they are, a screen reader finds no button there, only text. So the rule is to choose the element that means what the content is, and add the look and the behavior on top of it.'], 'structure'],
    ['Presentation', ['CSS says how things look: color, type, spacing, layout, motion. Write a look once in a style sheet and apply it by name. Give a group of elements a class, write the look in one rule for that class, and every element with it takes the look. Change that rule, and they all change. A look written on the element itself, in the HTML or by a script, belongs to that element alone. It has to be written again for the next one, and changed everywhere it was written.', 'The name is where HTML and the sheet meet, and every approach to CSS picks a side. Call a class warning, and the sheet can turn every warning orange without touching the HTML; the CSS Zen Garden restyled one document hundreds of times that way. Call it text-red, and it works on any element with no new CSS, but turning the warnings orange means changing the HTML; that is Tailwind’s side. Adam Wathan, who created Tailwind, describes the choice as which way the dependency runs, and BEM and Bootstrap each take a position of their own. I name classes for what things are and keep each language in its own file, but either way, the work goes somewhere.', 'Motion belongs in the sheet too. A transition is the sheet’s way of moving from one look to the next: it says how long the change takes, and the browser draws the frames in between. A browser can animate transform and opacity cheaply: it moves and fades what it has already drawn. In many cases it does that on a different thread from the one the script runs on. So a transition the sheet owns keeps going while the script is busy, and an animation a script runs frame by frame stops until the script is free. Script names the state and the sheet says how the state looks: script marks a menu as open, with a class or an attribute, and the sheet slides it into view.', 'A transition needs to know where it ends. A fold that slides open ends at whatever height its content needs, and that height depends on the content and the width of the screen, so no number in the sheet can name it. For years the sheet had no way to animate to it, so a script measured the height, or the sheet guessed one too large. Now the sheet can do it alone, and the accordions show both ways. The sheet still can’t say every look, and where it can’t, a workaround fills in until it can. So the rule is that the look lives in the sheet, whichever way its class names point.'], 'presentation'],
    ['Behavior', ['JavaScript says how things respond, the job Brendan Eich built it for. It does what no element and no rule in the sheet can do on its own: sort a table by the column a reader picks, let a reader drag rows into a new order, draw a chart from prices that arrive while the page is open. It can also fetch new information and put it into the page without loading a new one, the way suggestions appear under a search box as someone types. Some of what script once had to do, the other two now do: a details element opens and shuts a fold, a popover closes itself when the reader presses Escape, and the sheet slides a menu into view.', 'JavaScript handles anything that changes while the page is open, and that includes the other two languages. It can create and remove HTML elements, and add, change and remove CSS. What it makes still does the same jobs. A button a script renders is still a button element, with the keys and the role that come with it, and its look still comes from the sheet. The popular frameworks are built to keep that in view. Vue calls its components “a natural extension of the classic trio of HTML, CSS and JavaScript”, with the markup, the script and the styles in blocks of their own. Svelte and Angular divide a component the same way, and React’s JSX writes the page as elements. They keep the three side by side in one component rather than in three files, but each part is still written in its own language, where the browser does the work. None of them chooses the element; that is still the developer’s call. When script writes the page, each job stays where it belongs. What changes is where and when the HTML is made.', 'That has moved over the web’s history. For most of it, a server sent each page as an HTML document, and the browser drew it and handled moving between pages: a link took the reader to the top of the next page, put focus at its start, kept their place for the back button, and had a screen reader announce where they were. From around 2010, the single-page application made the page in the browser, in script, and changed between pages without a new load. Since 2016, many sites have gone back to making the HTML on the server, sending it first and adding script where the page responds.', 'Each way gives some things for free and asks for work on others. A page the server sends can be read before any script runs, and the browser handles scrolling, focus and the back button. It needs a server, or a build step that renders each page ahead of time. A single-page application can be served as plain files, keeps its state as the reader moves around, and changes pages without a reload. The browser’s jobs between pages then become the app’s: done by hand, or designed around. This site is one, and it also renders each page ahead of time when it is built, so the page is there before any script runs. GitHub Pages serves it as plain files, and it talks to GitHub’s APIs and the browser directly. Knowing what HTML, CSS and the browser already do is what makes the trade visible: which jobs come free, which take work, and which are worth leaning into.'], 'behavior']
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

  test('should send the Behavior claim’s quotation from Vue to Vue’s guide on single-file components', () => {
    expect(homePage.claimLinks('Behavior').map(link => [link.textContent, link.getAttribute('href')]))
      .toEqual([['“a natural extension of the classic trio of HTML, CSS and JavaScript”', 'https://vuejs.org/guide/scaling-up/sfc']]);
  });

  test('should send the Presentation motion claim to web.dev\'s account of which animations stay cheap, and the fold to the accordions demo', () => {
    expect(homePage.claimLinks('Presentation').map(link => [link.textContent, link.getAttribute('href')])).toEqual([
      ['A browser can animate transform and opacity cheaply', 'https://web.dev/articles/animations-overview'],
      ['the accordions', `${Paths.demos}accordions/`]
    ]);
  });
});
