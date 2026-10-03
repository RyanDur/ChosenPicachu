import {FC, Fragment} from 'react';
import {Arrow, Box, Diagram, Kind, Label} from '../Recipe/Drawing';

type Layer = {kind: Kind; says: string};

const SeenFromTheSide: FC<{layers: [Layer, Layer, Layer]; under: string}> = ({layers, under}) => <>
  <Label x={60} y={14}>the reader</Label>
  <Arrow through={[{x: 60, y: 22}, {x: 60, y: 50}]}/>
  {layers.map(({kind, says}, at) => <Fragment key={says}>
    <Box kind={kind} x={20} y={60 + at * 28} width={180} height={16}/>
    <Label x={210} y={72 + at * 28} anchor="start">{says}</Label>
  </Fragment>)}
  <Box kind="native" x={10} y={144} width={200} height={16}/>
  <Label x={218} y={156} anchor="start">the page</Label>
  <Label x={110} y={184}>{under}</Label>
</>;

export const PileFromTheSide: FC = () =>
  <Diagram title="The pile from the side" height={190}
    says="With no z-index, the browser paints the cards in the order the code lists them, so the last one listed lands on top.">
    <SeenFromTheSide under="later in the code, nearer the reader" layers={[
      {kind: 'piece', says: 'Third, painted last'},
      {kind: 'piece', says: 'Second'},
      {kind: 'piece', says: 'First, painted first'}
    ]}/>
  </Diagram>;

export const OneNumberLiftsOneCard: FC = () =>
  <Diagram title="One number lifts one card" height={190}
    says="A positioned card with z-index: 1 is painted after every card left at auto, so First leaves the bottom and lands on top.">
    <SeenFromTheSide under="the others keep their order under it" layers={[
      {kind: 'topmost', says: 'First, z-index: 1'},
      {kind: 'piece', says: 'Third'},
      {kind: 'piece', says: 'Second'}
    ]}/>
  </Diagram>;

export const ANumberInsideALayer: FC = () =>
  <Diagram title="A number inside a layer" height={200}
    says="Card one is painted as one layer, menu and all, so the menu is on top of card one’s face and still under card two.">
    <Label x={60} y={14}>the reader</Label>
    <Arrow through={[{x: 60, y: 22}, {x: 60, y: 46}]}/>
    <Box kind="piece" x={20} y={54} width={180} height={16}/>
    <Label x={210} y={66} anchor="start">card two, 1</Label>
    <Box kind="clip" x={14} y={82} width={192} height={64}/>
    <Label x={214} y={98} anchor="start">card one, 1</Label>
    <Box kind="topmost" x={24} y={92} width={120} height={16}/>
    <Label x={84} y={104}>menu, 9999</Label>
    <Box kind="piece" x={24} y={120} width={172} height={16}/>
    <Label x={110} y={132}>card one’s face</Label>
    <Box kind="native" x={10} y={158} width={200} height={16}/>
    <Label x={218} y={170} anchor="start">the page</Label>
    <Label x={110} y={194}>9999 is on top only inside its card</Label>
  </Diagram>;

export const Where9999IsCompared: FC = () =>
  <Diagram title="Where 9999 is compared" height={180}
    says="Each card with a z-index makes its own context, a box its children are stacked in. The menu’s 9999 is compared only inside card one; at the page, card one and card two are compared at 1 and 1.">
    <Box kind="clip" x={10} y={10} width={300} height={150}/>
    <Label x={20} y={26} anchor="start">the page, the root context</Label>
    <Box kind="clip" x={22} y={38} width={148} height={110}/>
    <Label x={32} y={54} anchor="start">card one, 1</Label>
    <Box kind="topmost" x={34} y={66} width={124} height={26}/>
    <Label x={96} y={83}>menu, 9999</Label>
    <Box kind="piece" x={34} y={102} width={124} height={34}/>
    <Label x={96} y={123}>face, auto</Label>
    <Box kind="piece" x={182} y={38} width={116} height={110}/>
    <Label x={240} y={54}>card two, 1</Label>
    <Label x={240} y={100}>later in the code</Label>
    <Label x={160} y={176}>1 against 1, and the later card wins</Label>
  </Diagram>;

export const AboveThePage: FC = () =>
  <Diagram title="Above the page" height={240}
    says="The top layer sits over the root context and everything in it. Nothing is compared with the new menu, so it is drawn last, over both cards.">
    <Box kind="clip" x={10} y={10} width={300} height={44}/>
    <Label x={20} y={26} anchor="start">the top layer</Label>
    <Box kind="topmost" x={150} y={20} width={148} height={26}/>
    <Label x={224} y={37}>new menu</Label>
    <Box kind="clip" x={10} y={66} width={300} height={150}/>
    <Label x={20} y={82} anchor="start">the page, the root context</Label>
    <Box kind="clip" x={22} y={94} width={148} height={110}/>
    <Label x={32} y={110} anchor="start">card one, 1</Label>
    <Box kind="piece" x={34} y={122} width={124} height={26}/>
    <Label x={96} y={139}>old menu, 9999</Label>
    <Box kind="piece" x={34} y={158} width={124} height={34}/>
    <Label x={96} y={179}>face, auto</Label>
    <Box kind="piece" x={182} y={94} width={116} height={110}/>
    <Label x={240} y={110}>card two, 1</Label>
    <Label x={160} y={234}>nothing below is compared with it</Label>
  </Diagram>;
