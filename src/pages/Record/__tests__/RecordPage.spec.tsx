import {TestApp} from '@__test_support/TestApp';
import {itemHeadedBy} from '@__test_support/headed-item';
import {render, screen, waitFor, within} from '@testing-library/react';
import {Paths} from '@pages/Paths';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {recordPage} from '@pages/Record/__test_support/record';
import {homePage} from '@pages/Home/__test_support/home';
import {practiceAt, practicePage} from '@pages/Practice/__test_support/practice';

describe('the 1989 moment', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();
  });

  test('should link the book’s words to the page that quotes them', () => {
    expect(screen.getByRole('link', {name: '“as close as possible to no rules at all”', hidden: true})).toHaveAttribute('href', 'https://www.ppd.stfc.ac.uk/news/unravelling-the-web-how-particle-physics-launched-the-invention-that-changed-the-world/');
  });
});

describe('the 1991 moment', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();
  });

  test('should link the summary’s words to the summary', () => {
    expect(recordPage.momentLink('The web needs collaborators', '“The very small start-up effort is designed to allow small contributions.”')).toHaveAttribute('href', 'https://www.w3.org/People/Berners-Lee/1991/08/art-6487.txt');
  });
});

describe('the 1994 moment', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();
  });

  test('should link the thesis’s words to the thesis', () => {
    expect(recordPage.momentLink('Authors need control of the look', '“formed the basis for CSS”')).toHaveAttribute('href', 'https://www.wiumlie.no/2006/phd/#ch-postweb');
  });
});

describe('the first 1995 moment', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();
  });

  test('should link Keith’s line to his journal', () => {
    expect(within(itemHeadedBy('1995', 'Pages need to respond')).getByRole('link', {name: '“Java is to JavaScript as ham is to hamster.”', hidden: true})).toHaveAttribute('href', 'https://adactio.com/journal/1595');
  });
});

describe('the first 1996 moment', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();
  });

  test('should link HTML 3.2 to its Recommendation', () => {
    expect(within(itemHeadedBy('1996', 'The pages need to look the same')).getByRole('link', {name: 'HTML 3.2', hidden: true})).toHaveAttribute('href', 'https://www.w3.org/TR/REC-html32');
  });
});

describe('the 2013 moment', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();
  });

  test('should send the reader to the 2010 moment for the single-page application\'s shape', async () => {
    await recordPage.followFromMoment('Someone needs components', 'the 2010 moment');

    await waitFor(() => expect(itemHeadedBy('the timeline', 'The application needs a frame')).toHaveFocus());
  });

});

describe('the 2014 moment', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();
  });

  test('should link the Recommendation\'s date to the Recommendation, in the tells and in the story', () => {
    const dated = within(itemHeadedBy('the timeline', 'The rules need writing down')).getAllByRole('link', {name: '28 October 2014', hidden: true});

    expect(dated.map(link => link.getAttribute('href'))).toEqual(['https://www.w3.org/TR/2014/REC-html5-20141028/', 'https://www.w3.org/TR/2014/REC-html5-20141028/']);
  });

});

describe('the record\'s frame and its concert', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();
  });

  test('should send each of the concert’s quotations to its source, and its one link inside the record to the 1996 moment', () => {
    expect(recordPage.concertLinks()).toEqual([
      ['“start isolated and then merge”', 'https://www.w3.org/History/1989/proposal.html'],
      ['“research into fancy multimedia facilities such as sound and video”', 'https://www.w3.org/History/19921103-hypertext/hypertext/WWW/Proposal.html'],
      ['“formed the basis for CSS”', 'https://www.wiumlie.no/2006/phd/#ch-postweb'],
      ['HTML Design Principles', 'https://www.w3.org/TR/html-design-principles/'],
      ['“When a practice is already widespread among authors, consider adopting it rather than forbidding it or inventing something new.”', 'https://www.w3.org/TR/html-design-principles/'],
      ['“If there is already a widely used and implemented technology covering particular use cases”', 'https://www.w3.org/TR/html-design-principles/'],
      ['“consider specifying that technology in preference to inventing something new for the same purpose.”', 'https://www.w3.org/TR/html-design-principles/'],
      ['RFC 1866', 'https://www.rfc-editor.org/rfc/rfc1866'],
      ['“which control stylistic aspects of a document”', 'https://www.w3.org/People/Raggett/book4/ch02.html'],
      ['“HTML should allow separation of content and presentation.”', 'https://www.w3.org/TR/html-design-principles/'],
      ['the 1996 moment', `${Paths.record}#the-pages-need-to-look-the-same`],
      ['“Problems with CSS at scale 1. Global Namespace 2. Dependencies 3. Dead Code Elimination 4. Minification”', 'https://speakerdeck.com/vjeux/react-css-in-js'],
      ['“5. Sharing Constants 6. Non-deterministic Resolution 7. Isolation”', 'https://speakerdeck.com/vjeux/react-css-in-js'],
      ['“All your styles are local JS variables and you can export them if you want to”', 'https://speakerdeck.com/vjeux/react-css-in-js'],
      ['“My goal with this talk is not to convince you that you should drop CSS and use JS instead.”', 'https://speakerdeck.com/vjeux/react-css-in-js'],
      ['“enables you to attach a DOM tree to an element, and have the internals of this tree hidden from JavaScript and CSS running in the page”', 'https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM'],
      ['“Before shadow DOM was made available to web developers, browsers were already using it to encapsulate the inner structure of an element.”', 'https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM'],
      ['“provide a way for authors to build their own fully-featured DOM elements”', 'https://html.spec.whatwg.org/multipage/custom-elements.html'],
      ['“is used for namespacing and to ensure forward compatibility”', 'https://html.spec.whatwg.org/multipage/custom-elements.html'],
      ['“rationalise the platform”', 'https://html.spec.whatwg.org/multipage/custom-elements.html'],
      ['“was coined by Etsy’s frontend architect Katie Sylor-Miller”', 'https://jasonformat.com/islands-architecture/'],
      ['“the market would drive it to become a de facto standard”', 'https://www.w3.org/People/Raggett/book4/ch02.html'],
      ['“precisely this sequence of events that Dave Raggett and the World Wide Web Consortium were trying to avoid”', 'https://www.w3.org/People/Raggett/book4/ch02.html'],
      ['“Time ensured quality and interoperability.”', 'https://www.w3.org/2011/05/css-pr.html.en'],
      ['“consider users over authors over implementors over specifiers over theoretical purity.”', 'https://www.w3.org/TR/html-design-principles/']
    ]);
  });

});

