import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {itemHeadedBy} from '@__test_support/headed-item';
import {render, screen, waitFor, within} from '@testing-library/react';
import {Paths} from '@pages/Paths';

const shelvedAs = (work: string): HTMLElement => {
  const entry = within(screen.getByRole('region', {name: 'The research'})).getAllByRole('listitem', {hidden: true})
    .find(candidate => within(candidate).queryByRole('link', {name: work, hidden: true}) !== null);
  if (entry) {
    return entry;
  }
  throw new Error(`no work on the research shelf named ${work}`);
};

describe('the 1989 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'Several thousand people at CERN, two-year stays, and what one project learned “sometimes lost forever, or only recovered after a detective investigation in an emergency”. Tim Berners-Lee proposed a web of notes with links between them, shaped like the organisation that would use it.',
    'Berners-Lee wrote the proposal in March 1989 to answer a practical question: how several thousand people at CERN, spread across institutes and experiments and staying about two years each, could share what they knew. Knowledge moved by corridor talk and newsletters, which worked until people left; “often, the information has been recorded, it just cannot be found.” He took CERN as a small model of what every large organisation would soon face.',
    'He had built the answer once already. In 1980 he wrote Enquire, a program that stored notes and linked them to each other in any way, so finding something meant following links “rather like in the old computer game ‘adventure’”. He built it before he knew the idea had a name, hypertext; the proposal credits Ted Nelson with the word.',
    'The argument is against trees. CERNDOC, the Unix file system and VMS HELP each forced knowledge into one hierarchy, and work does not connect that way. His alternative was a diagram anyone could draw, circles and arrows, where “circles and arrows can stand for anything”: a person, a project, a document, a piece of hardware, joined by links that say depends on, is part of, uses, refers to. The first web in the document is the organisation itself, “a multiply connected ‘web’”, and the system had to match it. That is what set it apart from CERNDOC, a document system that lived on one central machine, and from every scheme that asked physicists to file their work one prescribed way; he had watched those fail, and wrote later that the rules had to be “as close as possible to no rules at all”. The proposal makes it a requirement: systems “start isolated and then merge”, so “a new system must allow existing systems to be linked together without requiring any central control or coordination.”',
    'Most of the document is requirements, and they are the ones the web kept: access from remote machines, the same data on VM, Macintosh, VAX and Unix, existing databases shown as hypertext, private links a reader can add, plain text on a 24-by-80 screen before any graphics, and a defined interface between the software that stores and the software that shows, so servers and browsers could be built in parallel. The conclusion asked for a universal linked information system in which “generality and portability are more important than fancy graphics techniques”, and the plan was two people for six to twelve months. Nothing in it was called World Wide Web; Berners-Lee later wrote that the only name he had for it then was Mesh. His manager, Mike Sendall, pencilled on the cover a note quoted ever since: “Vague, but exciting.”'
  ])('should tell the proposal as the practical case it is, words and links together: %s', told => {
    expect(screen.getByRole('region', {name: 'How the web got its languages'})).toHaveTextContent(told);
  });

  test.each(['measuring the loss', 'walked out the door', 'is not about technology at all', 'the opposite of excitement'])('should leave out the lament "%s"', lament => {
    expect(screen.getByRole('region', {name: 'How the web got its languages'})).not.toHaveTextContent(lament);
  });

  test('should link the book’s words to the page that quotes them, and shelve the book', () => {
    expect(screen.getByRole('link', {name: '“as close as possible to no rules at all”', hidden: true})).toHaveAttribute('href', 'https://www.ppd.stfc.ac.uk/news/unravelling-the-web-how-particle-physics-launched-the-invention-that-changed-the-world/');
    expect(within(screen.getByRole('region', {name: 'The research'})).getByRole('link', {name: 'Weaving the Web', hidden: true})).toBeInTheDocument();
  });
});

describe('the 1990 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'In November 1990 Tim Berners-Lee and Robert Cailliau proposed “WorldWideWeb (or W3)”, and Berners-Lee wrote the server and the browser. HTML’s tags came from CERN’s SGML guide, so the documents world would recognise them. The one tag of his own was the anchor, an idea hypertext already had; the new thing was what his could carry, the address of a document on another machine.',
    'The second proposal came in November 1990, twenty months after the first, and Robert Cailliau wrote it with him. It names the need from the reader’s side: CERN’s information sat in systems that could not read each other, and “the current incompatibilities of the platforms and tools make it impossible to access existing information through a common interface”. The answer was hypertext, defined in the sentence this page opens with, and a scheme in which the stores CERN already had, among them its news and file servers, could be read through one browser as one web. The document names the project “WorldWideWeb (or W3)”, asks for “4 software engineers and a programmer”, and plans two phases of three months each: first browsers for dumb terminals, the Macintosh and the NeXT, with a server “which may be installed on any machine to allow files on that machine to be accessed as hypertext”; then editing, at which point “authorship becomes universal”. It gives the software away “free of charge to anyone”, and lists what it will not do, among it “research into fancy multimedia facilities such as sound and video”.',
    'Links inside a document were already for sale; the proposal budgets licences for Guide and KMS, two commercial hypertext systems. The new thing fits in one line: “Nodes do not need to be on the same machine: links may point across machine boundaries.” A link is an address a browser knows how to fetch, so each server serves its own documents and nothing more; the proposal says the server “has nothing to know about other servers or other webs and can be kept simple”. That is the 1989 requirement, no central control, carried into the design. The anchor as first written had three attributes: HREF, NAME, and a TYPE for the relationship a link describes, the job rel does today, whose values were to be “registered by the W3 team”.',
    'The protocol was almost nothing. A client sent “a line of ASCII characters terminated by a CR LF”, which “consists of the word "GET", a space, the document address”, and the server answered with the document; “the message is terminated by the closing of the connection by the server.” There was no status line, so an error came back as another page; the specification says “there is no way to distinguish an error response from a satisfactory response except for the content of the text.” The page that preserves it calls this HTTP 0.9.',
    'The earliest surviving list of tags is short. It has a title, the anchor, the paragraph, six levels of heading, an address, a glossary and three kinds of list, with tags for an index node, plain text and example sections, and two more, a base address and highlighting, marked not currently used. There is no html, head or body, no img, and no tag for an ordered list. The headings were kept as CERN’s SGML guide defined them, and the page says their definition is “completely historical, deriving from the AAP tag set”. The file keeps the editor’s fingerprint too: a NEXTID tag “read and generated by hypertext editors”, because the first program, WorldWideWeb on a NeXT machine, “was a browser and editor”. Links opened on a double click because “a single click was used for editing”. CERN’s history of the browser says it “was later renamed Nexus to avoid confusion with the World Wide Web project”, and the program’s central expectation failed: “it turned out that people were quite happy to write HTML by hand”, something Berners-Lee and his colleagues had not expected.'
  ])('should tell the second proposal from its sources, words and links together: %s', told => {
    expect(screen.getByRole('region', {name: 'How the web got its languages'})).toHaveTextContent(told);
  });

  test.each(['HyperCard', 'eighteen'])('should leave out "%s", which the sources do not hold', claim => {
    expect(itemHeadedBy('the timeline', 'Researchers need to collaborate')).not.toHaveTextContent(claim);
  });
});

describe('the 1991 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'On 6 August 1991 Berners-Lee answered a question on the alt.hypertext newsgroup, and an hour later posted a summary of the project. Both gave the address of info.cern.ch, where the browser, the editor, the server and the documentation sat for anyone to fetch. HTML left the lab before it had a specification, as a list of tags and a working program.',
    'Someone had asked the group whether anyone knew of work on hypertext links that could retrieve from many different sources. Berners-Lee’s reply is the web’s answer. The project “aims to allow links to be made to any information anywhere”; its address format carries an access method, a hostname and a path, so one link could reach a local file, an FTP archive or an HTTP server. There was a prototype editor for the NeXT and a line-mode browser that “runs on almost anything”, a server on CERN’s mainframe that served the computer centre’s documentation, and code “available by anonymous FTP from info.cern.ch”, “copyright CERN but free distribution and use is not normally a problem”. The project, he wrote, “was started to allow high energy physicists to share data, news, and documentation”, and then: “Collaborators welcome!” A newsgroup is a public discussion board that predates the web; alt.hypertext was the one for people who cared about linked documents.',
    'The summary he posted an hour later says what the project was for and how to join it. It “started with the philosophy that much academic information should be freely available to anyone”. For a reader there were two operations, following a link and giving keywords, and “these are the only operations necessary to access the entire world of data”. For a provider, “making a web is as simple as writing a few SGML files which point to your existing data”, and “any file available by anonymous FTP can be immediately linked into a web”; “the very small start-up effort is designed to allow small contributions.” The markup was SGML because SGML was standard, and the reply had already said what he thought of it: “SGML (ugh! but standard)”. The tags themselves were the “Tags used in HTML” document, the list the 1990 moment reads, with no specification behind it beyond the program that read it.',
    'W3C’s history lists the browser going to a limited audience in March and to CERN’s central machines in May; the August postings are the first it lists beyond CERN. In October the project started its mailing lists, www-talk among them, and the record of HTML from then on is a record of that list. In December Paul Kunz installed the first server outside Europe, at SLAC. The history counts “Around 50 known HTTP servers” in January 1993 and “Over 200 known HTTP servers” by October, the month after NCSA released “working versions of Mosaic browser for all common platforms: X, PC/Windows and Macintosh”; between the two counts, on 30 April 1993, CERN’s directors declared the technology “freely usable by anyone, with no fees being payable to CERN”. Every one of those servers was serving HTML that no standard yet defined; HTML 2.0, in 1995, is the answer to that.'
  ])('should tell a question, an answer, a summary and the count of servers, words and links together: %s', told => {
    expect(itemHeadedBy('the timeline', 'The web needs the public')).toHaveTextContent(told);
  });

  test.each(['It closes with two words', 'the earliest public announcement', 'the list the 1990 moment counts'])('should leave out "%s", which the sources do not hold', claim => {
    expect(itemHeadedBy('the timeline', 'The web needs the public')).not.toHaveTextContent(claim);
  });

  test('should link the summary’s words to the summary, and shelve it beside the reply', () => {
    expect(within(itemHeadedBy('the timeline', 'The web needs the public')).getByRole('link', {name: '“the very small start-up effort is designed to allow small contributions.”', hidden: true})).toHaveAttribute('href', 'https://www.w3.org/People/Berners-Lee/1991/08/art-6487.txt');
    expect(within(screen.getByRole('region', {name: 'The research'})).getByRole('link', {name: 'WorldWideWeb: Summary, posted to alt.hypertext', hidden: true})).toBeInTheDocument();
  });
});

