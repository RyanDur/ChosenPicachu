import {FC} from 'react';
import {Link} from 'react-router';
import {Moment} from './Moment';
import {moments} from './moments';

const flux = 'https://facebookarchive.github.io/flux/docs/in-depth-overview';
const elm = 'https://guide.elm-lang.org/architecture/';
const redux = 'https://redux.js.org/understanding/thinking-in-redux/three-principles';

export const OneDirection: FC = () =>
  <Moment of={moments.oneDirection}
    tells={<>Two-way binding let a change in the page change the model and a change in the model change the page. Facebook found the updates cascading out of reach, and in 2014 published Flux, a pattern in which data moves one way only.</>}>
    <p className="paragraph muted-ink hyphenated">Facebook’s Flux documentation names what it saw: <a className="signpost" href={flux}>“two-way data bindings led to cascading updates, where changing one object led to another object changing, which could also trigger more updates”</a>. Its answer was <a className="signpost" href={flux}>“a unidirectional data flow”</a>: a view sends an action through one dispatcher to the stores, and the stores redraw the views. Its code went public in July 2014.</p>
    <p className="paragraph muted-ink hyphenated">Elm, a language Evan Czaplicki began in 2012, had arrived at the same shape. Its guide says every program <a className="signpost" href={elm}>“always breaks into three parts”</a>, a model, a view and an update, and that the pattern <a className="signpost" href={elm}>“seems to emerge naturally in Elm”</a> rather than being invented. Redux, whose 1.0 came out in August 2015, wrote it down for JavaScript in three principles, among them that <a className="signpost" href={redux}>“The only way to change the state is to emit an action, an object describing what happened.”</a></p>
    <p className="paragraph muted-ink hyphenated"><Link className="signpost" to={`#${moments.frameworks.id}`}>The 2010 moment</Link> tells the binding these answered. This site keeps the direction and none of the libraries: an event goes in, a reducer returns the next state, and the page is drawn from it.</p>
  </Moment>;
