import {FC} from 'react';
import {Moment} from './Moment';
import {moments} from './moments';

export const PageBecomesApplication: FC = () =>
  <Moment of={moments.pageBecomesApplication}
    tells={<>Ajax let a page fetch data and rewrite itself without reloading. Garrett named the approach and pointed at Google’s newest products,
      most of them betas, as its highest-profile examples. jQuery followed, and then the
      frameworks came.</>}>
    <p className="paragraph muted-ink hyphenated">Jesse James Garrett published{' '}
      <a className="signpost" href="https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php">the
        essay</a> on February 18, 2005, insisting that{' '}
      <a className="signpost" href="https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php">“Ajax isn’t a technology”</a> but several: standards-based markup
      and CSS, the DOM for dynamic display, XMLHttpRequest for asynchronous retrieval,{' '}
      <a className="signpost" href="https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php">“and JavaScript binding everything together”</a>. Why coin a name at
      all? He needed, he said,{' '}
      <a className="signpost" href="https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php">something shorter to use with clients</a> than the whole acronym
      soup.</p>
    <p className="paragraph muted-ink hyphenated">His exhibits were Google Suggest and Google Maps (Maps had launched ten days
      before the essay), plus Gmail, Orkut, and the Google Groups beta, with Flickr and
      Amazon’s A9 close behind. He claimed practicality, not invention:{' '}
    <a className="signpost" href="https://web.archive.org/web/20071002213206/http://www.adaptivepath.com/ideas/essays/archives/000385.php">“Neither Adaptive Path nor Google invented Ajax”</a>; the products
      simply proved the approach worked outside a laboratory. The pattern was older than
      the name: XMLHTTP had shipped in IE5, and Eich points to hidden-frame applications{' '}
    <a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">“even in late 1995”</a> prefiguring the whole style. His summary of
      JavaScript’s role in the era:{' '}
    <a className="signpost" href="https://www.computerworld.com/article/3458282/the-a-z-of-programming-languages-javascript.html">“JS was the tap root.”</a></p>
    <p className="paragraph muted-ink hyphenated">John Resig’s jQuery stripped the repetition out in 2006: events, animation, Ajax calls, and DOM
      crawling wrapped as one API that hid the differences between the browsers then installed. Then the frameworks came to organize what script was now building:
      AngularJS in 2010, React in 2013, Vue in 2014. The page stopped being a document you
      fetched and started being a program you ran.</p>
    <p className="paragraph muted-ink hyphenated">What the language’s standard did next is the 2009 moment.</p>
  </Moment>;
