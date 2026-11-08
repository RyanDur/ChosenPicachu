import {FC} from 'react';
import coinbaseSource from '@pages/Demos/Market/coinbase.ts?sample';
import {Snippet, carve} from '@pages/Demos/Recipe';

export const DecodeTradeCarve: FC = () => <Snippet label="TS" lines={carve.unit(coinbaseSource, 'const decodeTrade')}/>;
