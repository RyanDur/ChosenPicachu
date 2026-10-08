import {FC} from 'react';
import {Arrow, Box, Chevron, Circle, Diagram, Part, Label} from '../Recipe/Drawing';
import {FoldInput} from './fold-type';
import './Diagrams.css';

export const OneJobTwoWays: FC<{input: FoldInput}> = ({input}) =>
  <Diagram title="One job, two ways" height={150}
    says={`Details holds its summary and its content, where the trick needs a ${input}, a label that presses it through for, and the text, in that order.`}>
    <Label x={80} y={14}>natively</Label>
    <Box x={10} y={22} width={140} height={116} kind="native"/>
    <Label x={80} y={38}>details</Label>
    <Part x={22} y={46} width={116} height={26} kind="piece" name="summary"/>
    <Part x={22} y={80} width={116} height={46} kind="piece" name="content"/>
    <Label x={240} y={14}>by trick</Label>
    <Box x={170} y={22} width={140} height={116} kind="clip"/>
    <Label x={240} y={38}>li</Label>
    <Part x={182} y={46} width={40} height={26} kind="piece" name="input"/>
    <Part x={242} y={46} width={56} height={26} kind="piece" name="label"/>
    <Part x={182} y={80} width={116} height={46} kind="piece" name="p"/>
    <Arrow through={[{x: 242, y: 59}, {x: 224, y: 59}]}/>
  </Diagram>;

export const OffScreenNotGone: FC = () =>
  <Diagram title="Off screen, not gone" height={120}
    says="The box sits past the left edge, so it takes no room and draws nothing, yet Tab still stops on it.">
    <Box x={110} y={20} width={200} height={70} kind="piece"/>
    <Label x={210} y={36}>the viewport</Label>
    <Part x={125} y={48} width={170} height={26} kind="native" name="label, the bar"/>
    <Part x={14} y={48} width={40} height={26} kind="unseen" name="input"/>
    <Label x={34} y={40}>Tab</Label>
    <Arrow through={[{x: 310, y: 104}, {x: 54, y: 104}]}/>
    <Label x={182} y={116}>right: 1000vw</Label>
  </Diagram>;

export const TheSheetReadsTheBox: FC = () =>
  <Diagram title="The sheet reads the box" height={110}
    says="The rule matches an unchecked box, then reaches forward to the text after it and collapses it. Nothing before the box can be reached.">
    <Label x={160} y={18}>.info-toggle:not(:checked) ~ .info</Label>
    <Part x={16} y={34} width={70} height={26} kind="unseen" name="input"/>
    <Part x={125} y={34} width={70} height={26} kind="piece" name="label"/>
    <Part x={234} y={34} width={70} height={26} kind="native" name="p"/>
    <Arrow through={[{x: 51, y: 60}, {x: 51, y: 84}, {x: 269, y: 84}, {x: 269, y: 62}]}/>
    <Label x={160} y={102}>~ looks forward only</Label>
  </Diagram>;

export const TwoBordersTurned: FC = () =>
  <Diagram title="Two borders, turned" height={100}
    says="An empty box with only its top and right borders points right at 45 degrees and down at 135.">
    <Chevron x={90} y={44} turn={45}/>
    <Label x={90} y={88}>closed, 45°</Label>
    <Chevron x={230} y={40} turn={135}/>
    <Label x={230} y={88}>open, 135°</Label>
  </Diagram>;

export const FocusOnTheBar: FC = () =>
  <Diagram title="Focus on the box, drawn on the bar" height={110}
    says="The box off screen holds the keyboard’s focus, and the sheet carries it forward to the bar the reader sees.">
    <Box x={110} y={20} width={200} height={70} kind="piece"/>
    <Label x={210} y={36}>the viewport</Label>
    <Box x={125} y={48} width={170} height={26} kind="ring"/>
    <Label x={210} y={65}>label, lit and ringed</Label>
    <Box x={14} y={48} width={40} height={26} kind="unseen-ring"/>
    <Label x={34} y={65}>focus</Label>
    <Arrow through={[{x: 54, y: 61}, {x: 123, y: 61}]}/>
    <Label x={88} y={104}>:focus-visible ~</Label>
  </Diagram>;

export const OneGuessTwoParts: FC = () =>
  <Diagram title="One guess, two parts" height={170}
    says="Both parts stop at their own text, but the motion crosses the whole guess, so the short part is open almost at once and shuts only after a wait.">
    <Label x={160} y={18}>max-height: the guess</Label>
    <Box x={40} y={30} width={100} height={110} kind="unseen"/>
    <Box x={40} y={30} width={100} height={30} kind="clip"/>
    <Box x={50} y={36} width={80} height={18} kind="native"/>
    <Label x={90} y={160}>short: guess mostly empty</Label>
    <Box x={180} y={30} width={100} height={110} kind="unseen"/>
    <Box x={180} y={30} width={100} height={80} kind="clip"/>
    <Box x={190} y={36} width={80} height={68} kind="native"/>
    <Label x={230} y={160}>tall: less of it empty</Label>
  </Diagram>;

export const TheKnownHeight: FC = () =>
  <Diagram title="The known height" height={150}
    says="Every panel opens to the same ten lines, so a short part leaves room under its text and a tall one scrolls inside its panel.">
    <Label x={160} y={18}>height: 10lh</Label>
    <Box x={40} y={30} width={100} height={96} kind="clip"/>
    <Box x={50} y={40} width={80} height={24} kind="native"/>
    <Label x={90} y={146}>short text, room below</Label>
    <Box x={180} y={30} width={100} height={96} kind="clip"/>
    <Box x={190} y={40} width={80} height={86} kind="native"/>
    <Box x={190} y={126} width={80} height={10} kind="clipped"/>
    <Label x={230} y={146}>tall text, scrolls</Label>
  </Diagram>;