describe('the record', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();
  });

  test('should open on its title, then tell the record, then walk into the demos, then collect the research', () => {
    const title = screen.getByRole('heading', {name: 'The record', level: 1});
    const record = screen.getByRole('heading', {name: 'How the web got its languages', level: 2});
    const research = screen.getByRole('heading', {name: 'The research', level: 2});
    const demos = screen.getByRole('link', {name: 'The Demos'});

    expect(title.compareDocumentPosition(record) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(record.compareDocumentPosition(demos) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(demos.compareDocumentPosition(research) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(demos).toHaveAttribute('href', Paths.demos);
  });

  test('should keep every source a quotation on the page links to on the research shelf, links between moments aside', () => {
    const shelved = recordPage.shelvedSources();

    expect(recordPage.sourcesLinked()).not.toEqual([]);
    expect(recordPage.sourcesLinked().filter(source => !shelved.includes(source))).toEqual([]);
  });

  test('the timeline walks the years in order, one entry each, a year of two moments holding both under its title', () => {
    const timeline = within(screen.getByRole('list', {name: 'the timeline'}));

    expect(timeline.getAllByRole('time').map(year => year.textContent)).toEqual(
      ['1989', '1990', '1991', '1994', '1995', 'May', 'November', '1996', 'August', 'December', '1997', '1998', '2002', '2003', '2004', '2005', '2007', '2009', '2010', '2011', '2013', '2014', '2016', '2017']);
    expect(timeline.getAllByRole('heading', {level: 3}).map(title => title.textContent)).toEqual([
      'CERN needs to share what it knows',
      'The information needs one interface',
      'The web needs collaborators',
      'Authors need control of the look',
      'Pages need to respond, and the browsers’ tags need a standard',
      'The pages need to look the same, and the style sheet needs a standard',
      'The language needs a standard',
      'The browsers need to agree',
      'Someone needs to go first',
      'The separation needs proof',
      'The standard needs the real world',
      'The page needs to update in place',
      'The defaults need to agree',
      'The standard needs to move again',
      'The application needs a frame',
      'The specification needs its tests',
      'Someone needs components',
      'The rules need writing down',
      'The document needs to come first',
      'The constants need a home'
    ]);
  });

  test('should hold 1995’s two moments in one entry, each dated by its month and captioned by its concern', async () => {
    await recordPage.openFullerStory('Pages need to respond, and the browsers’ tags need a standard');

    expect(recordPage.momentsOf('1995')).toEqual([['1995-05', 'May', 'Behavior', 'Pages need to respond'], ['1995-11', 'November', 'Structure', 'The browsers’ tags need a standard']]);
  });

  test('should hold 1996’s two moments in one entry, each dated by its month and captioned by its concern', async () => {
    await recordPage.openFullerStory('The pages need to look the same, and the style sheet needs a standard');

    expect(recordPage.momentsOf('1996')).toEqual([['1996-08', 'August', 'Structure, Presentation', 'The pages need to look the same'], ['1996-12-17', 'December', 'Presentation', 'The style sheet needs a standard']]);
  });

  test('should open every beat into its fuller story, closed until asked', () => {
    const timeline = within(screen.getByRole('list', {name: 'the timeline'}));

    expect(timeline.getAllByText('the fuller story')).toHaveLength(20);
    expect(recordPage.fullerStories().filter(fold => fold.hasAttribute('open'))).toHaveLength(0);
  });

  test('should link “CERN thus decides not to continue…” in Authors need control of the look to w3.org', () => {
    expect(recordPage.momentLink('Authors need control of the look', '“CERN thus decides not to continue WWW development”')).toHaveAttribute('href', 'https://www.w3.org/History.html');
  });

  test('should link “freely usable by anyone, with no…” in The web needs collaborators to w3.org', () => {
    expect(recordPage.momentLink('The web needs collaborators', '“freely usable by anyone, with no fees being payable to CERN”')).toHaveAttribute('href', 'https://www.w3.org/History.html');
  });

  test('should link “Scheme was the bait” in Pages need to respond to brendaneich.com', () => {
    expect(recordPage.momentLink('Pages need to respond', '“Scheme was the bait”')).toHaveAttribute('href', 'https://brendaneich.com/2008/04/popularity/');
  });

  test('should link “was then circulated through the Internet…” in The browsers’ tags need a standard to w3.org', () => {
    expect(recordPage.momentLink('The browsers’ tags need a standard', '“was then circulated through the Internet community for comment”')).toHaveAttribute('href', 'https://www.w3.org/People/Raggett/book4/ch02.html');
  });

  test('should link “buy it by the yard” in Pages need to respond to infoworld.com', () => {
    expect(recordPage.momentLink('Pages need to respond', '“buy it by the yard”')).toHaveAttribute('href', 'https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html');
  });

  test('should link “Nodes do not need to be…” in The information needs one interface to w3.org', () => {
    expect(recordPage.momentLink('The information needs one interface', '“Nodes do not need to be on the same machine: links may point across machine boundaries.”')).toHaveAttribute('href', 'https://www.w3.org/History/19921103-hypertext/hypertext/WWW/Proposal.html');
  });

  test('should link “registered by the W3 team” in The information needs one interface to info.cern.ch', () => {
    expect(recordPage.momentLink('The information needs one interface', '“registered by the W3 team”')).toHaveAttribute('href', 'https://info.cern.ch/hypertext/WWW/MarkUp/Tags.html');
  });

  test('should link “a line of ASCII characters terminated…” in The information needs one interface to w3.org', () => {
    expect(recordPage.momentLink('The information needs one interface', '“a line of ASCII characters terminated by a CR LF”')).toHaveAttribute('href', 'https://www.w3.org/Protocols/HTTP/AsImplemented.html');
  });

  test('should link “a single click was used for…” in The information needs one interface to worldwideweb.cern.ch', () => {
    expect(recordPage.momentLink('The information needs one interface', '“a single click was used for editing”')).toHaveAttribute('href', 'https://worldwideweb.cern.ch/worldwideweb/');
  });

  test('should link “was later renamed Nexus to avoid…” in The information needs one interface to worldwideweb.cern.ch', () => {
    expect(recordPage.momentLink('The information needs one interface', '“was later renamed Nexus to avoid confusion with the World Wide Web project”')).toHaveAttribute('href', 'https://worldwideweb.cern.ch/history/');
  });

  test('should link “Collaborators welcome!” in The web needs collaborators to w3.org', () => {
    expect(recordPage.momentLink('The web needs collaborators', '“Collaborators welcome!”')).toHaveAttribute('href', 'https://www.w3.org/People/Berners-Lee/1991/08/art-6484.txt');
  });

  test('should link “to distinguish it from the previous…” in The browsers’ tags need a standard to rfc-editor.org', () => {
    expect(recordPage.momentLink('The browsers’ tags need a standard', '“to distinguish it from the previous informal specifications”')).toHaveAttribute('href', 'https://www.rfc-editor.org/rfc/rfc1866');
  });

  test('should link “One of the fundamental features of…” in The style sheet needs a standard to w3.org', () => {
    expect(recordPage.momentLink('The style sheet needs a standard', '“One of the fundamental features of CSS is that style sheets cascade”')).toHaveAttribute('href', 'https://www.w3.org/TR/REC-CSS1-961217');
  });

  test('should link “as much as 14% of our…” in Someone needs to go first to the archived devedge.netscape.com', () => {
    expect(recordPage.momentLink('Someone needs to go first', '“as much as 14% of our users”')).toHaveAttribute('href', 'https://web.archive.org/web/2003/http://devedge.netscape.com/viewsource/2002/wired-interview/');
  });

  test('should link “calls this a gutsy move” in Someone needs to go first to meyerweb.com', () => {
    expect(recordPage.momentLink('Someone needs to go first', '“calls this a gutsy move”')).toHaveAttribute('href', 'https://meyerweb.com/eric/thoughts/2002/10/11/wired-with-standards/');
  });

  test('should link “the point man on the Wired…” in Someone needs to go first to meyerweb.com', () => {
    expect(recordPage.momentLink('Someone needs to go first', '“the point man on the Wired redesign”')).toHaveAttribute('href', 'https://meyerweb.com/eric/thoughts/2002/10/11/wired-with-standards/');
  });

  test('should link “ESPN followed a few months later” in Someone needs to go first to thehistoryoftheweb.com', () => {
    expect(recordPage.momentLink('Someone needs to go first', 'ESPN followed a few months later')).toHaveAttribute('href', 'https://thehistoryoftheweb.com/look-back-history-css/');
  });

  test('should link “a collaborative gallery that could show…” in The separation needs proof to csszengarden.com', () => {
    expect(recordPage.momentLink('The separation needs proof', '“a collaborative gallery that could show what CSS could accomplish”')).toHaveAttribute('href', 'https://csszengarden.com/pages/about/');
  });

  test('should link “You may modify the style sheet…” in The separation needs proof to csszengarden.com', () => {
    expect(recordPage.momentLink('The separation needs proof', '“You may modify the style sheet in any way you wish, but not the HTML.”')).toHaveAttribute('href', 'https://csszengarden.com/');
  });

  test('should link “8 voted Yes. 14 voted No.” in The standard needs the real world to w3.org', () => {
    expect(recordPage.momentLink('The standard needs the real world', '“8 voted Yes. 14 voted No.”')).toHaveAttribute('href', 'https://www.w3.org/2004/04/webapps-cdf-ws/summary');
  });

  test('should link “a rising threat of single-vendor solutions” in The standard needs the real world to whatwg.org', () => {
    expect(recordPage.momentLink('The standard needs the real world', '“a rising threat of single-vendor solutions”')).toHaveAttribute('href', 'https://whatwg.org/position-paper');
  });

  test('should link “technologies need to be backwards compatible” in The standard needs the real world to html.spec.whatwg.org', () => {
    expect(recordPage.momentLink('The standard needs the real world', '“technologies need to be backwards compatible”')).toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/introduction.html');
  });

  test('should link “the user waits some more” in The page needs to update in place to the archived www.adaptivepath.com', () => {
    expect(recordPage.momentLink('The page needs to update in place', '“the user waits some more”')).toHaveAttribute('href', 'https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php');
  });

  test('should link “they want the same APIs and…” in The page needs to update in place to infoworld.com', () => {
    expect(recordPage.momentLink('The page needs to update in place', '“they want the same APIs and they don’t get them”')).toHaveAttribute('href', 'https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html');
  });

  test('should link “smooths over the rough edges of…” in The page needs to update in place to prototypejs.org', () => {
    expect(recordPage.momentLink('The page needs to update in place', '“smooths over the rough edges of cross-browser development”')).toHaveAttribute('href', 'http://prototypejs.org/');
  });

  test('should link “an easy-to-use API that works across…” in The page needs to update in place to jquery.com', () => {
    expect(recordPage.momentLink('The page needs to update in place', '“an easy-to-use API that works across a multitude of browsers”')).toHaveAttribute('href', 'https://jquery.com/');
  });

  test('should link “Microsoft.XMLHTTP” in The page needs to update in place to en.wikipedia.org', () => {
    expect(recordPage.momentLink('The page needs to update in place', 'Microsoft.XMLHTTP')).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/XMLHttpRequest');
  });

  test('should link “ten days before the essay” in The page needs to update in place to en.wikipedia.org', () => {
    expect(recordPage.momentLink('The page needs to update in place', 'ten days before the essay')).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Google_Maps');
  });

  test('should link “A split committee is good for…” in The standard needs to move again to the archived mail.mozilla.org', () => {
    expect(recordPage.momentLink('The standard needs to move again', '“A split committee is good for no one and nothing, least of all any language specs that might come out of it.”')).toHaveAttribute('href', 'https://web.archive.org/web/2015/https://mail.mozilla.org/pipermail/es-discuss/2008-August/006837.html');
  });

  test('should link “Two compatible implementations which pass the…” in The standard needs to move again to tc39.es', () => {
    expect(recordPage.momentLink('The standard needs to move again', '“Two compatible implementations which pass the Test262 acceptance tests”')).toHaveAttribute('href', 'https://tc39.es/process-document/');
  });

  test('should link “Completely conforming implementation of the ECMAScript…” in The standard needs to move again to en.wikipedia.org', () => {
    expect(recordPage.momentLink('The standard needs to move again', '“Completely conforming implementation of the ECMAScript fourth edition draft specification”')).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/ActionScript');
  });

  test('should link “Therefore ‘ECMA-262 Edition 4’ as an…” in The standard needs to move again to ecma-international.org', () => {
    expect(recordPage.momentLink('The standard needs to move again', '“Therefore ‘ECMA-262 Edition 4’ as an Ecma International publication does not exist”')).toHaveAttribute('href', 'https://ecma-international.org/publications-and-standards/standards/ecma-262/');
  });

  test('should link “Neither of these address the root…” in The application needs a frame to angularjs.org', () => {
    expect(recordPage.momentLink('The application needs a frame', '“Neither of these address the root problem that HTML was not designed for dynamic views.”')).toHaveAttribute('href', 'https://angularjs.org/');
  });

  test('should link “20 October 2010” in The application needs a frame to github.com', () => {
    expect(recordPage.momentLink('The application needs a frame', '20 October 2010')).toHaveAttribute('href', 'https://github.com/angular/angular.js/blob/master/CHANGELOG.md');
  });

  test('should link “first deployed on Facebook’s News Feed…” in The application needs a frame to en.wikipedia.org', () => {
    expect(recordPage.momentLink('The application needs a frame', '“first deployed on Facebook’s News Feed in 2011”')).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/React_(software)');
  });

  test('should link “React isn’t an MVC framework” in Someone needs components to legacy.reactjs.org', () => {
    expect(recordPage.momentLink('Someone needs components', '“React isn’t an MVC framework”')).toHaveAttribute('href', 'https://legacy.reactjs.org/blog/2013/06/05/why-react.html');
  });

  test('should link “Christopher Chedeau’s talk” in Someone needs components to blog.vjeux.com', () => {
    expect(recordPage.momentLink('Someone needs components', 'Christopher Chedeau’s talk')).toHaveAttribute('href', 'https://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html');
  });

  test('should link “works across the latest devices and…” in Someone needs components to developer.mozilla.org', () => {
    expect(recordPage.momentLink('Someone needs components', '“works across the latest devices and browser versions”')).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@scope');
  });

  test('should link “In case of conflict, consider users…” in The rules need writing down to w3.org', () => {
    expect(recordPage.momentLink('The rules need writing down', '“In case of conflict, consider users over authors over implementors over specifiers over theoretical purity.”')).toHaveAttribute('href', 'https://www.w3.org/TR/html-design-principles/');
  });

  test('should link “few (if any) web browsers ever…” in The rules need writing down to html.spec.whatwg.org', () => {
    expect(recordPage.momentLink('The rules need writing down', '“few (if any) web browsers ever implemented true SGML parsing for HTML documents”')).toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/parsing.html');
  });

  test('should link “for legacy reasons” in The rules need writing down to html.spec.whatwg.org', () => {
    expect(recordPage.momentLink('The rules need writing down', '“for legacy reasons”')).toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/syntax.html');
  });

  test('should link “users over authors over implementors over…” in The rules need writing down to w3.org', () => {
    expect(recordPage.momentLink('The rules need writing down', '“users over authors over implementors over specifiers over theoretical purity”')).toHaveAttribute('href', 'https://www.w3.org/TR/html-design-principles/');
  });

  test('should link “Running client-side scripts to add application…” in The document needs to come first to web.dev', () => {
    expect(recordPage.momentLink('The document needs to come first', '“Running client-side scripts to add application state and interactivity to server-rendered HTML”')).toHaveAttribute('href', 'https://web.dev/rendering-on-the-web/');
  });

  test('should link “a small framework for server-rendered universal…” in The document needs to come first to vercel.com', () => {
    expect(recordPage.momentLink('The document needs to come first', '“a small framework for server-rendered universal JavaScript webapps”')).toHaveAttribute('href', 'https://vercel.com/blog/next');
  });

  test('should link “documented the islands architecture” in The document needs to come first to jasonformat.com', () => {
    expect(recordPage.momentLink('The document needs to come first', 'documented the islands architecture')).toHaveAttribute('href', 'https://jasonformat.com/islands-architecture/');
  });

  test('should link “research into zero-bundle-size React Server Components” in The document needs to come first to legacy.reactjs.org', () => {
    expect(recordPage.momentLink('The document needs to come first', '“research into zero-bundle-size React Server Components”')).toHaveAttribute('href', 'https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html');
  });

  test('should link “4 May 2023” in The document needs to come first to nextjs.org', () => {
    expect(recordPage.momentLink('The document needs to come first', '4 May 2023')).toHaveAttribute('href', 'https://nextjs.org/blog/next-13-4');
  });

  test('should link “marked the first time a large,…” in Someone needs to go first to stopdesign.com', () => {
    expect(recordPage.momentLink('Someone needs to go first', '“marked the first time a large, well-known, daily-content publisher had dropped tables for layout”')).toHaveAttribute('href', 'https://stopdesign.com/archive/2012/10/11/ten-years-later.html');
  });

  test('should link “CSS 2.1 is a really large…” in The specification needs its tests to w3.org', () => {
    expect(recordPage.momentLink('The specification needs its tests', '“CSS 2.1 is a really large collection of formatting features, and we had to not only carefully review and specify all the potential interactions between them, but also learn from existing implementations and of course tests. Time ensured quality and interoperability.”')).toHaveAttribute('href', 'https://www.w3.org/2011/05/css-pr.html.en');
  });

  test('should link “can focus its efforts on rapidly…” in The specification needs its tests to w3.org', () => {
    expect(recordPage.momentLink('The specification needs its tests', '“can focus its efforts on rapidly advancing CSS with new modules”')).toHaveAttribute('href', 'https://www.w3.org/2011/05/css-pr.html.en');
  });

  test('should link “Media Queries” in The specification needs its tests to w3.org', () => {
    expect(recordPage.momentLink('The specification needs its tests', 'Media Queries')).toHaveAttribute('href', 'https://www.w3.org/TR/2012/REC-css3-mediaqueries-20120619/');
  });

  test('should link “adopted by the Ecma General Assembly…” in The language needs a standard to 262.ecma-international.org', () => {
    expect(recordPage.momentLink('The language needs a standard', '“adopted by the Ecma General Assembly of June 1997”')).toHaveAttribute('href', 'https://262.ecma-international.org/5.1/');
  });

  test('should link “content positioning, downloadable fonts, table layout,…” in The browsers need to agree to w3.org', () => {
    expect(recordPage.momentLink('The browsers need to agree', '“content positioning, downloadable fonts, table layout, features for internationalization, automatic counters and numbering”')).toHaveAttribute('href', 'https://www.w3.org/TR/1998/REC-CSS2-19980512/');
  });

  test('should link “checked each page for correctness and…” in The browsers need to agree to w3.org', () => {
    expect(recordPage.momentLink('The browsers need to agree', '“checked each page for correctness and completeness”')).toHaveAttribute('href', 'https://www.w3.org/Style/CSS/Test/CSS1/current/tsack.html');
  });

  test('should link “All discrepancies should be traceable to…” in The browsers need to agree to w3.org', () => {
    expect(recordPage.momentLink('The browsers need to agree', '“All discrepancies should be traceable to CSS1 implementation shortcomings.”')).toHaveAttribute('href', 'https://www.w3.org/Style/CSS/Test/CSS1/current/test5526c.htm');
  });

  test('should link “does not fully support CSS1” in The browsers need to agree to w3.org', () => {
    expect(recordPage.momentLink('The browsers need to agree', '“does not fully support CSS1”')).toHaveAttribute('href', 'https://www.w3.org/Style/LieBos2e/history/Overview.html');
  });

  test('should link “the first browser with full CSS…” in The browsers need to agree to thehistoryoftheweb.com', () => {
    expect(recordPage.momentLink('The browsers need to agree', '“the first browser with full CSS Level 1 support”')).toHaveAttribute('href', 'https://thehistoryoftheweb.com/look-back-history-css/');
  });

  test('should link “27 March 2000” in The browsers need to agree to en.wikipedia.org', () => {
    expect(recordPage.momentLink('The browsers need to agree', '27 March 2000')).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Internet_Explorer_for_Mac');
  });

  test('should link “they ended up inventing ECMAScript, which…” in The language needs a standard to infoworld.com', () => {
    expect(recordPage.momentLink('The language needs a standard', '“they ended up inventing ECMAScript, which sounds a little like a skin disease”')).toHaveAttribute('href', 'https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html');
  });

  test('should link “The Ecma standard codifies just the…” in The language needs a standard to the archived www.computerworld.com', () => {
    expect(recordPage.momentLink('The language needs a standard', '“The Ecma standard codifies just the core language, not the DOM,”')).toHaveAttribute('href', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html');
  });

  test('should link “JScript was first supported in the…” in The language needs a standard to en.wikipedia.org', () => {
    expect(recordPage.momentLink('The language needs a standard', '“JScript was first supported in the Internet Explorer 3.0 browser released in August 1996”')).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/JScript');
  });

  test('should link “On 3 December 2009, ECMA-262 5th…” in The standard needs to move again to en.wikipedia.org', () => {
    expect(recordPage.momentLink('The standard needs to move again', '“On 3 December 2009, ECMA-262 5th edition was published”')).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/ECMAScript_version_history');
  });

  test('should link “JavaScript-based web framework for developing single-page…” in The application needs a frame to en.wikipedia.org', () => {
    expect(recordPage.momentLink('The application needs a frame', '“JavaScript-based web framework for developing single-page applications”')).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/AngularJS');
  });

  test('should link “it wasn’t long before web pages…” in The pages need to look the same to thehistoryoftheweb.com', () => {
    expect(recordPage.momentLink('The pages need to look the same', '“it wasn’t long before web pages lost all semantic value”')).toHaveAttribute('href', 'https://thehistoryoftheweb.com/look-back-history-css/');
  });

  test('should link “The BLINK tag was ousted in…” in The pages need to look the same to w3.org', () => {
    expect(recordPage.momentLink('The pages need to look the same', '“The BLINK tag was ousted in an HTML ERB meeting. Netscape would only abolish it if Microsoft agreed to get rid of MARQUEE; the deal was struck and both tags disappeared.”')).toHaveAttribute('href', 'https://www.w3.org/People/Raggett/book4/ch02.html');
  });

  test('should link “Microsoft couldn’t get a license from…” in The pages need to look the same to infoworld.com', () => {
    expect(recordPage.momentLink('The pages need to look the same', '“Microsoft couldn’t get a license from Sun”')).toHaveAttribute('href', 'https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html');
  });

  test('should link the mix of helvetica and times to Lie’s 1994 draft', () => {
    expect(recordPage.momentLink('Authors need control of the look', '“it may not be obvious how to mix 40% helvetica and 60% times”')).toHaveAttribute('href', 'https://www.w3.org/People/howcome/p/cascade.html');
  });

  test('should link the redefined influence to Lie’s 1994 draft', () => {
    expect(recordPage.momentLink('Authors need control of the look', '“# first, redefine influence to dictatorship”')).toHaveAttribute('href', 'https://www.w3.org/People/howcome/p/cascade.html');
  });

  test('should link the separation’s “a mix” to Lie’s 1994 draft', () => {
    expect(recordPage.momentLink('The separation needs proof', '“a mix”')).toHaveAttribute('href', 'https://www.w3.org/People/howcome/p/cascade.html');
  });

  test('should link Wired adopting standards outright to Bowman’s ten years later', () => {
    expect(recordPage.momentLink('Someone needs to go first', '“not just by publishing stories about it, but by adopting it outright”')).toHaveAttribute('href', 'https://stopdesign.com/archive/2012/10/11/ten-years-later.html');
  });

  test('should link the sites that followed Wired to Bowman’s ten years later', () => {
    expect(recordPage.momentLink('Someone needs to go first', '“Not long after Wired took that leap, many other large, well-known sites and companies began following suit.”')).toHaveAttribute('href', 'https://stopdesign.com/archive/2012/10/11/ten-years-later.html');
  });

  test('should link the stunning example to Meyer’s post of 11 October 2002', () => {
    expect(recordPage.momentLink('Someone needs to go first', '“the site is a stunning example of how standards can be made to work today”')).toHaveAttribute('href', 'https://meyerweb.com/eric/thoughts/2002/10/11/wired-with-standards/');
  });

  test('should link the release’s headline to the W3C’s CSS 2.1 release', () => {
    expect(recordPage.momentLink('The specification needs its tests', '“Cascading Style Sheets Standard Boasts Unprecedented Interoperability”')).toHaveAttribute('href', 'https://www.w3.org/2011/05/css-pr.html.en');
  });

  test('should link the years to converge to the W3C’s CSS 2.1 release', () => {
    expect(recordPage.momentLink('The specification needs its tests', '“it took many years for implementations and the specification to converge”')).toHaveAttribute('href', 'https://www.w3.org/2011/05/css-pr.html.en');
  });

  test('should link why CSS 2.1 took so long to the W3C’s CSS 2.1 release', () => {
    expect(recordPage.momentLink('The specification needs its tests', '“Why is CSS 2.1 taking so long?”')).toHaveAttribute('href', 'https://www.w3.org/2011/05/css-pr.html.en');
  });

  test('should link the 9000 tests to the W3C’s CSS 2.1 release', () => {
    expect(recordPage.momentLink('The specification needs its tests', '“More than 9000 CSS tests have made it easier for designers to create style sheets that work across browsers, and across devices.”')).toHaveAttribute('href', 'https://www.w3.org/2011/05/css-pr.html.en');
  });

  test('should link Meyer’s reason for a reset to his Reset Reasoning', () => {
    expect(recordPage.momentLink('The defaults need to agree', '“The basic reason is that all browsers have presentation defaults, but no browsers have the same defaults.”'))
      .toHaveAttribute('href', 'https://meyerweb.com/eric/thoughts/2007/04/18/reset-reasoning/');
  });

  test('should link Meyer’s starting point to his Reset Reloaded', () => {
    expect(recordPage.momentLink('The defaults need to agree', '“Think of these as a starting point for creating your own defaults”'))
      .toHaveAttribute('href', 'https://meyerweb.com/eric/thoughts/2007/05/01/reset-reloaded/');
  });

  test('should link the reset’s goal to Meyer’s Reset CSS page', () => {
    expect(recordPage.momentLink('The defaults need to agree', '“to reduce browser inconsistencies in things like default line heights, margins and font sizes of headings”'))
      .toHaveAttribute('href', 'https://meyerweb.com/eric/tools/css/reset/');
  });

  test('should date normalize.css’s version 1.0 by its tags', () => {
    expect(recordPage.momentLink('The defaults need to agree', 'August 2012'))
      .toHaveAttribute('href', 'https://github.com/necolas/normalize.css/tags');
  });

  test('should link normalize.css’s aim to Gallagher’s About normalize.css', () => {
    expect(recordPage.momentLink('The defaults need to agree', '“preserve useful browser defaults rather than erasing them”'))
      .toHaveAttribute('href', 'https://nicolasgallagher.com/about-normalize-css/');
  });

  test('should carry the 2007 moment’s reader on to the 2011 moment’s tests, with focus there', async () => {
    await recordPage.followFromMoment('The defaults need to agree', 'the 2011 moment');

    await waitFor(() => expect(itemHeadedBy('the timeline', 'The specification needs its tests')).toHaveFocus());
  });

  test('should link Sass’s variable to its documentation', () => {
    expect(recordPage.momentLink('The constants need a home', '“you assign a value to a name that begins with $, and then you can refer to that name instead of the value itself”'))
      .toHaveAttribute('href', 'https://sass-lang.com/documentation/variables/');
  });

  test('should link the custom property’s definition to MDN’s guide to them', () => {
    expect(recordPage.momentLink('The constants need a home', '“entities defined by CSS authors that represent specific values to be reused throughout a document”'))
      .toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties');
  });

  test('should link Wathan’s essay by its title', () => {
    expect(recordPage.momentLink('The constants need a home', 'CSS Utility Classes and “Separation of Concerns”'))
      .toHaveAttribute('href', 'https://adamwathan.me/css-utility-classes-and-separation-of-concerns/');
  });

  test('should link Tailwind’s theme section to its version 3 documentation', () => {
    expect(recordPage.momentLink('The constants need a home', '“is where you define your project’s color palette, type scale, fonts, breakpoints, border radius values, and more”'))
      .toHaveAttribute('href', 'https://v3.tailwindcss.com/docs/theme');
  });

  test('should carry the 2017 moment’s reader back to the 2013 moment’s components, with focus there', async () => {
    await recordPage.followFromMoment('The constants need a home', 'The 2013 moment');

    await waitFor(() => expect(itemHeadedBy('the timeline', 'Someone needs components')).toHaveFocus());
  });

  test('should link the percentage width to the CSS1 test suite’s test5526c', () => {
    expect(recordPage.momentLink('The browsers need to agree', '“width: 10.638%; /* refers to parent element’s width of 47em. = 5em or 50px */”')).toHaveAttribute('href', 'https://www.w3.org/Style/CSS/Test/CSS1/current/test5526c.htm');
  });

  test('should link the pixel-exact rendering to the CSS1 test suite’s test5526c', () => {
    expect(recordPage.momentLink('The browsers need to agree', '“All 100%-conformant CSS1 agents should be able to render the document elements above this paragraph indistinguishably (to the pixel) from this reference rendering”')).toHaveAttribute('href', 'https://www.w3.org/Style/CSS/Test/CSS1/current/test5526c.htm');
  });

  test('should send the reader on from the bridge to the Practice page', () => {
    expect(screen.getByRole('link', {name: 'the Practice page'})).toHaveAttribute('href', Paths.practice);
  });

  test('should send the reader on from the bridge to the Demos', () => {
    expect(screen.getByRole('link', {name: 'The Demos'})).toHaveAttribute('href', Paths.demos);
  });

  test('should send the reader on from the bridge to the accordions', () => {
    expect(screen.getByRole('link', {name: 'the accordions'})).toHaveAttribute('href', `${Paths.demos}accordions/`);
  });

  test('should tell the concert after the timeline closes and before the tee-up', () => {
    expect(outOfReadingOrder([
      recordPage.paragraphOpening(/^Read the titles again/),
      recordPage.concert(),
      recordPage.paragraphOpening(/^The Record ends here, and the practice begins/)
    ])).toEqual([]);
  });

  test('should land the concert’s reader on the 1996 moment, with focus there', async () => {
    await recordPage.followConcertLink('the 1996 moment');

    await waitFor(() => expect(itemHeadedBy('1996', 'The pages need to look the same')).toHaveFocus());
  });

  test('should read every shelved work as its title, a space, then where it comes from', () => {
    within(screen.getByRole('region', {name: 'The research'})).getAllByRole('listitem', {hidden: true}).forEach(entry => {
      const title = within(entry).getByRole('link', {hidden: true}).textContent ?? '';
      expect(entry.textContent?.startsWith(`${title} `), `${title} runs into its provenance`).toBe(true);
    });
  });

  test('the history cites its sources', () => {
    expect(screen.getByRole('link', {name: /proposing the WorldWideWeb/}))
      .toHaveAttribute('href', expect.stringContaining('w3.org/History'));
    expect(screen.getByRole('link', {name: /drafted Cascading HTML Style Sheets/}))
      .toHaveAttribute('href', expect.stringContaining('w3.org/People/howcome'));
    expect(screen.getByRole('link', {name: /never become a page-description language/}))
      .toHaveAttribute('href', expect.stringContaining('w3.org/Style/LieBos2e'));
    screen.getAllByRole('link', {name: 'The Box Acid Test'})
      .forEach(link => expect(link).toHaveAttribute('href', expect.stringContaining('w3.org/Style/CSS/Test')));
    expect(screen.getByRole('link', {name: /one HTML document/}))
      .toHaveAttribute('href', expect.stringContaining('csszengarden.com'));
    expect(screen.getByRole('link', {name: /wrote the interpreter in about ten days/}))
      .toHaveAttribute('href', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html');
    expect(screen.getByRole('link', {name: /reducing the overlap/}))
      .toHaveAttribute('href', expect.stringContaining('html.com/html5'));
  });

  test('should head the research shelves The web, Structure, Presentation, Behavior, then The concert', () => {
    expect(recordPage.shelfHeadings()).toEqual(['The web', 'Structure', 'Presentation', 'Behavior', 'The concert']);
  });

  test('the research stands collected, closed until asked', () => {
    const bibliography = screen.getByRole('region', {name: 'The research'});

    expect(within(bibliography).getByRole('heading', {name: 'The research'})).toBeVisible();
    expect(within(bibliography).getByRole('group', {hidden: true})).not.toHaveAttribute('open');
    const works = within(bibliography).getAllByRole('listitem', {hidden: true});
    expect(works.length).toBeGreaterThanOrEqual(25);
    works.forEach(work => expect(within(work).getAllByRole('link', {hidden: true}).length).toBeGreaterThan(0));
    const cited = within(bibliography).getAllByRole('link', {hidden: true}).map(link => link.getAttribute('href') ?? '');
    expect(cited.some(href => href.includes('w3.org/Style/LieBos2e'))).toBe(true);
    expect(cited.some(href => href.includes('web.archive.org'))).toBe(true);
    expect(cited.some(href => href.includes('w3.org/History/1989'))).toBe(true);
  });
});

describe('arriving at a moment on the record', () => {
  test('should take the keyboard to the moment the address names, so the next Tab starts there', async () => {
    render(<TestApp at={`${Paths.record}#the-document-needs-to-come-first`}/>);

    await screen.findByRole('heading', {name: 'The document needs to come first'});

    await waitFor(() => expect(itemHeadedBy('the timeline', 'The document needs to come first')).toHaveFocus());
  });

  test('should take the keyboard to a moment whose title carries an apostrophe', async () => {
    render(<TestApp at={`${Paths.record}#the-browsers-tags-need-a-standard`}/>);

    await screen.findByRole('heading', {name: 'The browsers’ tags need a standard'});

    await waitFor(() => expect(itemHeadedBy('1995', 'The browsers’ tags need a standard')).toHaveFocus());
  });
});

describe('the record\'s three stories', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();
  });

  test('should open on the quotation, then the argument, then the four parts, then the three stories, Structure, Presentation, Behavior, then the timeline', () => {
    expect(outOfReadingOrder([recordPage.openingQuotation(), recordPage.argument(), recordPage.parts(), recordPage.storyHeading('Structure'), recordPage.storyHeading('Presentation'), recordPage.storyHeading('Behavior'), recordPage.timelineHeading()])).toEqual([]);
  });

  test('should end Structure\'s story with the moments it rests on, each line landing on its moment in the timeline', () => {
    expect(recordPage.storyMomentsHeading('Structure')).toBeVisible();
    expect(recordPage.storyMomentLines('Structure')).toEqual(['1989 CERN needs to share what it knows', '1990 The information needs one interface', '1991 The web needs collaborators', '1995 The browsers’ tags need a standard', '1996 The pages need to look the same', '2004 The standard needs the real world', '2013 Someone needs components', '2014 The rules need writing down', '2016 The document needs to come first']);
    expect(recordPage.storyMomentLine('Structure', '1989 CERN needs to share what it knows')).toHaveAttribute('href', `${Paths.record}#cern-needs-to-share-what-it-knows`);
    expect(recordPage.storyMomentLine('Structure', '1990 The information needs one interface')).toHaveAttribute('href', `${Paths.record}#the-information-needs-one-interface`);
    expect(recordPage.storyMomentLine('Structure', '1991 The web needs collaborators')).toHaveAttribute('href', `${Paths.record}#the-web-needs-collaborators`);
    expect(recordPage.storyMomentLine('Structure', '1995 The browsers’ tags need a standard')).toHaveAttribute('href', `${Paths.record}#the-browsers-tags-need-a-standard`);
    expect(recordPage.storyMomentLine('Structure', '1996 The pages need to look the same')).toHaveAttribute('href', `${Paths.record}#the-pages-need-to-look-the-same`);
    expect(recordPage.storyMomentLine('Structure', '2004 The standard needs the real world')).toHaveAttribute('href', `${Paths.record}#the-standard-needs-the-real-world`);
    expect(recordPage.storyMomentLine('Structure', '2013 Someone needs components')).toHaveAttribute('href', `${Paths.record}#someone-needs-components`);
    expect(recordPage.storyMomentLine('Structure', '2014 The rules need writing down')).toHaveAttribute('href', `${Paths.record}#the-rules-need-writing-down`);
    expect(recordPage.storyMomentLine('Structure', '2016 The document needs to come first')).toHaveAttribute('href', `${Paths.record}#the-document-needs-to-come-first`);
  });

  test('should link “often, the information has been recorded,…” in Structure’s story to w3.org', () => {
    recordPage.storyQuotations('Structure', '“often, the information has been recorded, it just cannot be found”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/History/1989/proposal.html'));
  });

  test('should link “generality and portability are more important…” in Structure’s story to w3.org', () => {
    recordPage.storyQuotations('Structure', '“generality and portability are more important than fancy graphics techniques”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/History/1989/proposal.html'));
  });

  test('should link “a new system must allow existing…” in Structure’s story to w3.org', () => {
    recordPage.storyQuotations('Structure', '“a new system must allow existing systems to be linked together without requiring any central control or coordination”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/History/1989/proposal.html'));
  });

  test('should link “completely historical, deriving from the AAP…” in Structure’s story to info.cern.ch', () => {
    recordPage.storyQuotations('Structure', '“completely historical, deriving from the AAP tag set”').forEach(link => expect(link).toHaveAttribute('href', 'https://info.cern.ch/hypertext/WWW/MarkUp/Tags.html'));
  });

  test('should link “SGML (ugh! but standard)” in Structure’s story to w3.org', () => {
    recordPage.storyQuotations('Structure', '“SGML (ugh! but standard)”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/People/Berners-Lee/1991/08/art-6484.txt'));
  });

  test('should link “Nodes do not need to be…” in Structure’s story to w3.org', () => {
    recordPage.storyQuotations('Structure', '“Nodes do not need to be on the same machine: links may point across machine boundaries.”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/History/19921103-hypertext/hypertext/WWW/Proposal.html'));
  });

  test('should link “to allow links to be made…” in Structure’s story to w3.org', () => {
    recordPage.storyQuotations('Structure', '“to allow links to be made to any information anywhere”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/People/Berners-Lee/1991/08/art-6484.txt'));
  });

  test('should link “has nothing to know about other…” in Structure’s story to w3.org', () => {
    recordPage.storyQuotations('Structure', '“has nothing to know about other servers or other webs and can be kept simple”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/History/19921103-hypertext/hypertext/WWW/Proposal.html'));
  });

  test('should link “making a web is as simple…” in Structure’s story to w3.org', () => {
    recordPage.storyQuotations('Structure', '“making a web is as simple as writing a few SGML files which point to your existing data”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/People/Berners-Lee/1991/08/art-6487.txt'));
  });

  test('should link “it turned out that people were…” in Structure’s story to worldwideweb.cern.ch', () => {
    recordPage.storyQuotations('Structure', '“it turned out that people were quite happy to write HTML by hand”').forEach(link => expect(link).toHaveAttribute('href', 'https://worldwideweb.cern.ch/worldwideweb/'));
  });

  test('should link “During 1993 and early 1994, lots…” in Structure’s story to w3.org', () => {
    recordPage.storyQuotations('Structure', '“During 1993 and early 1994, lots of browsers had added their own bits to HTML; the language was becoming ill-defined”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/People/Raggett/book4/ch02.html'));
  });

  test('should link “remains to this day firmly implanted…” in Structure’s story to w3.org', () => {
    recordPage.storyQuotations('Structure', '“remains to this day firmly implanted in HTML”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/People/Raggett/book4/ch02.html'));
  });

  test('should link “a Document Type Definition for HTML…” in Structure’s story to w3.org', () => {
    recordPage.storyQuotations('Structure', '“a Document Type Definition for HTML 2, a kind of mathematically precise description of the language”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/People/Raggett/book4/ch02.html'));
  });

  test('should link “brings together, clarifies, and formalizes a…” in Structure’s story to rfc-editor.org', () => {
    recordPage.storyQuotations('Structure', '“brings together, clarifies, and formalizes a set of features that roughly corresponds to the capabilities of HTML in common use prior to June 1994”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.rfc-editor.org/rfc/rfc1866'));
  });

  test('should link “to distinguish it from the previous…” in Structure’s story to rfc-editor.org', () => {
    recordPage.storyQuotations('Structure', '“to distinguish it from the previous informal specifications”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.rfc-editor.org/rfc/rfc1866'));
  });

  test('should link “began inventing its own HTML tags…” in Structure’s story to w3.org', () => {
    recordPage.storyQuotations('Structure', '“began inventing its own HTML tags as it pleased without first openly discussing them with the Web community”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/People/Raggett/book4/ch02.html'));
  });

  test('should link “took the existing IETF HTML 2…” in Structure’s story to w3.org', () => {
    recordPage.storyQuotations('Structure', '“took the existing IETF HTML 2 standard and incorporated features from HTML+ and HTML 3”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/People/Raggett/book4/ch02.html'));
  });

  test('should link “the W3C membership decided to stop…” in Structure’s story to html.spec.whatwg.org', () => {
    recordPage.storyQuotations('Structure', '“the W3C membership decided to stop evolving HTML and instead begin work on an XML-based equivalent, called XHTML”').forEach(link => expect(link).toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/introduction.html'));
  });

  test('should link “a new language that was not…” in Structure’s story to html.spec.whatwg.org', () => {
    recordPage.storyQuotations('Structure', '“a new language that was not compatible with the earlier HTML and XHTML languages”').forEach(link => expect(link).toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/introduction.html'));
  });

  test('should link “rather than as a replacement for…” in Structure’s story to html.spec.whatwg.org', () => {
    recordPage.storyQuotations('Structure', '“rather than as a replacement for existing deployed technologies (like HTML)”').forEach(link => expect(link).toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/introduction.html'));
  });

  test('should link “sparked a renewed interest in evolving…” in Structure’s story to html.spec.whatwg.org', () => {
    recordPage.storyQuotations('Structure', '“sparked a renewed interest in evolving HTML itself, rather than finding replacements for it”').forEach(link => expect(link).toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/introduction.html'));
  });

  test('should link “a rising threat of single-vendor solutions” in Structure’s story to whatwg.org', () => {
    recordPage.storyQuotations('Structure', '“a rising threat of single-vendor solutions”').forEach(link => expect(link).toHaveAttribute('href', 'https://whatwg.org/position-paper'));
  });

  test('should link “Backwards compatibility, clear migration path” in Structure’s story to whatwg.org', () => {
    recordPage.storyQuotations('Structure', '“Backwards compatibility, clear migration path”').forEach(link => expect(link).toHaveAttribute('href', 'https://whatwg.org/position-paper'));
  });

  test('should link “8 voted Yes. 14 voted No.” in Structure’s story to w3.org', () => {
    recordPage.storyQuotations('Structure', '“8 voted Yes. 14 voted No.”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/2004/04/webapps-cdf-ws/summary'));
  });

  test('should link “does not intend to put any…” in Structure’s story to w3.org', () => {
    recordPage.storyQuotations('Structure', '“does not intend to put any resources into”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/2004/04/webapps-cdf-ws/summary'));
  });

  test('should link “conflicted with the previously chosen direction…” in Structure’s story to html.spec.whatwg.org', () => {
    recordPage.storyQuotations('Structure', '“conflicted with the previously chosen direction for the web’s evolution”').forEach(link => expect(link).toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/introduction.html'));
  });

  test('should link “voted to continue developing XML-based replacements…” in Structure’s story to html.spec.whatwg.org', () => {
    recordPage.storyQuotations('Structure', '“voted to continue developing XML-based replacements instead”').forEach(link => expect(link).toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/introduction.html'));
  });

  test('should link “specifications and implementations need to match…” in Structure’s story to html.spec.whatwg.org', () => {
    recordPage.storyQuotations('Structure', '“specifications and implementations need to match even if this means changing the specification rather than the implementations”').forEach(link => expect(link).toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/introduction.html'));
  });

  test('should link “In case of conflict, consider users…” in Structure’s story to w3.org', () => {
    recordPage.storyQuotations('Structure', '“In case of conflict, consider users over authors over implementors over specifiers over theoretical purity.”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/TR/html-design-principles/'));
  });

  test('should link “continuously updated” in Structure’s story to whatwg.org', () => {
    recordPage.storyQuotations('Structure', '“continuously updated”').forEach(link => expect(link).toHaveAttribute('href', 'https://whatwg.org/faq'));
  });

  test('should link “a single version of HTML going…” in Structure’s story to html.spec.whatwg.org', () => {
    recordPage.storyQuotations('Structure', '“a single version of HTML going forward”').forEach(link => expect(link).toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/introduction.html'));
  });

  test('should link “While the HTML syntax described in…” in Structure’s story to html.spec.whatwg.org', () => {
    recordPage.storyQuotations('Structure', '“While the HTML syntax described in this specification bears a close resemblance to SGML and XML, it is a separate language with its own parsing rules”').forEach(link => expect(link).toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/parsing.html'));
  });

  test('should link “few (if any) web browsers ever…” in Structure’s story to html.spec.whatwg.org', () => {
    recordPage.storyQuotations('Structure', '“few (if any) web browsers ever implemented true SGML parsing for HTML documents”').forEach(link => expect(link).toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/parsing.html'));
  });

  test('should link “defines the parsing rules for HTML…” in Structure’s story to html.spec.whatwg.org', () => {
    recordPage.storyQuotations('Structure', '“defines the parsing rules for HTML documents, whether they are syntactically correct or not”').forEach(link => expect(link).toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/parsing.html'));
  });

  test('should link “for legacy reasons” in Structure’s story to html.spec.whatwg.org', () => {
    recordPage.storyQuotations('Structure', '“for legacy reasons”').forEach(link => expect(link).toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/syntax.html'));
  });

  test('should link “in a lot of different contexts…” in Structure’s story to html.com', () => {
    recordPage.storyQuotations('Structure', '“in a lot of different contexts — desktops, laptops, tablets, mobile phones, RSS readers”').forEach(link => expect(link).toHaveAttribute('href', 'https://html.com/html5/'));
  });

  test('should link “a nestable <SECTION>..</SECTION> element” in Structure’s story to infoq.com', () => {
    recordPage.storyQuotations('Structure', '“a nestable <SECTION>..</SECTION> element”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.infoq.com/news/2011/05/html5-design/'));
  });

  test('should link “widely accepted” in Structure’s story to infoq.com', () => {
    recordPage.storyQuotations('Structure', '“widely accepted”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.infoq.com/news/2011/05/html5-design/'));
  });

  test('should link “built-in keyboard accessibility, roles and states” in Structure’s story to developer.mozilla.org', () => {
    recordPage.storyQuotations('Structure', '“built-in keyboard accessibility, roles and states”').forEach(link => expect(link).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA'));
  });

  test('should link “of last resort” in Structure’s story to html.spec.whatwg.org', () => {
    recordPage.storyQuotations('Structure', '“of last resort”').forEach(link => expect(link).toHaveAttribute('href', 'https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element'));
  });

  test('should end Presentation\'s story with the moments it rests on, each line landing on its moment in the timeline', () => {
    expect(recordPage.storyMomentsHeading('Presentation')).toBeVisible();
    expect(recordPage.storyMomentLines('Presentation')).toEqual(['1994 Authors need control of the look', '1996 The pages need to look the same', '1996 The style sheet needs a standard', '1998 The browsers need to agree', '2002 Someone needs to go first', '2003 The separation needs proof', '2007 The defaults need to agree', '2011 The specification needs its tests', '2013 Someone needs components', '2017 The constants need a home']);
    expect(recordPage.storyMomentLine('Presentation', '1994 Authors need control of the look')).toHaveAttribute('href', `${Paths.record}#authors-need-control-of-the-look`);
    expect(recordPage.storyMomentLine('Presentation', '1996 The pages need to look the same')).toHaveAttribute('href', `${Paths.record}#the-pages-need-to-look-the-same`);
    expect(recordPage.storyMomentLine('Presentation', '1996 The style sheet needs a standard')).toHaveAttribute('href', `${Paths.record}#the-style-sheet-needs-a-standard`);
    expect(recordPage.storyMomentLine('Presentation', '1998 The browsers need to agree')).toHaveAttribute('href', `${Paths.record}#the-browsers-need-to-agree`);
    expect(recordPage.storyMomentLine('Presentation', '2002 Someone needs to go first')).toHaveAttribute('href', `${Paths.record}#someone-needs-to-go-first`);
    expect(recordPage.storyMomentLine('Presentation', '2003 The separation needs proof')).toHaveAttribute('href', `${Paths.record}#the-separation-needs-proof`);
    expect(recordPage.storyMomentLine('Presentation', '2007 The defaults need to agree')).toHaveAttribute('href', `${Paths.record}#the-defaults-need-to-agree`);
    expect(recordPage.storyMomentLine('Presentation', '2011 The specification needs its tests')).toHaveAttribute('href', `${Paths.record}#the-specification-needs-its-tests`);
    expect(recordPage.storyMomentLine('Presentation', '2013 Someone needs components')).toHaveAttribute('href', `${Paths.record}#someone-needs-components`);
    expect(recordPage.storyMomentLine('Presentation', '2017 The constants need a home')).toHaveAttribute('href', `${Paths.record}#the-constants-need-a-home`);
  });

  test('should link “a rendering choice made by the…” in Presentation’s story to 1997.webhistory.org', () => {
    recordPage.storyQuotations('Presentation', '“a rendering choice made by the browser”').forEach(link => expect(link).toHaveAttribute('href', 'http://1997.webhistory.org/www.lists/www-talk.1994q1/0648.html'));
  });

  test('should link “the ‘ha ha, you can’t control…” in Presentation’s story to 1997.webhistory.org', () => {
    recordPage.storyQuotations('Presentation', '“the ‘ha ha, you can’t control what your documents look like in HTML’ philosophy”').forEach(link => expect(link).toHaveAttribute('href', 'http://1997.webhistory.org/www.lists/www-talk.1994q1/0648.html'));
  });

  test('should link “What can you do about it?…” in Presentation’s story to 1997.webhistory.org', () => {
    recordPage.storyQuotations('Presentation', '“What can you do about it? Probably nothing.”').forEach(link => expect(link).toHaveAttribute('href', 'http://1997.webhistory.org/www.lists/www-talk.1994q1/0648.html'));
  });

  test('should link “hordes (literally) of people” in Presentation’s story to 1997.webhistory.org', () => {
    recordPage.storyQuotations('Presentation', '“hordes (literally) of people”').forEach(link => expect(link).toHaveAttribute('href', 'http://1997.webhistory.org/www.lists/www-talk.1994q1/0648.html'));
  });

  test('should link “in ways that would be trivial…” in Presentation’s story to 1997.webhistory.org', () => {
    recordPage.storyQuotations('Presentation', '“in ways that would be trivial in TeX, Microsoft Word, and every other common text processing environment”').forEach(link => expect(link).toHaveAttribute('href', 'http://1997.webhistory.org/www.lists/www-talk.1994q1/0648.html'));
  });

  test('should link “Sorry, you’re screwed.” in Presentation’s story to 1997.webhistory.org', () => {
    recordPage.storyQuotations('Presentation', '“Sorry, you’re screwed.”').forEach(link => expect(link).toHaveAttribute('href', 'http://1997.webhistory.org/www.lists/www-talk.1994q1/0648.html'));
  });

  test('should link “and more tags were to follow…” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“and more tags were to follow shortly”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/Style/LieBos2e/history/Overview.html'));
  });

  test('should link “simply extended HTML to include presentational,…” in Presentation’s story to thehistoryoftheweb.com', () => {
    recordPage.storyQuotations('Presentation', '“simply extended HTML to include presentational, unstandardized HTML tags that could be used to design web pages”').forEach(link => expect(link).toHaveAttribute('href', 'https://thehistoryoftheweb.com/look-back-history-css/'));
  });

  test('should link “it wasn’t long before web pages…” in Presentation’s story to thehistoryoftheweb.com', () => {
    recordPage.storyQuotations('Presentation', '“it wasn’t long before web pages lost all semantic value”').forEach(link => expect(link).toHaveAttribute('href', 'https://thehistoryoftheweb.com/look-back-history-css/'));
  });

  test('should link “leaned on HTML data tables (or…” in Presentation’s story to thehistoryoftheweb.com', () => {
    recordPage.storyQuotations('Presentation', '“leaned on HTML data tables (or spacer gifs), which allowed them to lay things out to exact dimensions”').forEach(link => expect(link).toHaveAttribute('href', 'https://thehistoryoftheweb.com/the-rise-of-css/'));
  });

  test('should link “at one time, not using CSS…” in Presentation’s story to thehistoryoftheweb.com', () => {
    recordPage.storyQuotations('Presentation', '“at one time, not using CSS was actually a best practice.”').forEach(link => expect(link).toHaveAttribute('href', 'https://thehistoryoftheweb.com/the-rise-of-css/'));
  });

  test('should link “had realized that HTML would and…” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“had realized that HTML would and should never turn into a page description language and that a more purpose-built mechanism was needed to satisfy requirements from authors”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/Style/LieBos2e/history/Overview.html'));
  });

  test('should link “stylistic influence without resorting to page…” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“stylistic influence without resorting to page description languages”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/People/howcome/p/cascade.html'));
  });

  test('should link “if conflicts arise the user should…” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“if conflicts arise the user should have the last word, but one should also allow the author to attach style hints”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/People/howcome/p/cascade.html'));
  });

  test('should link “combined, or ‘cascaded,’ in some way” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“combined, or ‘cascaded,’ in some way”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/Style/LieBos2e/history/Overview.html'));
  });

  test('should link “authors can attach a preferred style…” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“authors can attach a preferred style sheet, while the reader may have a personal style sheet”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/TR/REC-CSS1-961217'));
  });

  test('should link “had been sceptical towards style sheets” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“had been sceptical towards style sheets”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/Style/LieBos2e/history/Overview.html'));
  });

  test('should link “translating CSS rules into snippets of…” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“translating CSS rules into snippets of Javascript”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/Style/LieBos2e/history/Overview.html'));
  });

  test('should link “did not have time to fully…” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“did not have time to fully test”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/Style/LieBos2e/history/Overview.html'));
  });

  test('should link “thereby bypassing CSS entirely” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“thereby bypassing CSS entirely”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/Style/LieBos2e/history/Overview.html'));
  });

  test('should link “the chaotic years of mixed browser…” in Presentation’s story to thehistoryoftheweb.com', () => {
    recordPage.storyQuotations('Presentation', '“the chaotic years of mixed browser support, CSS became pretty unpopular among web designers”').forEach(link => expect(link).toHaveAttribute('href', 'https://thehistoryoftheweb.com/the-rise-of-css/'));
  });

  test('should link “to the effort of identifying more…” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“to the effort of identifying more than five hundred testable statements in the CSS1 specification”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/Style/CSS/Test/CSS1/current/tsack.html'));
  });

  test('should link “All discrepancies should be traceable to…” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“All discrepancies should be traceable to CSS1 implementation shortcomings.”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/Style/CSS/Test/CSS1/current/test5526c.htm'));
  });

  test('should link “the first browser with full CSS…” in Presentation’s story to thehistoryoftheweb.com', () => {
    recordPage.storyQuotations('Presentation', '“the first browser with full CSS Level 1 support”').forEach(link => expect(link).toHaveAttribute('href', 'https://thehistoryoftheweb.com/look-back-history-css/'));
  });

  test('should link “using no tables to lay out…” in Presentation’s story to meyerweb.com', () => {
    recordPage.storyQuotations('Presentation', '“using no tables to lay out the page, but instead applying CSS to XHTML”').forEach(link => expect(link).toHaveAttribute('href', 'https://meyerweb.com/eric/thoughts/2002/10/11/wired-with-standards/'));
  });

  test('should link “draws between 20 and 25 million…” in Presentation’s story to the archived devedge.netscape.com', () => {
    recordPage.storyQuotations('Presentation', '“draws between 20 and 25 million page views every month”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/2003/http://devedge.netscape.com/viewsource/2002/wired-interview/'));
  });

  test('should link “nesting them in intricate ways to…” in Presentation’s story to the archived devedge.netscape.com', () => {
    recordPage.storyQuotations('Presentation', '“nesting them in intricate ways to produce any layout or effect that could be imagined”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/2003/http://devedge.netscape.com/viewsource/2002/wired-interview/'));
  });

  test('should link “A few changes to the CSS…” in Presentation’s story to the archived devedge.netscape.com', () => {
    recordPage.storyQuotations('Presentation', '“A few changes to the CSS can completely alter the presentation of thousands of pages.”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/2003/http://devedge.netscape.com/viewsource/2002/wired-interview/'));
  });

  test('should link “as much as 14% of our…” in Presentation’s story to the archived devedge.netscape.com', () => {
    recordPage.storyQuotations('Presentation', '“as much as 14% of our users”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/2003/http://devedge.netscape.com/viewsource/2002/wired-interview/'));
  });

  test('should link “You may modify the style sheet…” in Presentation’s story to csszengarden.com', () => {
    recordPage.storyQuotations('Presentation', '“You may modify the style sheet in any way you wish, but not the HTML.”').forEach(link => expect(link).toHaveAttribute('href', 'https://csszengarden.com/'));
  });

  test('should link “the widespread perception of CSS was…” in Presentation’s story to csszengarden.com', () => {
    recordPage.storyQuotations('Presentation', '“the widespread perception of CSS was as a language capable only of boxy and boring design”').forEach(link => expect(link).toHaveAttribute('href', 'https://csszengarden.com/pages/about/'));
  });

  test('should link “to show their bosses and clients…” in Presentation’s story to thehistoryoftheweb.com', () => {
    recordPage.storyQuotations('Presentation', '“to show their bosses and clients what CSS could do”').forEach(link => expect(link).toHaveAttribute('href', 'https://thehistoryoftheweb.com/the-rise-of-css/'));
  });

  test('should link “Cascading Style Sheets Standard Boasts Unprecedented…” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“Cascading Style Sheets Standard Boasts Unprecedented Interoperability”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/2011/05/css-pr.html.en'));
  });

  test('should link “it took many years for implementations…” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“it took many years for implementations and the specification to converge”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/2011/05/css-pr.html.en'));
  });

  test('should link “More than 9000 CSS tests have…” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“More than 9000 CSS tests have made it easier for designers to create style sheets that work across browsers, and across devices.”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/2011/05/css-pr.html.en'));
  });

  test('should link “expects future additions to CSS to…” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“expects future additions to CSS to be organized as independent modules, allowing smaller, more focused feature sets to progress and stabilize at their own pace”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/2011/05/css-pr.html.en'));
  });

  test('should link “attempts to show that CSS has…” in Presentation’s story to blog.vjeux.com', () => {
    recordPage.storyQuotations('Presentation', '“attempts to show that CSS has fundamental flaws and writing styling in JS solves most of the problem without even trying”').forEach(link => expect(link).toHaveAttribute('href', 'https://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html'));
  });

  test('should link “the styles defined in the shadow…” in Presentation’s story to developer.mozilla.org', () => {
    recordPage.storyQuotations('Presentation', '“the styles defined in the shadow DOM tree are scoped to that tree, so just as page styles don’t affect elements in the shadow DOM, shadow DOM styles don’t affect elements in the rest of the page”').forEach(link => expect(link).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM'));
  });

  test('should link “works across the latest devices and…” in Presentation’s story to developer.mozilla.org', () => {
    recordPage.storyQuotations('Presentation', '“works across the latest devices and browser versions”').forEach(link => expect(link).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@scope'));
  });

  test('should link “to visual browsers, aural devices, printers,…” in Presentation’s story to w3.org', () => {
    recordPage.storyQuotations('Presentation', '“to visual browsers, aural devices, printers, braille devices, handheld devices”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.w3.org/TR/1998/REC-CSS2-19980512/'));
  });

  test('should link “dramatically more accessible, without much concentrated…” in Presentation’s story to the archived devedge.netscape.com', () => {
    recordPage.storyQuotations('Presentation', '“dramatically more accessible, without much concentrated effort at making it so”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/2003/http://devedge.netscape.com/viewsource/2002/wired-interview/'));
  });

  test('should end Behavior\'s story with the moments it rests on, each line landing on its moment in the timeline', () => {
    expect(recordPage.storyMomentsHeading('Behavior')).toBeVisible();
    expect(recordPage.storyMomentLines('Behavior')).toEqual(['1995 Pages need to respond', '1997 The language needs a standard', '2005 The page needs to update in place', '2009 The standard needs to move again', '2010 The application needs a frame', '2013 Someone needs components', '2016 The document needs to come first']);
    expect(recordPage.storyMomentLine('Behavior', '1995 Pages need to respond')).toHaveAttribute('href', `${Paths.record}#pages-need-to-respond`);
    expect(recordPage.storyMomentLine('Behavior', '1997 The language needs a standard')).toHaveAttribute('href', `${Paths.record}#the-language-needs-a-standard`);
    expect(recordPage.storyMomentLine('Behavior', '2005 The page needs to update in place')).toHaveAttribute('href', `${Paths.record}#the-page-needs-to-update-in-place`);
    expect(recordPage.storyMomentLine('Behavior', '2009 The standard needs to move again')).toHaveAttribute('href', `${Paths.record}#the-standard-needs-to-move-again`);
    expect(recordPage.storyMomentLine('Behavior', '2010 The application needs a frame')).toHaveAttribute('href', `${Paths.record}#the-application-needs-a-frame`);
    expect(recordPage.storyMomentLine('Behavior', '2013 Someone needs components')).toHaveAttribute('href', `${Paths.record}#someone-needs-components`);
    expect(recordPage.storyMomentLine('Behavior', '2016 The document needs to come first')).toHaveAttribute('href', `${Paths.record}#the-document-needs-to-come-first`);
  });

  test('should link “the lack of programmability of Web…” in Behavior’s story to the archived www.computerworld.com', () => {
    recordPage.storyQuotations('Behavior', '“the lack of programmability of Web pages made them static, text-heavy, with at best images in tables or floating on the right or left”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html'));
  });

  test('should link “amateur or pro, who would write…” in Behavior’s story to brendaneich.com', () => {
    recordPage.storyQuotations('Behavior', '“amateur or pro, who would write code directly embedded in HTML”').forEach(link => expect(link).toHaveAttribute('href', 'https://brendaneich.com/2008/04/popularity/'));
  });

  test('should link “glue language” in Behavior’s story to the archived www.computerworld.com', () => {
    recordPage.storyQuotations('Behavior', '“glue language”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html'));
  });

  test('should link “the Web designers and part time…” in Behavior’s story to the archived www.computerworld.com', () => {
    recordPage.storyQuotations('Behavior', '“the Web designers and part time programmers who were building Web content from components such as images, plugins, and Java applets”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html'));
  });

  test('should link “buy it by the yard” in Behavior’s story to infoworld.com', () => {
    recordPage.storyQuotations('Behavior', '“buy it by the yard”').forEach(link => expect(link).toHaveAttribute('href', 'https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html'));
  });

  test('should link “even in late 1995” in Behavior’s story to the archived www.computerworld.com', () => {
    recordPage.storyQuotations('Behavior', '“even in late 1995”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html'));
  });

  test('should link “the means to communicate with servers…” in Behavior’s story to the archived www.computerworld.com', () => {
    recordPage.storyQuotations('Behavior', '“the means to communicate with servers generally involved reloading whole Web pages”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html'));
  });

  test('should link “These differences made it difficult for…” in Behavior’s story to en.wikipedia.org', () => {
    recordPage.storyQuotations('Behavior', '“These differences made it difficult for developers to make their websites work well in both browsers”').forEach(link => expect(link).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/JavaScript'));
  });

  test('should link “In November 1996, Netscape submitted JavaScript…” in Behavior’s story to en.wikipedia.org', () => {
    recordPage.storyQuotations('Behavior', '“In November 1996, Netscape submitted JavaScript to Ecma International, as the starting point for a standard specification that all browser vendors could conform to”').forEach(link => expect(link).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/JavaScript'));
  });

  test('should link “forced premature standardization after a furious…” in Behavior’s story to the archived www.computerworld.com', () => {
    recordPage.storyQuotations('Behavior', '“forced premature standardization after a furious period of innovation”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html'));
  });

  test('should link “codifies just the core language, not…” in Behavior’s story to the archived www.computerworld.com', () => {
    recordPage.storyQuotations('Behavior', '“codifies just the core language, not the DOM”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html'));
  });

  test('should link “the programming language that is supported…” in Behavior’s story to 262.ecma-international.org', () => {
    recordPage.storyQuotations('Behavior', '“the programming language that is supported by essentially all web browsers”').forEach(link => expect(link).toHaveAttribute('href', 'https://262.ecma-international.org/5.1/'));
  });

  test('should link “have a richness and responsiveness that…” in Behavior’s story to the archived www.adaptivepath.com', () => {
    recordPage.storyQuotations('Behavior', '“have a richness and responsiveness that has seemed out of reach on the Web”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php'));
  });

  test('should link “the user waits some more” in Behavior’s story to the archived www.adaptivepath.com', () => {
    recordPage.storyQuotations('Behavior', '“the user waits some more”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php'));
  });

  test('should link “JavaScript binding everything together” in Behavior’s story to the archived www.adaptivepath.com', () => {
    recordPage.storyQuotations('Behavior', '“JavaScript binding everything together”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php'));
  });

  test('should link “Neither Adaptive Path nor Google invented…” in Behavior’s story to the archived www.adaptivepath.com', () => {
    recordPage.storyQuotations('Behavior', '“Neither Adaptive Path nor Google invented Ajax”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php'));
  });

  test('should link “the prominent use of these techniques…” in Behavior’s story to the archived www.adaptivepath.com', () => {
    recordPage.storyQuotations('Behavior', '“the prominent use of these techniques in real-world applications to change the fundamental interaction model of the Web”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php'));
  });

  test('should link “smooths over the rough edges of…” in Behavior’s story to prototypejs.org', () => {
    recordPage.storyQuotations('Behavior', '“smooths over the rough edges of cross-browser development”').forEach(link => expect(link).toHaveAttribute('href', 'http://prototypejs.org/'));
  });

  test('should link “an easy-to-use API that works across…” in Behavior’s story to jquery.com', () => {
    recordPage.storyQuotations('Behavior', '“an easy-to-use API that works across a multitude of browsers”').forEach(link => expect(link).toHaveAttribute('href', 'https://jquery.com/'));
  });

  test('should link “JS was the tap root.” in Behavior’s story to the archived www.computerworld.com', () => {
    recordPage.storyQuotations('Behavior', '“JS was the tap root.”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/20191215100745/https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html'));
  });

  test('should link “falters when we try to use…” in Behavior’s story to angularjs.org', () => {
    recordPage.storyQuotations('Behavior', '“falters when we try to use it for declaring dynamic views in web-applications”').forEach(link => expect(link).toHaveAttribute('href', 'https://angularjs.org/'));
  });

  test('should link “two-way data-binding that allowed for the…” in Behavior’s story to en.wikipedia.org', () => {
    recordPage.storyQuotations('Behavior', '“two-way data-binding that allowed for the automatic synchronization of models and views”').forEach(link => expect(link).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/AngularJS'));
  });

  test('should link “a lightweight description of what the…” in Behavior’s story to legacy.reactjs.org', () => {
    recordPage.storyQuotations('Behavior', '“a lightweight description of what the DOM should look like”').forEach(link => expect(link).toHaveAttribute('href', 'https://legacy.reactjs.org/blog/2013/06/05/why-react.html'));
  });

  test('should link “the amount of JavaScript required tends…” in Behavior’s story to web.dev', () => {
    recordPage.storyQuotations('Behavior', '“the amount of JavaScript required tends to grow as an application grows.”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.dev/rendering-on-the-web/'));
  });

  test('should link “A split committee is good for…” in Behavior’s story to the archived mail.mozilla.org', () => {
    recordPage.storyQuotations('Behavior', '“A split committee is good for no one and nothing, least of all any language specs that might come out of it”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/2015/https://mail.mozilla.org/pipermail/es-discuss/2008-August/006837.html'));
  });

  test('should link “target two interoperable implementations by early…” in Behavior’s story to the archived mail.mozilla.org', () => {
    recordPage.storyQuotations('Behavior', '“target two interoperable implementations by early next year”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.archive.org/web/2015/https://mail.mozilla.org/pipermail/es-discuss/2008-August/006837.html'));
  });

  test('should link “Two compatible implementations which pass the…” in Behavior’s story to tc39.es', () => {
    recordPage.storyQuotations('Behavior', '“Two compatible implementations which pass the Test262 acceptance tests”').forEach(link => expect(link).toHaveAttribute('href', 'https://tc39.es/process-document/'));
  });

  test('should link “a small framework for server-rendered universal…” in Behavior’s story to vercel.com', () => {
    recordPage.storyQuotations('Behavior', '“a small framework for server-rendered universal JavaScript webapps”').forEach(link => expect(link).toHaveAttribute('href', 'https://vercel.com/blog/next'));
  });

  test('should link “render HTML pages on the server,…” in Behavior’s story to jasonformat.com', () => {
    recordPage.storyQuotations('Behavior', '“render HTML pages on the server, and inject placeholders or slots around highly dynamic regions”').forEach(link => expect(link).toHaveAttribute('href', 'https://jasonformat.com/islands-architecture/'));
  });

  test('should link “individual regions of the page become…” in Behavior’s story to jasonformat.com', () => {
    recordPage.storyQuotations('Behavior', '“individual regions of the page become interactive without anything else on the page needing to be loaded first”').forEach(link => expect(link).toHaveAttribute('href', 'https://jasonformat.com/islands-architecture/'));
  });

  test('should link “to which we’re essentially adding SSR…” in Behavior’s story to jasonformat.com', () => {
    recordPage.storyQuotations('Behavior', '“to which we’re essentially adding SSR hydration”').forEach(link => expect(link).toHaveAttribute('href', 'https://jasonformat.com/islands-architecture/'));
  });

  test('should link “encourage developers to consider server-side rendering…” in Behavior’s story to web.dev', () => {
    recordPage.storyQuotations('Behavior', '“encourage developers to consider server-side rendering or static rendering over a full rehydration approach”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.dev/rendering-on-the-web/'));
  });

  test('should link “It’s fine to mostly ship HTML…” in Behavior’s story to web.dev', () => {
    recordPage.storyQuotations('Behavior', '“It’s fine to mostly ship HTML with minimal JavaScript to get an experience interactive.”').forEach(link => expect(link).toHaveAttribute('href', 'https://web.dev/rendering-on-the-web/'));
  });
});

