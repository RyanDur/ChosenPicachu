import {FC} from 'react';
import {Figure} from '../../Recipe';
import './SlotsFigure.css';

export const SlotsFigure: FC = () =>
  <Figure className="slots" viewBox="0 -20 480 150" title="Where a switch counts" says={<>
    The carried column is moving right. A dead zone at the near edge of its neighbour holds still: a quarter of the
    neighbour’s width, or more when the neighbour is much the wider. Past it, the two switch. Coming back the other way,
    the dead zone is at the other edge.
  </>}>
    <rect className="slot paper-filled drawn" x="10" y="20" width="110" height="70"/>
    <rect className="slot paper-filled drawn" x="120" y="20" width="160" height="70"/>
    <rect className="slot paper-filled drawn" x="280" y="20" width="90" height="70"/>
    <rect className="slot paper-filled drawn" x="370" y="20" width="100" height="70"/>
    <rect className="part still faded-leather-filled" x="120" y="20" width="40" height="70"/>
    <rect className="part swaps faded-mint-filled" x="160" y="20" width="120" height="70"/>
    <text className="drawn-caption" x="65" y="60" textAnchor="middle">carried</text>
    <text className="drawn-caption" x="140" y="12" textAnchor="middle">dead</text>
    <text className="drawn-caption" x="220" y="110" textAnchor="middle">a switch counts</text>
  </Figure>;
