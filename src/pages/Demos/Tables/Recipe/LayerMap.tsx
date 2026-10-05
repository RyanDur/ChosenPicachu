import {FC} from 'react';

const heading = {layer: 'the layer', askedFor: 'asked for by', mouse: 'by mouse', keyboard: 'by keyboard'};

type Layer = Record<keyof typeof heading, string>;

const layers: Layer[] = [
  {layer: 'Move a column', askedFor: '“comparing side by side”', mouse: 'drag the header', keyboard: 'nudge with arrows'},
  {layer: 'Move a row', askedFor: '“arranged the way I think”', mouse: 'drag the grip', keyboard: 'nudge with arrows'},
  {layer: 'Rank by a measure', askedFor: '“what matters most on top”', mouse: 'a menu on the header', keyboard: 'the same menu, focused'},
  {layer: 'Widen a column', askedFor: 'precision they can actually read', mouse: 'drag the edge', keyboard: 'arrows on the handle'}
];

const CellHeading: FC<{children: string}> = ({children}) =>
  <span className="cell-heading caption uppercase">{children}</span>;

export const LayerMap: FC = () =>
  <>
    <p className="overview paragraph">
      Now the table earns features, each one traceable to something the trader said. The
      machine has a mouse and a keyboard, so every arrangement a hand can make, a key can make
      too. Both axes, every layer, or the layer is not done.
    </p>
    <table className="tutorial-table contained">
      <caption className="off-screen">the layers</caption>
      <thead className="tutorial-headings">
        <tr className="ink-underline">
          {Object.values(heading).map(name =>
            <th className="tutorial-cell caption uppercase" scope="col" key={name}>{name}</th>)}
        </tr>
      </thead>
      <tbody className="tutorial-rows hairline-separated">
        {layers.map(({layer, askedFor, mouse, keyboard}) =>
          <tr className="tutorial-row" key={layer}>
            <th className="tutorial-cell" scope="row">{layer}</th>
            <td className="tutorial-cell clue"><CellHeading>{heading.askedFor}</CellHeading>{' '}<span className="italic">{askedFor}</span></td>
            <td className="tutorial-cell muted-ink"><CellHeading>{heading.mouse}</CellHeading>{' '}{mouse}</td>
            <td className="tutorial-cell muted-ink"><CellHeading>{heading.keyboard}</CellHeading>{' '}{keyboard}</td>
          </tr>)}
      </tbody>
    </table>
  </>;
