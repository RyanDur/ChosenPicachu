import {useSearchParamsObject} from '@navigation/search-params';
import {FoldMotion, foldMotionParam} from './fold-motion';
import {FoldType, foldTypeParam} from './fold-type';

type FoldDials = {
  type: FoldType;
  motion: FoldMotion;
  chooseType: (type: FoldType) => void;
  chooseMotion: (motion: FoldMotion) => void;
};

export const useFoldDials = (): FoldDials => {
  const {type, style, updateSearchParams} =
    useSearchParamsObject({type: foldTypeParam, style: foldMotionParam}, {type: 'exclusive', style: 'reveal'});
  return {
    type,
    motion: style,
    chooseType: next => updateSearchParams({type: next}),
    chooseMotion: next => updateSearchParams({style: next})
  };
};