describe('the period samples', () => {
  beforeEach(async () => {
    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();
  });

  test('should reach Netscape’s markup of 1996 by Tab once its moment’s fuller story is open', async () => {
    const story = 'The pages need to look the same, and the style sheet needs a standard';

    await recordPage.openFullerStory(story);

    expect(await recordPage.tabStopsIn(story)).toContain(recordPage.periodSample('Netscape’s markup of 1996: columns and a font as tags'));
  });

  test('should reach each of Lie’s 1994 samples by Tab once the 1994 moment’s fuller story is open', async () => {
    const story = 'Authors need control of the look';

    await recordPage.openFullerStory(story);

    expect(await recordPage.tabStopsIn(story)).toEqual(expect.arrayContaining([
      recordPage.periodSample('Lie’s 1994 draft: a heading’s size with its influence'),
      recordPage.periodSample('Lie’s 1994 draft: sliders between user and author'),
      recordPage.periodSample('Lie’s 1994 draft: two style sheets weighed against each other'),
      recordPage.periodSample('Lie’s 1994 draft: a property computed from another'),
      recordPage.periodSample('Lie’s 1994 draft: rules that read the world outside the document'),
      recordPage.periodSample('Lie’s 1994 draft: weights for speech')
    ]));
  });
});

describe('the research shelf and the Practice page', () => {
  test('should shelve every source the Practice page’s opening links to', async () => {
    const {unmount} = render(<TestApp at={Paths.practice}/>);
    await practicePage.opener();
    const linked = practicePage.openingSources();
    unmount();

    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();

    expect(linked).not.toEqual([]);
    expect(linked.filter(source => !recordPage.shelvedSources().includes(source))).toEqual([]);
  });
});