describe('the 1994 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'Håkon Wium Lie drafted Cascading HTML Style Sheets in October 1994, encouraged by Dave Raggett, who had realized HTML should never become a page-description language. The draft gave the author and the reader the same notation and a share of influence each. At Chicago some argued style needed a full programming language; CSS went the other way, a simple declarative format on purpose.',
    'Style sheets were older than CSS. Berners-Lee’s NeXT browser took its look from a simple style sheet, but he did not publish the syntax, “considering it a matter for each browser to decide how to best display pages to its users”. Pei Wei’s Viola had a style language in 1992, the Harmony browser had one in 1993, and Robert Raisch of O’Reilly had written a proposal in June 1993. NCSA Mosaic, the browser that made the web popular, went the other way; Lie and Bos call it “a backwards step as it only allowed its users to change certain colors and fonts”. Authors new to the web asked first how to change fonts and colours, and HTML did not let them.',
    'One thread on the www-talk list in February 1994 shows the need as it was felt. Paul Wain of Brunel University had generated menus nested four deep; Lynx drew them as he expected, Mosaic put a blank line in, and he asked whether that was a bug in Mosaic and, if not, how he would go about it. Marc Andreessen, one of Mosaic’s programmers, answered that it was “a rendering choice made by the browser”, mocked “the ‘ha ha, you can’t control what your documents look like in HTML’ philosophy”, and told him: “What can you do about it? Probably nothing.” Then came the line Lie and Bos quote for the tension between authors and implementors, about the “hordes (literally) of people” who wanted to control what their documents looked like “in ways that would be trivial in TeX, Microsoft Word, and every other common text processing environment”: “Sorry, you’re screwed.”',
    'Lie published the draft on 10 October 1994. Dave Raggett, the main architect of HTML 3.0, had encouraged him to get it out before the “Mosaic and the Web” conference in Chicago, because he “had realized that HTML would and should never turn into a page description language and that a more purpose-built mechanism was needed to satisfy requirements from authors”. The draft calls itself version 0.92 and “incomplete as a basis for implementation”; its stated purpose was “to establish guiding principles and propose a level of functionality for HTML style sheets”. Three days later Andreessen announced on www-talk the first beta of Mozilla, which became Netscape Navigator, and its answer to the same authors was new tags, center among them, “and more tags were to follow shortly”.',
    'The draft names both parties and promises each something: readers “a richer visual (or auditory and tactile) environment while they retain control if necessary”, authors and publishers “stylistic influence without resorting to page description languages”. It says who wins a conflict: “if conflicts arise the user should have the last word, but one should also allow the author to attach style hints.”',
    'The first cascade settled conflicts by arithmetic. Each statement asked for a percentage of influence. The user’s sheet came first and could claim all of it or, more likely, hand most of it on to the sheets the document linked; where two sheets set the same property, the browser took a weighted average:',
    'Forty percent left sixty for sheets later in the cascade. Lie named the open problem himself: for a discrete value like a font family, “it may not be obvious how to mix 40% helvetica and 60% times”. His own example sheet carries the comment “# first, redefine influence to dictatorship”.',
    'The draft draws the settlement as a control, a “fictitious screen shot”, in ASCII, of sliders between user and author:',
    'Whole sheets could carry weights against each other, so a sheet that set nothing of its own could take 30 percent of one newspaper’s look and 70 of another’s:',
    'A property could be computed from another, which CSS would not offer again until calc():',
    'Statements could read the world outside the document: a page could yellow with age like paper, a tall display could pick a different newspaper’s sheet, and a headline could grow when an agent judged the story relevant to the reader, which Lie brought from his work on personalized newspapers at the MIT Media Laboratory:',
    'The conditionals did not survive. A media query tests the display the same way today.',
    'The screen was only “the primary presentation target”; HTML could serve “paper, speech and braille”, and the draft styles speech with volume in decibels:',
    'CSS2’s aural style sheets followed in 1998.',
    'Bert Bos answered the draft. He was building Argo, a browser for scholars in the humanities, with a style language general enough to apply to other markup languages than HTML, and the two joined forces; that generality became a goal of CSS, and “HTML” came out of the title. There were other proposals, Wei’s, Raisch’s and DSSSL, the ISO language for printing SGML, and Lie and Bos name the one thing that set theirs apart: on the web the look of a document could not be designed by the author or the reader alone, so their wishes, and the capabilities of the device and the browser, had to be “combined, or ‘cascaded,’ in some way”.',
    'Lie presented the draft at the Chicago conference’s Developer’s Day. Lie and Bos write that a balance between author and user preferences “was novel”, and that some found CSS “too simple for the task it was designed for” and argued that “the power of a full programming language was needed”. The draft had already answered: a style sheet lacks compound statements, variables and and/or, and its statements are “declarations of constraints”. Lie counted the field later, in his thesis: between 1993 and 1996 “nine different style sheet languages were proposed for the web”, eight of them in web forums, mainly on www-talk, and one in an academic paper, PSL96, which had the functions and conditional statements CSS had refused; “with the exception of PSL96, all proposals were either quite simple from the outset, or simplified subsets of style sheet languages developed before the web”, and two of the nine, his and Bos’s, “formed the basis for CSS”.',
    'The same year Berners-Lee founded the World Wide Web Consortium at MIT’s Laboratory for Computer Science, a body whose members, governments, businesses, universities and individuals, write the recommendations that keep the browsers converging; W3C’s history lists the MIT and CERN agreement in July 1994, the founding on 1 October, and the first consortium meeting at MIT on 14 December. Presentation got its own language the same year the web got its own standards body, the W3C.'
  ])('should tell the draft once, as one moment, words and links together: %s', told => {
    expect(itemHeadedBy('the timeline', 'Authors need control of the look')).toHaveTextContent(told);
  });

  test.each([
    'h1.font.size = 24pt 100%',
    'Font   o-----x--------------o 64%',
    'http://NYT.com/style 30%',
    'h1.font.size = font.size * 3',
    'AGE > 3d ? background.color = pale_yellow : background.color = white',
    'speech.*.weight = 35db'
  ])('should show the draft’s own notation: %s', sample => {
    expect(within(itemHeadedBy('the timeline', 'Authors need control of the look')).getAllByRole('code', {hidden: true}).map(code => code.textContent).join('\n')).toContain(sample);
  });

  test('should link the thesis’s words to the thesis, and shelve it', () => {
    expect(within(itemHeadedBy('the timeline', 'Authors need control of the look')).getByRole('link', {name: '“formed the basis for CSS”', hidden: true})).toHaveAttribute('href', 'https://www.wiumlie.no/2006/phd/#ch-postweb');
    expect(within(screen.getByRole('region', {name: 'The research'})).getByRole('link', {name: 'Cascading Style Sheets', hidden: true})).toBeInTheDocument();
  });
});

describe('the 1996 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'The road from the draft to the standard ran through two years of argument. At the third web conference, at Darmstadt in April 1995, Lie and Bos met in person for the first time and each showed an implementation, Bos’s Argo and Dave Raggett’s Arena, and the technical presentations “ended up in political discussions about the author-reader balance”. The author side argued for the last word, down to warning labels with legal requirements on their printing; Lie and Bos were on the other side, for the user, “whose eyes and ears ultimately have to decode the presentation”. The www-style list opened in May 1995 and held more than 4,000 messages three years later. The W3C became operational that year, and its staff working on style sheets, the two authors, sat at its European site in Sophia-Antipolis; the consortium’s style-sheet workshop went to Paris, “which is better served by international flights”, where Thomas Reardon of Microsoft pledged CSS support in Internet Explorer, and Lie and Bos call it “a milestone in ensuring style sheets their rightful place on the Web”. At the end of 1995 the W3C set up the HTML Editorial Review Board to ratify specifications, Lou Montulli of Netscape among its members, and took CSS as a work item; with Microsoft adding CSS, Netscape had to be brought on board or the browsers would diverge. The battles were “long and hard”, and CSS1 became a Recommendation in December 1996 with the draft’s percentages gone; specificity decides a conflict instead.',
    'The Recommendation is a short document. Its abstract says what the language is for in two sentences: “This document specifies level 1 of the Cascading Style Sheet mechanism (CSS1)”, and “One of the fundamental features of CSS is that style sheets cascade”, so that “authors can attach a preferred style sheet, while the reader may have a personal style sheet”. The author-and-reader settlement of 1994 is the first thing the standard states. A Recommendation is W3C’s final status for a specification, the point at which it asks the browsers to implement it.',
    'The browsers were partly there already. Lie and Bos record that “The first commercial browser to support CSS was Microsoft’s Internet Explorer 3 which was released in August 1996”, four months before the Recommendation, with most of the colour, background, font and text properties and little of the box model; the changes the Editorial Review Board made after it shipped were ones its developers “could not foresee”. “The next browser to announce support was Netscape’s Navigator, version 4.0”, and what that implementation was is the first 1996 moment’s story.',
    'So the standard fixed the language and not the rendering. The same sheet produced different pages, and the next decade of CSS is the browsers catching up with a document that was finished in 1996. In February 1997 CSS got its own working group, chaired by Chris Lilley, recruited to the W3C from the University of Manchester. CSS level 2 followed as a Recommendation in May 1998, and the catching-up is the 1998 moment.'
  ])('should tell the road from the draft to the standard, words and links together: %s', told => {
    expect(itemHeadedBy('1996', 'The style sheet needs a standard')).toHaveTextContent(told);
  });
});

