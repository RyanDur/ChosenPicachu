import {FC} from 'react';
import coinbaseSource from '@pages/Demos/Market/coinbase.ts?sample';
import {Snippet, lines, carve} from '@pages/Demos/Recipe';

export const TradeDecoderCarve: FC = () => <Snippet label="TS" lines={[
  ...carve.unit(coinbaseSource, 'const tradeFields'), lines.blank,
  ...carve.unit(coinbaseSource, 'const MatchDecoder')
]}/>;