describe('the research shelf and the Practice tabs', () => {
  test('should shelve every source the Structure tab links to', async () => {
    const {unmount} = render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');
    const linked = practicePage.sourcesLinked();
    unmount();

    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();

    expect(linked).not.toEqual([]);
    expect(linked.filter(source => !recordPage.shelvedSources().includes(source))).toEqual([]);
  });

  test('should shelve every source the Presentation tab links to', async () => {
    const {unmount} = render(<TestApp at={practiceAt('presentation')}/>);
    await practicePage.arrivedOn('Presentation');
    const linked = practicePage.sourcesLinked();
    unmount();

    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();

    expect(linked).not.toEqual([]);
    expect(linked.filter(source => !recordPage.shelvedSources().includes(source))).toEqual([]);
  });

  test('should shelve every source the Behavior tab links to', async () => {
    const {unmount} = render(<TestApp at={practiceAt('behavior')}/>);
    await practicePage.arrivedOn('Behavior');
    const linked = practicePage.sourcesLinked();
    unmount();

    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();

    expect(linked).not.toEqual([]);
    expect(linked.filter(source => !recordPage.shelvedSources().includes(source))).toEqual([]);
  });
});

describe('the research shelf and the home page', () => {
  test('should shelve every source the home page links to', async () => {
    const {unmount} = render(<TestApp at={Paths.home}/>);
    await homePage.arrived();
    const linked = homePage.sourcesLinked();
    unmount();

    render(<TestApp at={Paths.record}/>);
    await recordPage.arrived();

    expect(linked).not.toEqual([]);
    expect(linked.filter(source => !recordPage.shelvedSources().includes(source))).toEqual([]);
  });
});