describe('the first 1995 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'Brendan Eich wrote the interpreter in about ten days in May 1995, for a scripting language that could “touch elements of the page, change their properties, and respond to events”: a glue language for web designers and part-time programmers, beside Java for the components.',
    'Eich states the need in one sentence: “The lack of programmability of Web pages made them static, text-heavy, with at best images in tables or floating on the right or left.” With a language that could touch the page, “we envisioned a much livelier Web consisting of pages that acted more like applications”. The belief, his and Marc Andreessen’s with Bill Joy of Sun, was that HTML needed a scripting language, “a programming language that was easy to use by amateurs and novices, where the code could be written directly in source form as part of the Web page markup”. He calls it a “glue language” for “the Web designers and part time programmers who were building Web content from components such as images, plugins, and Java applets”, with Java as the “component language”.',
    'Eich joined Netscape on 4 April 1995 to put “the Scheme programming language, or something like it” into the browser; “Scheme was the bait”, he wrote later. Netscape was negotiating with Sun to put Java in Navigator, so the debate inside the company became why two languages at all. The answer was two audiences: component authors writing C++ or Java, and the scripters, “amateur or pro, who would write code directly embedded in HTML”. Upper engineering management ruled that the language must “look like Java”, which ruled out Perl, Python and Tcl, and Scheme with them.',
    'He spent “about ten days in May 1995 developing the interpreter, including the built-in objects except for the Date class”, which Ken Smith wrote by translating Java’s java.util.Date to C, “unintentionally inheriting java.util.Date’s Y2K bugs in the process”. The design was then “frozen by necessity”. Eich spent the rest of 1995 embedding the engine in the browser and writing what became DOM level 0, the objects a script uses to reach windows, documents, forms, links and images and to respond to events. He was “the lone JS developer at Netscape until mid-1996”. He names the ingredients himself, “Scheme-ish first-class functions and Self-ish (albeit singular) prototypes”, and calls the Java influences, the Date bugs and the split between primitives and objects among them, “unfortunate”.',
    'The name took longer than the language. Mocha was Andreessen’s code name. Netscape marketing “saw potential trademark conflicts” and had “a ‘live’ meme going in their naming”, so the betas said LiveScript. In early December 1995 Netscape and Sun signed a licence agreement and it became JavaScript, “a complementary scripting language to go with Java”, pushed, in Eich’s words, “as a little brother to Java, as a complementary language like Visual Basic was to C++”. The audience was “Web designers, people who may or may not have much programming training”, writing “a little snippet you could write, you could copy somebody else’s, you could learn as you went”; you could, he said, “buy it by the yard”. Jeremy Keith’s line for the family relationship stands: “Java is to JavaScript as ham is to hamster.”',
    'Some early adopters, “even in late 1995 (Netscape 2’s beta period), built advanced Web apps using JS and frames in framesets, prefiguring the ‘Ajax’ or ‘Web 2.0’ style of development”, the pattern the 2005 moment names. Then, though, “the means to communicate with servers generally involved reloading whole Web pages”. Eich counts himself among those who curse the language, “a quickie love-child of C and Self”, and borrows words he credits to Dr. Johnson: “the part that is good is not original, and the part that is original is not good.” And still: “JS beat Java on the client”.'
  ])('should tell the need and the language from Eich’s own words, words and links together: %s', told => {
    expect(itemHeadedBy('1995', 'Pages need to respond')).toHaveTextContent(told);
  });

  test.each(['not an application platform', 'never shipped publicly', 'He never romanticized it'])('should leave out "%s", which the sources do not hold', claim => {
    expect(itemHeadedBy('1995', 'Pages need to respond')).not.toHaveTextContent(claim);
  });

  test('should link Keith’s line to his journal, and shelve it', () => {
    expect(within(itemHeadedBy('1995', 'Pages need to respond')).getByRole('link', {name: '“Java is to JavaScript as ham is to hamster.”', hidden: true})).toHaveAttribute('href', 'https://adactio.com/journal/1595');
    expect(within(screen.getByRole('region', {name: 'The research'})).getByRole('link', {name: 'Misunderstanding markup', hidden: true})).toBeInTheDocument();
  });
});

describe('the second 1995 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'By 1994 an author could not know what HTML was. Raggett, who wrote HTML+ and later HTML 3, records that “During 1993 and early 1994, lots of browsers had added their own bits to HTML; the language was becoming ill-defined”. Mosaic’s IMG tag was one such bit: Andreessen brought it to www-talk while the others were still debating how images should go into a page, it shipped in Mosaic as proposed, and it “remains to this day firmly implanted in HTML”. At the first web conference, at CERN in May 1994, Dan Connolly gave a talk titled “Interoperability: Why Everyone Wins”, on why the web needed a proper HTML specification. Raggett notes that at least three of the people given awards that week later went against the idea.',
    'The answer was to write down what existed. “Dan Connolly and colleagues collected all the HTML tags that were widely used and collated them into a draft document”, which “was then circulated through the Internet community for comment”. Connolly took in suggestions from far and wide. He “also wrote a Document Type Definition for HTML 2, a kind of mathematically precise description of the language”, the definition a page named in its first line. “In early 1994, an Internet Engineering Task Force working group was set up to deal with HTML.” The IETF is the body that standardises the internet’s protocols, open to any engineer on its mailing list; its documents are RFCs.',
    'The result is RFC 1866, dated November 1995, by Berners-Lee and Connolly. Its scope says what it is. “Previously, informal documentation on HTML has been available from a number of sources on the Internet”; this specification “brings together, clarifies, and formalizes a set of features that roughly corresponds to the capabilities of HTML in common use prior to June 1994”, seventeen months before its date. It names itself HTML 2.0 “to distinguish it from the previous informal specifications”, and says what it leaves out: “A number of new features to HTML are being proposed and experimented in the Internet community.” Forms, the one thing a page could do besides link, came in as a level: “Form processing is a level 2 feature”, and a browser without them was “minimally conforming”.',
    'Practice kept outrunning the document. Netscape, formed in November 1994, “began inventing its own HTML tags as it pleased without first openly discussing them with the Web community”; it “rarely made an appearance at the big International WWW conferences, but it seemed to be driving the HTML standard”. During 1995 came FONT FACE and the BGCOLOR attribute of BODY, “which control stylistic aspects of a document”, over the protest of the academic engineering community: “You’re not supposed to be able to do things like that in HTML”. In September came a proposal for frames, “implemented on Netscape’s Navigator browser before anyone really had time to comment on it”. Netscape’s defence was that vendors had to innovate ahead of the standard, and that if users liked a feature “the market would drive it to become a de facto standard”, the sequence Raggett says the W3C was trying to avoid. In December 1995 the IETF group was dismantled because it “was having difficulties coming to consensus swiftly enough”. The W3C took the pen: HTML 3.2, January 1997, “took the existing IETF HTML 2 standard and incorporated features from HTML+ and HTML 3”. Standardising what the browsers already did became HTML’s habit, and in 2007 its stated principle.'
  ])('should tell how the first standard wrote down what the browsers did, words and links together: %s', told => {
    expect(itemHeadedBy('1995', 'The browsers’ tags need a standard')).toHaveTextContent(told);
  });
});

describe('the first 1996 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'Markup carried presentation for years because nothing else could, columns and fonts written as tags, and in the chaotic years of mixed browser support designers leaned on tables and spacer gifs: vendor tags on every side, and CSS itself run as JavaScript. The same page looked one way in one browser and another in the other.',
    'The markup of the time said it plainly:',
    'Layout and paint, written as structure. Netscape, Hoffmann writes, “simply extended HTML to include presentational, unstandardized HTML tags that could be used to design web pages”, and “it wasn’t long before web pages lost all semantic value”. While CSS was still a draft it “pressed on with presentational HTML elements like multicol, layer, and the dreaded blink tag”. Center had shipped in the first Mozilla beta, three days after Lie’s draft, and FONT made it into HTML 3.2 itself, the W3C’s Recommendation of January 1997. Raggett records the end of two of them: “The BLINK tag was ousted in an HTML ERB meeting. Netscape would only abolish it if Microsoft agreed to get rid of MARQUEE; the deal was struck and both tags disappeared.”',
    'Netscape “had been sceptical towards style sheets”. Lie and Bos read its first implementation, in Navigator 4, as “a half-hearted attempt to stop Microsoft from claiming to be more standards-compliant than themselves”: a broad set of features its developers “did not have time to fully test”, run by “translating CSS rules into snippets of Javascript”. The company also let developers write JSSS, JavaScript Style Sheets, “thereby bypassing CSS entirely”; had it succeeded, “the Web would have had one more style sheet than necessary”.',
    'The quieter effect was on trust. The same page looked one way in Internet Explorer and another in Navigator. In “the chaotic years of mixed browser support, CSS became pretty unpopular among web designers”, who “leaned on HTML data tables (or spacer gifs), which allowed them to lay things out to exact dimensions”. Hoffmann’s verdict on the era: “at one time, not using CSS was actually a best practice.”',
    'JavaScript fought the same war under a different flag. Microsoft shipped its own JavaScript, JScript, in Internet Explorer 3 that August, under a different name because “Microsoft couldn’t get a license from Sun”, and the two dialects differed. Eich’s reading is that the browser war “forced premature standardization after a furious period of innovation”: Netscape took the language to Ecma in November 1996, and the standard got a name nobody owned, ECMAScript. The standard, and why that name, is the 1997 moment.'
  ])('should tell how markup carried the look and the browsers split, words and links together: %s', told => {
    expect(itemHeadedBy('1996', 'The need outruns the standards')).toHaveTextContent(told);
  });

  test.each(['eczema', 'Flash', 'outpaced the Java applets', 'one more style sheet language', 'the war multiplied the dialects'])('should leave out "%s", which the sources do not hold', claim => {
    expect(itemHeadedBy('1996', 'The need outruns the standards')).not.toHaveTextContent(claim);
  });

  test('should link HTML 3.2 to its Recommendation, and shelve it', () => {
    expect(within(itemHeadedBy('1996', 'The need outruns the standards')).getByRole('link', {name: 'HTML 3.2', hidden: true})).toHaveAttribute('href', 'https://www.w3.org/TR/REC-html32');
    expect(within(screen.getByRole('region', {name: 'The research'})).getByRole('link', {name: 'HTML 3.2 Reference Specification', hidden: true})).toBeInTheDocument();
  });
});

