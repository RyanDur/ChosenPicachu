import {FC} from 'react';
import {Figure} from '../../Recipe/Figure';
import './CrossingFigure.css';

export const CrossingFigure: FC = () =>
  <Figure className="crossing" viewBox="0 -20 480 150" title="Where a swap counts" says={<>
    The carried item is moving right. The first quarter of its neighbour holds
    still; past it, the two trade places. Coming back the other way, it is the quarter on the other side.
  </>}>
    <rect className="item paper-filled drawn" x="10" y="20" width="130" height="70"/>
    <rect className="item paper-filled drawn" x="140" y="20" width="120" height="70"/>
    <rect className="item paper-filled drawn" x="260" y="20" width="100" height="70"/>
    <rect className="item paper-filled drawn" x="360" y="20" width="110" height="70"/>
    <rect className="part still resting-filled" x="140" y="20" width="30" height="70"/>
    <rect className="part swaps swapping-filled" x="170" y="20" width="90" height="70"/>
    <text className="drawn-caption" x="75" y="60" textAnchor="middle">carried</text>
    <text className="drawn-caption" x="155" y="12" textAnchor="middle">still</text>
    <text className="drawn-caption" x="215" y="110" textAnchor="middle">a swap counts</text>
  </Figure>;
