import {FC} from 'react';

const layers: [string, string, string, string][] = [
  ['Move a column', '“comparing side by side”', 'drag the header', 'nudge with arrows'],
  ['Move a row', '“arranged the way I think”', 'drag the grip', 'nudge with arrows'],
  ['Rank by a measure', '“what matters most on top”', 'a menu on the header', 'the same menu, focused'],
  ['Widen a column', 'precision they can actually read', 'drag the edge', 'arrows on the handle']
];

export const LayerMap: FC = () =>
  <>
    <p className="overview paragraph">
      Now the table earns features, each one traceable to something the trader said. The
      machine has a mouse and a keyboard, so every arrangement a hand can make, a key can make
      too. Both axes, every layer, or the layer is not done.
    </p>
    <table className="tutorial-table layer-map">
      <thead>
        <tr>
          <th scope="col">the layer</th>
          <th scope="col">asked for by</th>
          <th scope="col">by mouse</th>
          <th scope="col">by keyboard</th>
        </tr>
      </thead>
      <tbody>
        {layers.map(([layer, askedFor, mouse, keyboard]) =>
          <tr key={layer}>
            <th scope="row" className="layer">{layer}</th>
            <td className="clue">{askedFor}</td>
            <td className="tells">{mouse}</td>
            <td className="tells">{keyboard}</td>
          </tr>)}
      </tbody>
    </table>
  </>;