describe('the 1997 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'Microsoft shipped its own JavaScript, JScript, in Internet Explorer 3 in August 1996, and the two dialects differed enough that pages worked in one browser and not the other. Netscape took the language to Ecma that November. The first edition of the standard, named ECMAScript, was adopted in June 1997.',
    'JavaScript had shipped in Navigator 2.0, and Microsoft answered in kind: “JScript was first supported in the Internet Explorer 3.0 browser released in August 1996”. It was, in Eich’s words, “Microsoft’s reverse-engineering of it”, under another name because “Microsoft couldn’t get a license from Sun”; the trademark was Sun’s, issued on 6 May 1997. “These differences made it difficult for developers to make their websites work well in both browsers”, and pages wore “best viewed in Netscape” and “best viewed in Internet Explorer” logos for years.',
    'Netscape’s answer was a standards body that was not the W3C: “In November 1996, Netscape submitted JavaScript to Ecma International, as the starting point for a standard specification that all browser vendors could conform to.” Ecma, founded as the European Computer Manufacturers Association, numbers its standards, and ECMA-262 is the number it gave the language. The name came from the same trademark: Ecma “couldn’t get anybody to donate a trademark that was agreeable to all parties”, so, Eich says, “they ended up inventing ECMAScript, which sounds a little like a skin disease”. His reading of the whole episode is that the browser war “forced premature standardization after a furious period of innovation”.',
    'The specification tells its own origin. It “is based on several originating technologies, the most well known being JavaScript (Netscape) and JScript (Microsoft)”; “The development of this Standard started in November 1996”, and the first edition was “adopted by the Ecma General Assembly of June 1997”. Ecma sent it to ISO under the fast-track procedure, where it became ISO/IEC 16262 in April 1998. The second edition, in 1998, kept the two aligned, with changes “editorial in nature”. The third, adopted in December 1999, “introduced powerful regular expressions, better string handling, new control statements, try/catch exception handling”. Ecma’s own list gives the three: June 1997, August 1998, December 1999.',
    'What the standard fixed was the core language. “The Ecma standard codifies just the core language, not the DOM,” Eich says, “and many people think of the DOM as ‘JavaScript’.” The objects a script uses to reach the page stayed each browser’s own. Eich had “an early version of the DOM that was somewhat proprietary; not all of it got standardized in the W3C”, so the gulf between the browsers outlived the standard. The third edition is the JavaScript the web ran on for a decade: “since publication of the third edition, ECMAScript has achieved massive adoption in conjunction with the World Wide Web where it has become the programming language that is supported by essentially all web browsers”. It then stood still for ten years, which is the 2009 moment.'
  ])('should tell why the standard got its name and what it left to the browsers, words and links together: %s', told => {
    expect(itemHeadedBy('the timeline', 'The language needs a standard')).toHaveTextContent(told);
  });
});

describe('the 1998 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'In 1998 the standards were ahead of every browser. Todd Fahrner wrote a page, the Acid Test, that a correct CSS1 browser renders to the pixel, and no browser that year did. The browsers took a decade to catch up, pushed by tests, hacks and failures named in public.',
    'The specifications were ahead of every browser. CSS2 became a Recommendation on 12 May 1998, edited by Bos and Lie. Its abstract lists what it added: “media-specific style sheets so that authors may tailor the presentation of their documents to visual browsers, aural devices, printers, braille devices, handheld devices”, and “content positioning, downloadable fonts, table layout, features for internationalization, automatic counters and numbering”. With them came z-index, bidirectional text and aural style sheets: presentation for ears as well as eyes.',
    'The browsers were measured by tests. The CSS1 Test Suite was a joint effort of the W3C, NIST and Case Western Reserve University, and its credits say how it came about. Eric Meyer “had created his own private test suite in order to create a set of compatibility charts for the Internet community’s reference”. Håkon Lie “checked each page for correctness and completeness”. Tim Boland of NIST went “to the effort of identifying more than five hundred testable statements in the CSS1 specification”. It opened for public comment in late April 1998, moved to the W3C’s server in May, and was declared complete with the revised CSS1 specification on 17 December 1998. The credits also name L. David Baron, Ian Hickson and the CSS Samurai of the Web Standards Project, and one line thanks “Chris Wilson of Microsoft, who prodded us into actually finishing the Test Suite”: the same Chris Wilson whose IE3 team had shipped with little of the box model. Opera 3.5 earned the era’s driest compliment from Lie and Bos: its developers “found the time to test their implementation before shipping it”.',
    'Inside that suite sits Todd Fahrner’s box model “acid test”, Test 5.5.26c: a deliberately nonsensical page, T.S. Eliot fragments and radio buttons labelled bang and whimper, because only the boxes were under test. Its stylesheet shows its work so no vendor could argue: “width: 10.638%; /* refers to parent element’s width of 47em. = 5em or 50px */”. The page says what passing means: “All 100%-conformant CSS1 agents should be able to render the document elements above this paragraph indistinguishably (to the pixel) from this reference rendering”. Its last line is the whole era in one sentence: “All discrepancies should be traceable to CSS1 implementation shortcomings.”',
    'None of 1998’s browsers managed that. Lie and Bos record that Internet Explorer 4 “does not fully support CSS1”, that in Navigator 4 “many CSS properties cannot be used”, and that Opera 3.5 “supports most of CSS1”. The Web Standards Project turned the tests into scoreboards: in November 1998 it published “IE’s Top 10 CSS Problems”, naming failures in public. Tantek Çelik’s doctype switch, worked out after a conversation with Fahrner, let a browser keep its old bugs for old pages and render new pages by the book. Eric Meyer, Hoffmann writes, “has gone on record and said doctype switching saved CSS”. Çelik’s own team shipped Internet Explorer 5 for the Macintosh on 27 March 2000, on a new engine, Tasman; Hoffmann calls it “the first browser with full CSS Level 1 support”. Lie and Bos had predicted CSS3 “towards the end of 1999”; the buggy parts of level 2 alone took until 2011 to become CSS 2.1, and a large publisher betting its pages on CSS is the 2002 moment.'
  ])('should tell the test suite from its credits and each browser from the Saga, words and links together: %s', told => {
    expect(itemHeadedBy('the timeline', 'The browsers need to agree')).toHaveTextContent(told);
  });

  test.each(['a young', '99%', 'Wired', 'most browsers failed'])('should leave out "%s", which the 2002 moment or no source holds', claim => {
    expect(itemHeadedBy('the timeline', 'The browsers need to agree')).not.toHaveTextContent(claim);
  });

  test.each(['Cascading Style Sheets, level 2', 'Internet Explorer for Mac'])('should shelve %s in the research', work => {
    expect(within(screen.getByRole('region', {name: 'The research'})).getByRole('link', {name: work, hidden: true})).toBeInTheDocument();
  });
});

describe('the 2002 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'On 11 October 2002 Wired News relaunched on XHTML and CSS with no tables for layout. Douglas Bowman designed it. A large daily publisher had bet its pages on the standards, and the bet held. Seven months later the Zen Garden made the same point as art.',
    'Eric Meyer wrote it up the day it launched: Wired News “has redesigned their site, and not just the front end, either”, and did it “using no tables to lay out the page, but instead applying CSS to XHTML”. XHTML is HTML written to XML’s stricter rules, the form the standards bodies favoured at the time. Meyer’s interview with Bowman, whom his post called “the point man on the Wired redesign”, for Netscape’s developer site, published the same day, gives the scale: a site that “draws between 20 and 25 million page views every month”, rebuilt on “validating XHTML for its structure and a small collection of CSS files for its layout”. Meyer also noted the flies in the ointment, pages that “don’t always validate” because of third-party advertisement code and seven years of old pages, and that the Web Standards Project “calls this a gutsy move”.',
    'Layout had belonged to tables since the browser wars, because tables rendered the same everywhere and CSS did not. Bowman had been one of their masters, “nesting them in intricate ways to produce any layout or effect that could be imagined”; one Lycos project had “nested tables 10 levels deep”. Wired’s old pages carried “redundant <font> tags inside every cell”, enough, he thought, to double the file size. He set out to keep one master table for the columns, then found glish.com and bluerobot.com, which “presented and documented viable means of producing multi-column layouts without a single table”, and took the last table out. The HTML of a typical page went from 32 KB to 19 KB, while its images grew from 8 to 13. He chose positioned columns over floats so the main column could come first in the markup for browsers that got the un-styled page, and took the cost: a footer that could not sit under the longest column, and columns that overlap in a narrow window.',
    'Bowman counted what the separation bought. “A few changes to the CSS can completely alter the presentation of thousands of pages.” A developer rearranged a module in five minutes when he thought it would take him an hour or two. A print sheet set a story in one column. The site was “dramatically more accessible, without much concentrated effort at making it so”. What it cost was counted too. The ad server needed iframes, so the pages were XHTML Transitional rather than Strict. Years of stories had gone into the database without closing paragraph tags, and the chief engineer wrote code to find them. The traffic reports said “as much as 14% of our users” would get the un-styled page. Bowman wrote ten years later that halfway through the redesign he had started plotting how Wired could support the standards “not just by publishing stories about it, but by adopting it outright”, and told Zeldman and Meyer. The relaunch, he wrote, “marked the first time a large, well-known, daily-content publisher had dropped tables for layout”, and “Not long after Wired took that leap, many other large, well-known sites and companies began following suit.” Meyer’s verdict at the time: “the site is a stunning example of how standards can be made to work today”.',
    'Wired showed a business could ship on CSS; ESPN followed a few months later, and the Zen Garden, in May 2003, showed what the separation was for.'
  ])('should tell the redesign from Bowman\'s own account of it, words and links together: %s', told => {
    expect(itemHeadedBy('the timeline', 'Someone needs to go first')).toHaveTextContent(told);
  });

  test.each(['The design is based on XHTML 1.0 and no tables', 'All of the layout and appearance is driven by a small collection of CSS files'])('should leave out the blurb line "%s", which the interview\'s own sentences replace', blurb => {
    expect(itemHeadedBy('the timeline', 'Someone needs to go first')).not.toHaveTextContent(blurb);
  });

  test('should shelve the interview in the research', () => {
    expect(within(screen.getByRole('region', {name: 'The research'})).getByRole('link', {name: 'An Interview With Douglas Bowman of Wired News', hidden: true})).toBeInTheDocument();
  });
});

