import {FC} from 'react';
import {Moment} from './Moment';

export const BlurReturns: FC = () =>
  <Moment year="2013"
          title="JavaScript covers for the platform"
          tells={<>The single-page application moved the whole document into script: the server
            sent an empty body, and JavaScript rendered everything. Structure, content, and even
            style ran through one language again, because script was the only place components
            and scoped style existed yet.</>}>
            <p className="paragraph">The SPA shell is an empty div and a bundle; until the script runs there is no
    page. Blank first paints, fragile crawls, a document that cannot be read without
    executing a program. The livelier web had quietly inverted its own premise: the
    document no longer carried the application, the application emitted the document.</p>
    <p className="paragraph">Style followed structure into script as CSS-in-JS, the term arriving with{' '}
    <a className="signpost" href="https://blog.vjeux.com/2014/javascript/react-css-in-js-nationjs.html">Christopher
    Chedeau’s 2014 talk</a> cataloguing CSS-at-scale problems at Facebook. The web had run
    this experiment before: Netscape 4 rendering style by translating it into script,
    JavaScript Style Sheets’ second coming, this time with the industry’s weight behind
    it.</p>
    <p className="paragraph">And the document’s own habits had to be rebuilt by hand. Links became components,
    the back button became state, scroll restoration and URL fragments became libraries;
    the frameworks grew routers and scroll managers to re-create behaviors the browser had
    shipped for twenty years, the price of moving the document into script.</p>
  </Moment>;
