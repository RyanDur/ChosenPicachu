import {FC} from 'react';

const layers: [string, string, string, string][] = [
  ['Move a column', '“comparing side by side”', 'drag the header', 'nudge with arrows'],
  ['Move a row', '“arranged the way I think”', 'drag the grip', 'nudge with arrows'],
  ['Rank by a measure', '“what matters most on top”', 'a menu on the header', 'the same menu, focused'],
  ['Widen a column', 'precision they can actually read', 'drag the edge', 'arrows on the handle']
];

const heading = {layer: 'the layer', askedFor: 'asked for by', mouse: 'by mouse', keyboard: 'by keyboard'};

const CellHeading: FC<{children: string}> = ({children}) =>
  <span className="cell-heading caption uppercase" aria-hidden="true">{children}</span>;

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
        {layers.map(([layer, askedFor, mouse, keyboard]) =>
          <tr className="tutorial-row" key={layer}>
            <th className="tutorial-cell" scope="row">{layer}</th>
            <td className="tutorial-cell clue"><CellHeading>{heading.askedFor}</CellHeading><span className="italic">{askedFor}</span></td>
            <td className="tutorial-cell muted-ink"><CellHeading>{heading.mouse}</CellHeading>{mouse}</td>
            <td className="tutorial-cell muted-ink"><CellHeading>{heading.keyboard}</CellHeading>{keyboard}</td>
          </tr>)}
      </tbody>
    </table>
  </>;