describe('the 2003 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'Shea’s own account starts with the state of things. By 2003 the industry had “hunkered down and kept using the hacky table layouts and font tags that typified web development in the late 90’s”, and CSS was still used for little beyond fonts and colours. “Those who understood the capabilities of CSS were rarely designers, and designers largely hadn’t embraced it yet”, so “the widespread perception of CSS was as a language capable only of boxy and boring design”. Three things moved him. Chris Casciano spent a month restyling his own site. A Wired contest in early 2003 asked designers to re-skin one of its properties with CSS alone. And Jeffrey Zeldman told those who wanted the situation to change to stop talking about what CSS could do and start doing it.',
    'The garden’s rules were the argument, and its page states them: “You may modify the style sheet in any way you wish, but not the HTML.” Choose a design from the list and “The HTML remains the same, the only thing that has changed is the external CSS file. Yes, really.” It asked for “mostly CSS 1 & 2 usage”, and “The only real requirement we have is that your CSS validates.” Shea made the first five designs himself in May 2003 and asked the public for the rest; hundreds followed, and designers, Hoffmann writes, used the garden “to show their bosses and clients what CSS could do”. After the table layouts and spacer GIFs, this was when CSS “finally became trustworthy”.',
    'Lie’s 1994 draft had already shown the idea, as a two-line stylesheet that set nothing itself: reference the NYT’s sheet at 30% and Le Monde’s at 70%, and the presentation is “a mix”. Swap the sheet, keep the document. The garden was that example, industrialized, on the doctype-switched browsers of the 1998 moment.',
    'Shea built it, he writes, as “a collaborative gallery that could show what CSS could accomplish”, where “a designer was unable to modify the HTML in any way, the entire design had to be accomplished through CSS and images/fonts alone.” Separation had been argued as hygiene: maintainability, sharing, adaptation. The garden showed the other side, that with the structure held constant the design could be replaced any number of times. The collaboration and the demonstration worked together, Shea writes, to “help drive home the argument” that CSS-based design was “finally ready for prime time”.'
  ])('should tell the Zen Garden in the garden\'s own words and Shea\'s, words and links together: %s', told => {
    expect(itemHeadedBy('the timeline', 'The separation needs proof')).toHaveTextContent(told);
  });

  test.each(['CSS3’s module system', 'begun in 1999', 'a modular approach', 'with one rule'])('should leave out "%s", which no source holds or the 2011 moment tells', claim => {
    expect(itemHeadedBy('the timeline', 'The separation needs proof')).not.toHaveTextContent(claim);
  });

  test('should shelve Shea\'s About page in the research, undated', () => {
    expect(shelvedAs('About the CSS Zen Garden')).toHaveTextContent('Dave Shea, undated');
  });
});

describe('the 2004 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'Mozilla and Opera put a counter-proposal in writing: evolve HTML, backwards compatible. A straw poll at the W3C’s workshop went against it and the W3C said it did not intend to put any resources into it, so the browser makers founded the WHATWG and wrote the specification they were implementing. The people writing the specification were the people shipping it, and their second principle was that the two must match.',
    'The Standard’s own history says how HTML had stopped. In 1998 “the W3C membership decided to stop evolving HTML and instead begin work on an XML-based equivalent, called XHTML”, then on XHTML2, “a new language that was not compatible with the earlier HTML and XHTML languages”. In 2003 XForms “sparked a renewed interest in evolving HTML itself, rather than finding replacements for it”, because XML had been deployed only for new things like RSS, “rather than as a replacement for existing deployed technologies (like HTML)”. The first result was a proof of concept extending HTML4’s forms, a draft under Opera’s copyright.',
    'At the W3C’s workshop on web applications in June 2004, Mozilla and Opera put the case in a position paper. It warned of “a rising threat of single-vendor solutions”, and asked that browsers ship first implementations “before the end of the year 2004”. Its seven principles begin with “Backwards compatibility, clear migration path”: web application technologies “should be based on technologies authors are familiar with, including HTML, CSS, DOM, and JavaScript”, and should work in Internet Explorer 6 “without the need for binary plug-ins”. The rest are of a piece. “Well-defined error handling” means browsers “do not have to invent their own error handling mechanisms or reverse engineer other User Agents’”, and “Practical use” means every feature is “justified by a practical use case”. The last three are “Scripting is here to stay”, no device-specific profiling, and an “Open process” in which drafts “should continuously be visible to the public”.',
    'The workshop took a straw poll. On the question “Should the W3C develop declarative extension to HTML and CSS and to address medium level Web Application requirements”, the summary records “8 voted Yes. 14 voted No.” It calls the poll “not binding”, and says that W3C “does not intend to put any resources into” extensions to HTML and CSS for web applications. The Standard’s history puts it in one line: the proposal “conflicted with the previously chosen direction for the web’s evolution”, and the W3C “voted to continue developing XML-based replacements instead”. Shortly after, Apple, Mozilla and Opera “jointly announced their intent to continue working on the effort” under a new venue, the WHATWG, founded, its FAQ says, over the W3C’s “apparent disregard for the needs of real-world web developers”. The draft moved to the WHATWG’s site, and its copyright passed to the three vendors jointly.',
    'The Standard states the WHATWG’s method as three principles: “technologies need to be backwards compatible”, “specifications and implementations need to match even if this means changing the specification rather than the implementations”, and “specifications need to be detailed enough that implementations can achieve complete interoperability without reverse-engineering each other”. That last one is why HTML5 took in what had been three documents, HTML4, XHTML1 and DOM2 HTML. The people writing the specification were the people shipping it, and the second principle says the specification follows what they ship. The W3C “indicated an interest to participate in the development of HTML5 after all” in 2006 and chartered a group to work with the WHATWG in 2007. The two split in 2011 over a finished HTML5 versus a Living Standard, “continuously updated”. In 2019 they signed an agreement on “a single version of HTML going forward”. The posture from 1994, the specification following the field, had become the rule.'
  ])('should tell the workshop as the W3C\'s summary records it and the WHATWG\'s method in the Standard\'s words, words and links together: %s', told => {
    expect(itemHeadedBy('the timeline', 'The standard needs the real world')).toHaveTextContent(told);
  });

  test.each(['eight votes to fourteen', 'The W3C voted it down', 'Two days later', 'Web Applications 1.0', 'The browsers converged once'])('should leave out "%s", which no source holds', claim => {
    expect(itemHeadedBy('the timeline', 'The standard needs the real world')).not.toHaveTextContent(claim);
  });

  test('should shelve the workshop\'s summary in the research, dated by its page', () => {
    expect(shelvedAs('Summary, W3C Workshop on Web Applications and Compound Documents')).toHaveTextContent('Dean Jackson for the W3C, 21 July 2004');
  });
});

describe('the 2005 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'Ajax let a page fetch data and rewrite itself without reloading. Garrett named the approach and pointed at Google’s newest products as its highest-profile examples. Prototype and jQuery smoothed over the differences between the browsers, and then the frameworks came.',
    'Garrett opens with the gap. Desktop applications “have a richness and responsiveness that has seemed out of reach on the Web”. In the classic model “Most user actions in the interface trigger an HTTP request back to a web server”, which “returns an HTML page to the client”, and at every step “the user waits some more”. That model, he writes, was “adapted from the Web’s original use as a hypertext medium”, and “what makes the Web good for hypertext doesn’t necessarily make it good for software applications”.',
    'He published the essay on 18 February 2005, insisting that “Ajax isn’t a technology” but several: presentation in XHTML and CSS, display through the DOM, data in XML, “asynchronous data retrieval using XMLHttpRequest”, “and JavaScript binding everything together”. The mechanism is an engine. Instead of a page, the browser loads “an Ajax engine — written in JavaScript and usually tucked away in a hidden frame”. The engine draws the interface and talks to the server on the user’s behalf, so the user “is never staring at a blank browser window and an hourglass icon”. Why a name at all? He needed, he said, something shorter to use with clients than “Asynchronous JavaScript+CSS+DOM+XMLHttpRequest”.',
    'His exhibits were Google Suggest and Google Maps, which Google had announced ten days before the essay, with Orkut, Gmail and the Google Groups beta behind them, and Flickr and Amazon’s A9 following. They showed Ajax “is not only technically sound, but also practical for real-world applications”. He claimed practicality, not invention: “Neither Adaptive Path nor Google invented Ajax”. What was new was “the prominent use of these techniques in real-world applications to change the fundamental interaction model of the Web”. The pattern was older than the name. The object behind it had shipped in Internet Explorer 5 in 1999 as an ActiveX object, Microsoft.XMLHTTP, and every browser answered to the name XMLHttpRequest by 2006. Eich points to hidden-frame applications “even in late 1995” prefiguring the whole style, and sums up JavaScript’s part in the era: “JS was the tap root.”',
    'When people came to JavaScript to program the browser, Eich says, “they want the same APIs and they don’t get them”: the browsers still differed in the objects a script used to reach the page, so a page written once did not run in every browser. What “helps make this less painful”, he goes on, “are these JavaScript libraries, which are pure JavaScript code that makes this higher layer of code that masquerades and makes all the differences go away”. Sam Stephenson’s Prototype came in February 2005, as the Ajax layer of Ruby on Rails, and calls itself a framework that “smooths over the rough edges of cross-browser development”. John Resig’s jQuery followed in 2006: events, animation, Ajax calls, and DOM crawling wrapped as one API that hid the differences between the browsers then installed, in its own words “an easy-to-use API that works across a multitude of browsers”. Then the frameworks came to organize what script was now building: AngularJS in 2010, React in 2013, Vue in 2014, which is the 2010 moment. The page stopped being a document you fetched and started being a program you ran. What the language’s standard did next is the 2009 moment.'
  ])('should state the need and the mechanism in Garrett\'s words and source what came before, words and links together: %s', told => {
    expect(itemHeadedBy('the timeline', 'The page needs to update in place')).toHaveTextContent(told);
  });

  test.each(['most of them betas', 'stripped the repetition out', 'XMLHTTP had shipped in IE5', 'The bigger problem the libraries solved'])('should leave out "%s", which no source holds or the moment now says otherwise', claim => {
    expect(itemHeadedBy('the timeline', 'The page needs to update in place')).not.toHaveTextContent(claim);
  });

  test.each(['XMLHttpRequest', 'Google Maps', 'Prototype JavaScript framework', 'Prototype JavaScript Framework', 'jQuery'])('should shelve %s in the research', work => {
    expect(within(screen.getByRole('region', {name: 'The research'})).getByRole('link', {name: work, hidden: true})).toBeInTheDocument();
  });
});

