import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {
  BannerExplained,
  cardOneParam,
  FormsContextExplained,
  MenuExplained,
  PopoverExplained,
  raisedParam,
  StackingExplained,
  wornParam
} from '../../ZIndexDemo';
import {TopLayerTutorial} from '../../ZIndexDemo/Tutorial';
import {ZIndexIntroduction} from '../../ZIndexDemo/Introduction';

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
