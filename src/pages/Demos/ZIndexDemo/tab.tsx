import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {BannerExplained} from './BannerExplained';
import {cardOneParam} from './card-one';
import {FormsContextExplained} from './FormsContextExplained';
import {MenuExplained} from './MenuExplained';
import {PopoverExplained} from './PopoverExplained';
import {raisedParam} from './raised';
import {StackingExplained} from './Explained';
import {wornParam} from './worn';
import {TopLayerTutorial} from './Tutorial';
import {ZIndexIntroduction} from './Introduction';

const ZIndexTab: FC = () => {
  const {raised, 'card-one': cardOne, wears, updateSearchParams} = useSearchParamsObject(
    {raised: raisedParam, 'card-one': cardOneParam, wears: wornParam},
    {raised: 'none', 'card-one': 'contained', wears: 'nothing'});

  return <>
    <ZIndexIntroduction/>
    <StackingExplained raised={raised} onRaised={next => updateSearchParams({raised: next})}/>
    <MenuExplained cardOne={cardOne} onCardOneChosen={next => updateSearchParams({'card-one': next})}/>
    <FormsContextExplained worn={wears} onWornChosen={next => updateSearchParams({wears: next})}/>
    <PopoverExplained/>
    <BannerExplained/>
    <TopLayerTutorial/>
  </>;
};

export default ZIndexTab;