describe('the 2009 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'Ten years after the third edition, the language’s standard moved. The fourth edition was never published as a standard; its design had already shipped as ActionScript 3, and the committee set it aside in 2008. The fifth, published on 3 December 2009, was the smaller step: strict mode, JSON, accessor properties. From 2015 an edition has come every year.',
    'Ecma never published a fourth edition. Its own page records that the number “was reserved but not used in the Ecma publication process”, and that “Therefore ‘ECMA-262 Edition 4’ as an Ecma International publication does not exist”. Eich told the es-discuss list in August 2008 what had happened. The committee “has been split for over a year, with some members favoring ES4, a major fourth edition to ECMA-262, and others advocating ES3.1 based on the existing ECMA-262 Edition 3 (ES3) specification”. At a meeting in Oslo at the end of July the split ended, in a result he labelled Harmony. The committee would “Focus work on ES3.1 with full collaboration of all parties, and target two interoperable implementations by early next year”. The step after it would “be more modest than ES4 in both semantic and syntactic innovation”. And “Some ES4 proposals have been deemed unsound for the Web, and are off the table for good: packages, namespaces and early binding.” His reason is one sentence: “A split committee is good for no one and nothing, least of all any language specs that might come out of it.”',
    'The fourth edition did not vanish; it shipped under another name. Adobe’s ActionScript 3, released in June 2006 with Flash Player 9, was a “Completely conforming implementation of the ECMAScript fourth edition draft specification”, and on 7 November 2006 Adobe gave its ActionScript engine to Mozilla as Tamarin, meant to carry the fourth edition into the browsers. Eich says it in the same announcement: the ideas “going back to the first ES4 proposals in 1999, implemented variously in JScript.NET and ActionScript, won’t make it into any ES standard”. That language ran in the browsers through the Flash plugin. Eich’s own tally in 2008 was that “JS beat Java on the client, rivaled only by Flash, which supports an offspring of JS, ActionScript.” In April 2010 Steve Jobs published an open letter explaining why Apple would not support Flash on the iPhone, iPod Touch and iPad, and Adobe discontinued Flash Player on 31 December 2020. Some of the fourth edition’s ideas came back anyway; of its features, Wikipedia records, “some were incorporated into the sixth edition”.',
    'The fifth edition’s own introduction records that the fourth-edition work “was not completed and not published as the fourth edition of ECMAScript”, though “it informs continuing evolution of the language”. ES3.1 was “later renamed to ECMAScript, 5th Edition”, and “On 3 December 2009, ECMA-262 5th edition was published”. It “codifies de facto interpretations of the language specification that have become common among browser implementations”, and adds “accessor properties, reflective creation and inspection of objects”, “support for the JSON object encoding format” and “a strict mode that provides enhanced error checking and program security”. An accessor property is a property that runs a function when read or written. JSON is a format for sending objects as text. Strict mode is a stricter dialect a script opts into with one line.',
    'The sixth edition, in June 2015, added classes and modules, defined “in the same terms as ECMAScript 5 strict mode”, with iterators and generators, arrow functions, let and const, promises and template literals. Since then an edition has shipped every year, the seventeenth in 2026. TC39’s process admits a feature to the standard at its last stage only with “Two compatible implementations which pass the Test262 acceptance tests”, and gathers the year’s finished features into “a yearly standard publication”. A standard that had stalled for ten years over one large change now ships what two engines have already proved, every year.'
  ])('should tell the split over the fourth edition from Eich\'s own announcement, words and links together: %s', told => {
    expect(itemHeadedBy('the timeline', 'The standard needs to move again')).toHaveTextContent(told);
  });

  test.each(['political differences concerning language complexity', 'The fourth edition does not exist.', 'was abandoned in 2008', 'ambitious with classes and types', 'The run ended with the phone', 'the rule from Oslo made permanent'])('should leave out "%s", which Eich\'s own account replaces', claim => {
    expect(itemHeadedBy('the timeline', 'The standard needs to move again')).not.toHaveTextContent(claim);
  });

  test.each([['ECMAScript Harmony', 'Brendan Eich on es-discuss, 13 August 2008, via the Internet Archive'], ['The TC39 Process', 'TC39, Ecma International'], ['ActionScript', 'Wikipedia'], ['Tamarin', 'Wikipedia'], ['Adobe Flash Player', 'Wikipedia']])('should shelve %s, %s', (work, provenance) => {
    expect(shelvedAs(work)).toHaveTextContent(provenance);
  });
});

describe('the 2010 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'AngularJS states the need on its own page: “HTML is great for declaring static documents, but it falters when we try to use it for declaring dynamic views in web-applications.” Other frameworks, it says, “deal with HTML’s shortcomings by either abstracting away HTML, CSS, and/or JavaScript or by providing an imperative way for manipulating the DOM”, and “Neither of these address the root problem that HTML was not designed for dynamic views.” Its answer was to “extend HTML vocabulary for your application”.',
    '“AngularJS was originally developed in 2009 by Miško Hevery” at Brat Tech LLC, as the software behind an online JSON storage service at GetAngular.com, before its makers “decided to abandon the business idea and release Angular as an open-source library”. Its changelog dates the first tagged release, 0.9.0, to 20 October 2010, and 1.0 to 13 June 2012; it was “maintained mainly by Google”. It is a “JavaScript-based web framework for developing single-page applications”. A framework is a program that owns the page’s structure and calls your code, the reverse of a library, which your code calls. A single-page application is a page that never reloads; the script rewrites it. AngularJS’s one idea was “two-way data-binding that allowed for the automatic synchronization of models and views”. Its own page puts it plainly: “an automatic way of updating the view whenever the model changes, as well as updating the model whenever the view changes”. Change the data and the page changes; change the page and the data changes.',
    'The answers multiplied. React ran inside Facebook first, “first deployed on Facebook’s News Feed in 2011”, and was open-sourced at “JSConf US, in May 2013”; it is the 2013 moment. Vue, “first publicly announced the following February, in 2014”, began as a reaction to AngularJS; Evan You: “what if I could just extract the part that I really liked about Angular and build something really lightweight”. Angular, “a complete rewrite from the same team that built AngularJS”, shipped its 2.0 release on 14 September 2016, and AngularJS’s own page now says “AngularJS support has officially ended as of January 2022”.',
    'Each framework moved more of the page into script, with structure, style and behaviour composed in one place and rendered by the program. The 2013 moment names that need; the 2016 moment counts its cost.'
  ])('should state the need in AngularJS\'s own words and date its release from its changelog, words and links together: %s', told => {
    expect(itemHeadedBy('the timeline', 'The application needs a frame')).toHaveTextContent(told);
  });

  test.each(['Google no longer updates AngularJS', 'at a small company', 'it was released on 20 October 2010'])('should leave out "%s", which the framework\'s own page and changelog replace', claim => {
    expect(itemHeadedBy('the timeline', 'The application needs a frame')).not.toHaveTextContent(claim);
  });

  test('should shelve AngularJS\'s page and its changelog in the research', () => {
    expect(shelvedAs('Why AngularJS?')).toHaveTextContent('angularjs.org');
    expect(shelvedAs('AngularJS changelog')).toHaveTextContent('the angular.js repository on GitHub');
  });
});

describe('the 2011 moment', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test.each([
    'W3C’s announcement of 7 June 2011 is headed “Cascading Style Sheets Standard Boasts Unprecedented Interoperability”. Interoperability means the same sheet produces the same page in different browsers, the thing CSS1 could not deliver in 1996, and the release says why the wait: “it took many years for implementations and the specification to converge”. It gives the number: “More than 9000 CSS tests have made it easier for designers to create style sheets that work across browsers, and across devices.” Daniel Glazman, co-chair of the working group, answers the question he says people had asked, “Why is CSS 2.1 taking so long?” His answer: “CSS 2.1 is a really large collection of formatting features, and we had to not only carefully review and specify all the potential interactions between them, but also learn from existing implementations and of course tests. Time ensured quality and interoperability.” Thirteen years between CSS 2 and its finished revision.',
    'The same day W3C published CSS Color Module Level 3 as a Recommendation, and within a year three more modules followed: Selectors Level 3 and Namespaces on 29 September 2011, and Media Queries on 19 June 2012. The release says W3C “expects future additions to CSS to be organized as independent modules, allowing smaller, more focused feature sets to progress and stabilize at their own pace”. Peter Linss, the other co-chair, says the group “can focus its efforts on rapidly advancing CSS with new modules”. The reasoning had been set out in 2001. “Rather than attempting to shove dozens of updates into a single monolithic specification”, “it will be much easier and more efficient to be able to update individual pieces of the specification”; and for small devices “it may be impractical to support all of CSS”. A module is one piece of the language with its own specification and its own tests.',
    'This is the shape CSS still has: modules at levels, each finished the way 2.1 was finished, against its tests. CSS 1 was declared finished while no browser rendered all of it; since 2.1, a module is finished when the browsers render it alike.'
  ])('should give the working group\'s own account of why CSS 2.1 took thirteen years and name the modules that followed, words and links together: %s', told => {
    expect(itemHeadedBy('the timeline', 'The specification needs its tests')).toHaveTextContent(told);
  });

  test.each([['CSS Color Module Level 3', 'W3C Recommendation, 7 June 2011'], ['Selectors Level 3', 'W3C Recommendation, 29 September 2011'], ['CSS Namespaces Module', 'W3C Recommendation, 29 September 2011'], ['Media Queries', 'W3C Recommendation, 19 June 2012']])('should shelve %s, %s', (work, provenance) => {
    expect(shelvedAs(work)).toHaveTextContent(provenance);
  });
});