export const OneNameOneChoice: FC = () =>
  <Diagram title="One name, one choice" height={150}
    says="Radios that share a name make one group, so choosing one part unchooses the last, and Close is the choice that shows nothing.">
    {['Close', 'first part', 'second part', 'third part'].map((part, at) =>
      <g key={part}>
        <Circle kind="piece" cx={40} cy={26 + at * 30} r={9}/>
        {at === 1 && <circle className="chosen drawn-filled" cx={40} cy={26 + at * 30} r={4}/>}
        <Label x={60} y={30 + at * 30} anchor="start">{part}</Label>
      </g>)}
    <polyline className="arrow hollow drawn" points="180,17 190,17 190,125 180,125"/>
    <Label x={200} y={75} anchor="start">name="group"</Label>
  </Diagram>;

export const ThreeBecomeTwo: FC = () =>
  <Diagram title="Three pieces become two" height={130}
    says="Summary is the bar and the control at once, so the box and its label fold into it, and the text becomes the details’ content.">
    <Part x={10} y={20} width={50} height={26} kind="unseen" name="input"/>
    <Part x={66} y={20} width={64} height={26} kind="piece" name="label"/>
    <Part x={10} y={54} width={120} height={46} kind="piece" name="p"/>
    <Arrow through={[{x: 140, y: 60}, {x: 176, y: 60}]}/>
    <Box x={186} y={10} width={124} height={100} kind="native"/>
    <Part x={196} y={20} width={104} height={26} kind="piece" name="summary"/>
    <Part x={196} y={54} width={104} height={46} kind="piece" name="content"/>
    <Label x={248} y={124}>details</Label>
  </Diagram>;

export const SizedToTheText: FC = () =>
  <Diagram title="Sized to the text" height={130}
    says="Closed, the part a details hides has no height, and open, it takes exactly its text’s height.">
    <Part x={20} y={20} width={120} height={26} kind="piece" name="summary"/>
    <line className="edge drawn" x1={20} y1={50} x2={140} y2={50}/>
    <Label x={80} y={66}>block-size: 0</Label>
    <Label x={80} y={124}>closed</Label>
    <Part x={180} y={20} width={120} height={26} kind="piece" name="summary"/>
    <Part x={180} y={50} width={120} height={50} kind="native" name="::details-content"/>
    <Label x={240} y={124}>open, block-size: auto</Label>
  </Diagram>;

export const WhatEachPromises: FC = () =>
  <table className="promises caption">
    <caption className="promises-title bold">What each element promises</caption>
    <thead>
      <tr>
        <td className="promise muted-rule-below"/>
        <th className="promise muted-rule-below" scope="col">closes on a second press</th>
        <th className="promise muted-rule-below" scope="col">one open at a time</th>
      </tr>
    </thead>
    <tbody>
      {[['checkbox', 'yes', 'no'], ['radio', 'no', 'yes'], ['details with a name', 'yes', 'yes']].map(([element, closes, one]) =>
        <tr key={element}>
          <th className="promise muted-rule-below" scope="row">{element}</th>
          <td className="promise muted-rule-below">{closes}</td>
          <td className="promise muted-rule-below">{one}</td>
        </tr>)}
    </tbody>
  </table>;

export const RowToItsContent: FC = () =>
  <Diagram title="A row that grows to its content" height={130}
    says="The text’s row is 0fr while the fold is closed and 1fr while it is open, and 1fr is the height its content asks for.">
    <Part x={20} y={20} width={120} height={26} kind="piece" name="bar"/>
    <line className="edge drawn" x1={20} y1={50} x2={140} y2={50}/>
    <Label x={80} y={66}>0fr</Label>
    <Label x={80} y={124}>closed</Label>
    <Part x={180} y={20} width={120} height={26} kind="piece" name="bar"/>
    <Part x={180} y={50} width={120} height={50} kind="native" name="1fr, the content"/>
    <Label x={240} y={124}>open</Label>
  </Diagram>;

export const PaddingInsideTheClip: FC = () =>
  <Diagram title="The padding inside the clip" height={150}
    says="The paragraph is a grid of one row that clips, its item is a span with no minimum height, and the padding sits on a span inside that one, so a closed row reaches 0 and no strip of text shows under the bar.">
    <Box x={10} y={10} width={300} height={130} kind="clip"/>
    <Label x={20} y={26} anchor="start">p, 0fr, clips</Label>
    <Box x={24} y={36} width={272} height={94} kind="piece"/>
    <Label x={34} y={52} anchor="start">span, the row’s item: min-height 0</Label>
    <Part x={38} y={62} width={244} height={58} kind="clipped" name="span, the text inside its padding"/>
  </Diagram>;

export const RidesTheEdge: FC = () =>
  <Diagram title="The text rides the row’s edge" height={170}
    says="The row grows with the text set at its bottom, so the text’s bottom edge stays on the row’s growing edge.">
    {[{open: 0, stage: 'start'}, {open: 0.5, stage: 'halfway'}, {open: 1, stage: 'open'}].map(({open, stage}, at) => {
      const x = 12 + at * 104;
      const edge = 88 + open * 50;
      return <g key={open}>
        <Box x={x} y={edge - 50} width={88} height={50} kind="clipped"/>
        <Box x={x} y={88} width={88} height={edge - 88} kind="native"/>
        <Part x={x} y={62} width={88} height={26} kind="piece" name="bar"/>
        <line className="edge drawn" x1={x - 6} y1={edge} x2={x + 94} y2={edge}/>
        <Label x={x + 44} y={162}>{stage}</Label>
      </g>;
    })}
  </Diagram>;
