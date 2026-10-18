import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {itemHeadedBy} from '@__test_support/headed-item';
import {render, screen, waitFor, within} from '@testing-library/react';
import {Paths} from '@pages/Paths';

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
    expect(within(screen.getByRole('region', {name: 'The research'})).getByRole('link', {name: 'Weaving the Web', hidden: true})).toHaveAttribute('href', 'https://www.ppd.stfc.ac.uk/news/unravelling-the-web-how-particle-physics-launched-the-invention-that-changed-the-world/');
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
    expect(within(screen.getByRole('region', {name: 'The research'})).getByRole('link', {name: 'WorldWideWeb: Summary, posted to alt.hypertext', hidden: true})).toHaveAttribute('href', 'https://www.w3.org/People/Berners-Lee/1991/08/art-6487.txt');
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
    expect(within(screen.getByRole('region', {name: 'The research'})).getByRole('link', {name: 'Cascading Style Sheets', hidden: true})).toHaveAttribute('href', 'https://www.wiumlie.no/2006/phd/#ch-postweb');
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
    'Some early adopters, “even in late 1995 (Netscape 2’s beta period), built advanced Web apps using JS and frames in framesets, prefiguring the ‘Ajax’ or ‘Web 2.0’ style of development”, the pattern the 2005 moment names. Then, though, “the means to communicate with servers generally involved reloading whole Web pages”. Eich counts himself among those who curse the language, “a quickie love-child of C and Self”, and borrows words he credits to Dr. Johnson: “the part that is good is not original, and the part that is original is not good.” And still: “JS beat Java on the client.”'
  ])('should tell the need and the language from Eich’s own words, words and links together: %s', told => {
    expect(itemHeadedBy('1995', 'Pages need to respond')).toHaveTextContent(told);
  });

  test.each(['not an application platform', 'never shipped publicly', 'He never romanticized it'])('should leave out "%s", which the sources do not hold', claim => {
    expect(itemHeadedBy('1995', 'Pages need to respond')).not.toHaveTextContent(claim);
  });

  test('should link Keith’s line to his journal, and shelve it', () => {
    expect(within(itemHeadedBy('1995', 'Pages need to respond')).getByRole('link', {name: '“Java is to JavaScript as ham is to hamster.”', hidden: true})).toHaveAttribute('href', 'https://adactio.com/journal/1595');
    expect(within(screen.getByRole('region', {name: 'The research'})).getByRole('link', {name: 'Misunderstanding markup', hidden: true})).toHaveAttribute('href', 'https://adactio.com/journal/1595');
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
    'The catching-up took a decade of feedback: tests, hacks, and public scoreboards.',
    'and one line thanks “Chris Wilson of Microsoft, who prodded us into actually finishing the Test Suite”: the same Chris Wilson whose IE3 team had shipped with little of the box model.',
    'Hundreds of designs followed, and not one change to the markup: the same structure under any presentation.',
    'The garden showed the other side: hold the structure constant and the design can be replaced any number of times without a change to the markup.',
    'The browsers converged once the people writing the specification were the people shipping it.',
    'The posture from 1994, the specification following the field, had become the rule.',
    'Ajax let a page fetch data and rewrite itself without reloading.',
    'John Resig’s jQuery stripped the repetition out in 2006: events, animation, Ajax calls, and DOM crawling wrapped as one API that hid the differences between the browsers then installed.',
    'The single-page application inverted the premise: the document no longer carried the application, the application emitted the document.',
    'The web had run this experiment before, as JavaScript Style Sheets, when Netscape 4 rendered style by translating it into script; this time the industry’s weight was behind it.',
    'Even Berners-Lee’s 1991 wish for “a nestable <SECTION>..</SECTION> element” resurfaced as the section element, twenty-three years later.',
    'What changed each time was where the rendering happens; the three responsibilities did not move.',
    'Someone needs something, the community answers, and the platform learns the answer. The needs have not stopped arriving.',
    'The markup of the time said it plainly:'
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
    [/Viola/, /Mocha/, /ham is to hamster/, /MULTICOL/, /Wired News/, /React in 2013/, /CSS-in-JS/, /Next\.js/, /island of behavior/, /WorldWideWeb/, /Self-ish/, /eczema/, /aural/, /hid the differences between the browsers then installed/, /Chedeau/, /Sylor-Miller/, /you’re screwed/, /40% helvetica/, /Fahrner/, /Enquire/, /dictatorship/, /WHATWG/, /Living Standard/, /real-world web developers/]
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
    ['Someone needs to go first', 'https://stopdesign.com/archive/2012/10/11/ten-years-later.html', '“marked the first time a large, well-known, daily-content publisher had dropped tables for layout”'],
    ['The specification needs its tests', 'https://www.w3.org/2011/05/css-pr.html.en', '“Time ensured quality and interoperability”'],
    ['The language needs a standard', 'https://262.ecma-international.org/5.1/', '“adopted by the Ecma General Assembly of June 1997”'],
    ['The standard needs to move again', 'https://en.wikipedia.org/wiki/ECMAScript_version_history', '“On 3 December 2009, ECMA-262 5th edition was published”'],
    ['The application needs a frame', 'https://en.wikipedia.org/wiki/AngularJS', '“JavaScript-based web framework for developing single-page applications”']
  ])('should tell %s, its fuller story quoting its source by a link', (title, source, quotation) => {
    const entry = itemHeadedBy('the timeline', title);

    expect(within(within(entry).getByRole('group')).getByRole('link', {name: quotation, hidden: true})).toHaveAttribute('href', source);
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

  test('should quote the CSS working group where the record tells of CSS3’s modules', () => {
    expect(screen.getByText(/module system, begun in 1999/)).toHaveTextContent('module system, begun in 1999 so the language could advance a piece at a time instead of as “a single monolithic specification”.');
    expect(screen.getByRole('link', {name: '“a single monolithic specification”'}))
      .toHaveAttribute('href', 'https://www.w3.org/TR/css-2023/');
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