describe('the record', () => {
  beforeEach(() => {
    render(<TestApp at={Paths.record}/>);
  });

  test('should open on its title, then tell the record, then walk into the demos, then collect the research', () => {
    const title = screen.getByRole('heading', {name: 'The record', level: 1});
    const record = screen.getByRole('heading', {name: 'How the web got its languages', level: 2});
    const research = screen.getByRole('heading', {name: 'The research', level: 2});
    const demos = screen.getByRole('link', {name: /Start where the demos start/});

    expect(title.compareDocumentPosition(record) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(record.compareDocumentPosition(demos) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(demos.compareDocumentPosition(research) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(demos).toHaveAttribute('href', expect.stringContaining(Paths.demos));
  });

  test('should say, after the record, that the tables are built twice and why both are kept', () => {
    const record = screen.getByRole('region', {name: 'How the web got its languages'});
    const seam = screen.getByText(/^The tables are built twice/);

    expect(record.compareDocumentPosition(seam)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(seam).toHaveTextContent('The tables are built twice: once in plain HTML, CSS and JavaScript with no framework, and once in React on the same three. I keep both so the line between the platform and the framework stays visible. The history above is why that line matters: what a framework had to do keeps moving into the platform.');
  });

  test.each([
    'Presentation got its own language the same year the web got its own standards body, the W3C.',
    'Hundreds of designs followed, and not one change to the markup: the same structure under any presentation.',
    'The posture from 1994, the specification following the field, had become the rule.',
    'The single-page application inverted the premise: the document no longer carried the application, the application emitted the document.',
    'The web had run this experiment before, as JavaScript Style Sheets, when Netscape 4 rendered style by translating it into script; this time the industry’s weight was behind it.',
    'Even Berners-Lee’s 1991 wish for “a nestable <SECTION>..</SECTION> element” resurfaced as the section element, twenty-three years later.',
    'What changed each time was where the rendering happens; the three responsibilities did not move.',
    'Someone needs something, the community answers, and the platform learns the answer. The needs have not stopped arriving.'
  ])('should say plainly, words and links together: %s', sentence => {
    expect(screen.getByRole('region', {name: 'How the web got its languages'})).toHaveTextContent(sentence);
  });

  test.each([
    'The complementary language outlived the thing it was built to complement.',
    'The lesson was not that script was wrong'
  ])('should leave out the closer "%s"', closer => {
    expect(screen.getByRole('region', {name: 'How the web got its languages'})).not.toHaveTextContent(closer);
  });

  test('the record says why the languages arrived', () => {
    const record = within(screen.getByRole('region', {name: 'How the web got its languages'}));
    expect(record.getByText(/a web of nodes in which the user can browse at will/)).toBeVisible();
    expect(record.getByText(/^Tim Berners-Lee and Robert Cailliau,/)).toBeVisible();
    expect(record.getByText(/Someone needed something/)).toBeVisible();
    expect(screen.getByText(/one sentence said twenty ways/)).toBeVisible();
  });

  test('the timeline walks the years in order, one entry each, a year of two moments holding both under its title', () => {
    const timeline = within(screen.getByRole('list', {name: 'the timeline'}));

    expect(timeline.getAllByRole('time').map(year => year.textContent)).toEqual(
      ['1989', '1990', '1991', '1994', '1995', 'May', 'November', '1996', 'August', 'December', '1997', '1998', '2002', '2003', '2004', '2005', '2009', '2010', '2011', '2013', '2014', '2016']);
    expect(timeline.getAllByRole('heading', {level: 3}).map(title => title.textContent)).toEqual([
      'Someone needs something',
      'Researchers need to collaborate',
      'The web needs the public',
      'Authors need control of the look',
      'Pages need to respond, and the browsers’ tags need a standard',
      'The need outruns the standards, and the style sheet needs a standard',
      'The language needs a standard',
      'The browsers need to agree',
      'Someone needs to go first',
      'The separation needs proof',
      'The standard needs the real world',
      'The page needs to update in place',
      'The standard needs to move again',
      'The application needs a frame',
      'The specification needs its tests',
      'Someone needs components',
      'The philosophy needs writing down',
      'The document needs to come first'
    ]);
  });

  test.each([
    ['1995', 'Pages need to respond, and the browsers’ tags need a standard',
      'Two doors moved in 1995. At Netscape, Brendan Eich wrote the interpreter for a scripting language in about ten days, a glue language for web designers beside Java for the components, and the page could respond. At the IETF, the first HTML standard was written after the fact: HTML 2.0, published in November, is the set of tags the browsers already used, collected and defined, because each browser had added its own and the language was becoming ill-defined.',
      [['1995-05', 'May', 'Dynamic Interaction', 'Pages need to respond'], ['1995-11', 'November', 'Structure', 'The browsers’ tags need a standard']]],
    ['1996', 'The need outruns the standards, and the style sheet needs a standard',
      'Two doors moved in 1996. Markup still carried presentation because nothing else could, Netscape’s tags multiplied the dialects, and in Navigator 4 CSS itself ran as JavaScript. The same year CSS level 1 became a W3C Recommendation, the first standard for the look, ahead of every browser and set to stay ahead for years.',
      [['1996-08', 'August', 'Structure, Presentation', 'The need outruns the standards'], ['1996-12-17', 'December', 'Presentation', 'The style sheet needs a standard']]]
  ])('should tell %s as one entry, and open its fuller story on each moment, dated by its month and captioned by its door', async (year, title, tells, doors) => {
    const theYear = itemHeadedBy('the timeline', title);

    expect(theYear).toHaveTextContent(tells);
    await userEvent.click(within(theYear).getByText('the fuller story'));

    expect(within(screen.getByRole('list', {name: year})).getAllByRole('listitem').map(moment => [
      within(moment).getByRole('time').getAttribute('datetime'),
      within(moment).getByRole('time').textContent,
      within(moment).getByText(/^(Structure|Presentation|Dynamic Interaction)/).textContent,
      within(moment).getByRole('heading', {level: 4}).textContent
    ])).toEqual(doors);
  });

  test('every beat opens into its fuller story, closed until asked', () => {
    const timeline = within(screen.getByRole('list', {name: 'the timeline'}));

    expect(timeline.getAllByText('the fuller story')).toHaveLength(18);
    const folds = timeline.getAllByRole('group');
    expect(folds.filter(fold => fold.hasAttribute('open'))).toHaveLength(0);
    [/Viola/, /Mocha/, /ham is to hamster/, /MULTICOL/, /Wired News/, /React in 2013/, /CSS-in-JS/, /Next\.js/, /island of behavior/, /WorldWideWeb/, /Self-ish/, /aural/, /hid the differences between the browsers then installed/, /Chedeau/, /Sylor-Miller/, /you’re screwed/, /40% helvetica/, /Fahrner/, /Enquire/, /dictatorship/, /WHATWG/, /Living Standard/, /real-world web developers/, /skin disease/]
      .forEach(depth => expect(timeline.getAllByText(depth).length).toBeGreaterThan(0));
    expect(timeline.getByRole('link', {name: 'the essay', hidden: true}))
      .toHaveAttribute('href', expect.stringContaining('adaptivepath'));
    folds.forEach(story => {
      expect(within(story).getAllByRole('paragraph').length).toBeGreaterThanOrEqual(3);
    });
  });

  test.each([
    ['The web needs the public', 'https://www.w3.org/History.html', '“freely usable by anyone, with no fees being payable to CERN”'],
    ['Pages need to respond', 'https://brendaneich.com/2008/04/popularity/', '“Scheme was the bait”'],
    ['The browsers’ tags need a standard', 'https://www.w3.org/People/Raggett/book4/ch02.html', '“was then circulated through the Internet community for comment”'],
    ['Pages need to respond', 'https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html', '“buy it by the yard”'],
    ['Researchers need to collaborate', 'https://www.w3.org/History/19921103-hypertext/hypertext/WWW/Proposal.html', '“Nodes do not need to be on the same machine: links may point across machine boundaries.”'],
    ['Researchers need to collaborate', 'https://info.cern.ch/hypertext/WWW/MarkUp/Tags.html', '“registered by the W3 team”'],
    ['Researchers need to collaborate', 'https://www.w3.org/Protocols/HTTP/AsImplemented.html', '“a line of ASCII characters terminated by a CR LF”'],
    ['Researchers need to collaborate', 'https://worldwideweb.cern.ch/worldwideweb/', '“a single click was used for editing”'],
    ['Researchers need to collaborate', 'https://worldwideweb.cern.ch/history/', '“was later renamed Nexus to avoid confusion with the World Wide Web project”'],
    ['The web needs the public', 'https://www.w3.org/People/Berners-Lee/1991/08/art-6484.txt', '“Collaborators welcome!”'],
    ['The browsers’ tags need a standard', 'https://www.rfc-editor.org/rfc/rfc1866', '“to distinguish it from the previous informal specifications”'],
    ['The style sheet needs a standard', 'https://www.w3.org/TR/REC-CSS1-961217', '“One of the fundamental features of CSS is that style sheets cascade”'],
    ['Someone needs to go first', 'https://web.archive.org/web/2003/http://devedge.netscape.com/viewsource/2002/wired-interview/', '“as much as 14% of our users”'],
    ['Someone needs to go first', 'https://meyerweb.com/eric/thoughts/2002/10/11/wired-with-standards/', '“calls this a gutsy move”'],
    ['Someone needs to go first', 'https://meyerweb.com/eric/thoughts/2002/10/11/wired-with-standards/', '“the point man on the Wired redesign”'],
    ['Someone needs to go first', 'https://thehistoryoftheweb.com/look-back-history-css/', 'ESPN followed a few months later'],
    ['The separation needs proof', 'https://csszengarden.com/pages/about/', '“a collaborative gallery that could show what CSS could accomplish”'],
    ['The separation needs proof', 'https://csszengarden.com/', '“You may modify the style sheet in any way you wish, but not the HTML.”'],
    ['The standard needs the real world', 'https://www.w3.org/2004/04/webapps-cdf-ws/summary', '“8 voted Yes. 14 voted No.”'],
    ['The standard needs the real world', 'https://whatwg.org/position-paper', '“a rising threat of single-vendor solutions”'],
    ['The standard needs the real world', 'https://html.spec.whatwg.org/multipage/introduction.html', '“technologies need to be backwards compatible”'],
    ['The page needs to update in place', 'https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php', '“the user waits some more”'],
    ['The page needs to update in place', 'https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html', '“they want the same APIs and they don’t get them”'],
    ['The page needs to update in place', 'http://prototypejs.org/', '“smooths over the rough edges of cross-browser development”'],
    ['The page needs to update in place', 'https://jquery.com/', '“an easy-to-use API that works across a multitude of browsers”'],
    ['The page needs to update in place', 'https://en.wikipedia.org/wiki/XMLHttpRequest', 'Microsoft.XMLHTTP'],
    ['The page needs to update in place', 'https://en.wikipedia.org/wiki/Google_Maps', 'ten days before the essay'],
    ['The standard needs to move again', 'https://web.archive.org/web/2015/https://mail.mozilla.org/pipermail/es-discuss/2008-August/006837.html', '“A split committee is good for no one and nothing, least of all any language specs that might come out of it.”'],
    ['The standard needs to move again', 'https://tc39.es/process-document/', '“Two compatible implementations which pass the Test262 acceptance tests”'],
    ['The standard needs to move again', 'https://en.wikipedia.org/wiki/ActionScript', '“Completely conforming implementation of the ECMAScript fourth edition draft specification”'],
    ['The standard needs to move again', 'https://ecma-international.org/publications-and-standards/standards/ecma-262/', '“Therefore ‘ECMA-262 Edition 4’ as an Ecma International publication does not exist”'],
    ['The application needs a frame', 'https://angularjs.org/', '“Neither of these address the root problem that HTML was not designed for dynamic views.”'],
    ['The application needs a frame', 'https://github.com/angular/angular.js/blob/master/CHANGELOG.md', '20 October 2010'],
    ['The application needs a frame', 'https://en.wikipedia.org/wiki/React_(software)', '“first deployed on Facebook’s News Feed in 2011”'],
    ['Someone needs to go first', 'https://stopdesign.com/archive/2012/10/11/ten-years-later.html', '“marked the first time a large, well-known, daily-content publisher had dropped tables for layout”'],
    ['The specification needs its tests', 'https://www.w3.org/2011/05/css-pr.html.en', '“CSS 2.1 is a really large collection of formatting features, and we had to not only carefully review and specify all the potential interactions between them, but also learn from existing implementations and of course tests. Time ensured quality and interoperability.”'],
    ['The specification needs its tests', 'https://www.w3.org/2011/05/css-pr.html.en', '“can focus its efforts on rapidly advancing CSS with new modules”'],
    ['The specification needs its tests', 'https://www.w3.org/TR/2012/REC-css3-mediaqueries-20120619/', 'Media Queries'],
    ['The language needs a standard', 'https://262.ecma-international.org/5.1/', '“adopted by the Ecma General Assembly of June 1997”'],
    ['The browsers need to agree', 'https://www.w3.org/TR/1998/REC-CSS2-19980512/', '“content positioning, downloadable fonts, table layout, features for internationalization, automatic counters and numbering”'],
    ['The browsers need to agree', 'https://www.w3.org/Style/CSS/Test/CSS1/current/tsack.html', '“checked each page for correctness and completeness”'],
    ['The browsers need to agree', 'https://www.w3.org/Style/CSS/Test/CSS1/current/test5526c.htm', '“All discrepancies should be traceable to CSS1 implementation shortcomings.”'],
    ['The browsers need to agree', 'https://www.w3.org/Style/LieBos2e/history/Overview.html', '“does not fully support CSS1”'],
    ['The browsers need to agree', 'https://thehistoryoftheweb.com/look-back-history-css/', '“the first browser with full CSS Level 1 support”'],
    ['The browsers need to agree', 'https://en.wikipedia.org/wiki/Internet_Explorer_for_Mac', '27 March 2000'],
    ['The language needs a standard', 'https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html', '“they ended up inventing ECMAScript, which sounds a little like a skin disease”'],
    ['The language needs a standard', 'https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html', '“The Ecma standard codifies just the core language, not the DOM,”'],
    ['The language needs a standard', 'https://en.wikipedia.org/wiki/JScript', '“JScript was first supported in the Internet Explorer 3.0 browser released in August 1996”'],
    ['The standard needs to move again', 'https://en.wikipedia.org/wiki/ECMAScript_version_history', '“On 3 December 2009, ECMA-262 5th edition was published”'],
    ['The application needs a frame', 'https://en.wikipedia.org/wiki/AngularJS', '“JavaScript-based web framework for developing single-page applications”'],
    ['The need outruns the standards', 'https://thehistoryoftheweb.com/look-back-history-css/', '“it wasn’t long before web pages lost all semantic value”'],
    ['The need outruns the standards', 'https://www.w3.org/People/Raggett/book4/ch02.html', '“The BLINK tag was ousted in an HTML ERB meeting. Netscape would only abolish it if Microsoft agreed to get rid of MARQUEE; the deal was struck and both tags disappeared.”'],
    ['The need outruns the standards', 'https://www.infoworld.com/article/2653798/javascript-creator-ponders-past--future.html', '“Microsoft couldn’t get a license from Sun”']
  ])('should tell %s, quoting its source by a link', (title, source, quotation) => {
    expect(within(itemHeadedBy('the timeline', title)).getByRole('link', {name: quotation, hidden: true})).toHaveAttribute('href', source);
  });

  test('should open the tee-up on how every page here is built, need first', () => {
    expect(screen.getByText(/^I start from what someone needs/))
      .toHaveTextContent('I start from what someone needs. The clues in that need point at an element the platform already has. I design around the element, cut the design into thin stories, and build the feature one story at a time. Every page here was built that way.');
  });

  test('should send the reader into the demos at the accordions, and say what the demos teach', () => {
    expect(screen.getByText(/with the accordions, which set the trick we used before/))
      .toHaveTextContent('Start where the demos start, with the accordions, which set the trick we used before beside what the platform gives now. Most of the leverage is in knowing what each element was built for.');
  });

  test('should tell the concert after the timeline closes and before the tee-up', () => {
    const closing = screen.getByText(/^Read the titles again, top to bottom/);
    const concert = screen.getByRole('region', {name: 'The concert'});
    const teeUp = screen.getByText(/^I start from what someone needs/);

    expect(closing.compareDocumentPosition(concert) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(concert.compareDocumentPosition(teeUp) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('should open the concert on the principles, then say the web worked by them before they were written', () => {
    expect(screen.getByText(/^In 2007 the W3C wrote down how HTML should grow/))
      .toHaveTextContent(/for the same purpose\.” The principles were written late\. The web had worked by them since 1994, and the moments above show how: when one language could not yet do a job, another did it, and the standard later adopted what had spread\.$/);
  });

  test('should keep every source the concert links to on the research shelf', () => {
    const shelved = within(screen.getByRole('region', {name: 'The research'})).getAllByRole('link', {hidden: true})
      .map(work => work.getAttribute('href'));
    const linked = within(screen.getByRole('region', {name: 'The concert'})).getAllByRole('link')
      .map(link => link.getAttribute('href') ?? '')
      .filter(source => source.startsWith('http'));

    expect(linked).not.toEqual([]);
    expect(linked.filter(source => !shelved.includes(source))).toEqual([]);
  });

  test('should land the concert’s reader on the 1996 moment, with focus there', async () => {
    await userEvent.click(within(screen.getByRole('region', {name: 'The concert'})).getByRole('link', {name: 'the 1996 moment'}));

    await waitFor(() => expect(itemHeadedBy('1996', 'The need outruns the standards')).toHaveFocus());
  });

  test('should keep every source a fuller story links to on the research shelf', () => {
    const shelved = within(screen.getByRole('region', {name: 'The research'})).getAllByRole('link', {hidden: true})
      .map(work => work.getAttribute('href'));
    const linked = within(screen.getByRole('list', {name: 'the timeline'})).getAllByRole('group')
      .flatMap(story => within(story).queryAllByRole('link', {hidden: true}).map(link => link.getAttribute('href')));

    expect(linked.filter(source => !shelved.includes(source))).toEqual([]);
  });

  test('the history cites its sources', () => {
    expect(screen.getByRole('link', {name: /proposing the WorldWideWeb/}))
      .toHaveAttribute('href', expect.stringContaining('w3.org/History'));
    expect(screen.getByRole('link', {name: /drafted Cascading HTML Style Sheets/}))
      .toHaveAttribute('href', expect.stringContaining('w3.org/People/howcome'));
    expect(screen.getByRole('link', {name: /never become a page-description language/}))
      .toHaveAttribute('href', expect.stringContaining('w3.org/Style/LieBos2e'));
    expect(screen.getByRole('link', {name: /the Acid Test/}))
      .toHaveAttribute('href', expect.stringContaining('w3.org/Style/CSS/Test'));
    expect(screen.getByRole('link', {name: /one HTML document/}))
      .toHaveAttribute('href', expect.stringContaining('csszengarden.com'));
    expect(screen.getByRole('link', {name: /wrote the interpreter in about ten days/}))
      .toHaveAttribute('href', expect.stringContaining('computerworld.com'));
    expect(screen.getByRole('link', {name: /reducing the overlap/}))
      .toHaveAttribute('href', expect.stringContaining('html.com/html5'));
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
