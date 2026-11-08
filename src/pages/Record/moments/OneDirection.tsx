import {FC} from 'react';
import {Link} from 'react-router';
import {Moment} from './Moment';
import {moments} from '../calendar';

const fluxOverview = 'https://facebookarchive.github.io/flux/docs/in-depth-overview';
const elmArchitecture = 'https://guide.elm-lang.org/architecture/';
const reduxPrinciples = 'https://redux.js.org/understanding/thinking-in-redux/three-principles';

export const OneDirection: FC = () =>
  <Moment heading={moments.headings.oneDirection}
    summary={<>Two-way binding let a change in the page change the model and a change in the model change the page.
      Facebook found that it led to cascading updates. Its answer was Flux, a pattern in which data moves one way only,
      and Flux’s code went public in July 2014.</>}>
    <p className="paragraph muted-ink hyphenated">Facebook’s Flux documentation names what it
      saw: <a className="signpost" href={fluxOverview}>“two-way data bindings led to cascading updates, where changing one
        object led to another object changing, which could also trigger more updates”</a>. Its answer
      was <a className="signpost" href={fluxOverview}>“a unidirectional data flow”</a>. An action is a plain description of
      what happened. A view sends it through one dispatcher, which passes every action on to the stores that hold
      the data, and the stores redraw the views. Flux’s code went public in July 2014.</p>
    <p className="paragraph muted-ink hyphenated">The guide to Elm, a language for web pages, describes the same shape.
      It says every program <a className="signpost" href={elmArchitecture}>“always breaks into three parts”</a>, a model, a view and
      an update, and that the pattern <a className="signpost" href={elmArchitecture}>“seems to emerge naturally in Elm”</a> rather
      than being invented. Redux, whose 1.0 came out in August 2015, wrote it down for JavaScript in three
      principles, among them that <a className="signpost" href={reduxPrinciples}>“The only way to change the state is to emit
        an action, an object describing what happened.”</a></p>
    <p className="paragraph muted-ink hyphenated"><Link className="signpost" to={`#${moments.headings.frameworks.id}`}>The 2010
      moment</Link> tells the binding Flux answered. This site keeps the direction and none of the libraries: an event
      goes in, a pure function returns the next state, and the page is drawn from it.</p>
  </Moment>;
