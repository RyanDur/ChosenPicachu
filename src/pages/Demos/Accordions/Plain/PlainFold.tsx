import {FC, useEffect, useReducer} from 'react';
import {asyncResult, has, maybe} from '@ryandur/sand';
import {bannerChange, useBannerDispatch} from '@banners';
import {measured, useMeasuredOnResize} from '../../Stage';
import {plainFold} from './plain-fold';
import {plainFoldChange} from './plain-fold-change';
import './PlainFold.css';

export const PlainFold: FC = () => {
  const dispatchBanner = useBannerDispatch();
  const [{foldMarkup, body, height}, dispatch] = useReducer(plainFold.reduce, plainFold.initial);

  useEffect(() => asyncResult(import('./assemble'))
    .onSuccess(({foldAssembly}) => dispatch(plainFoldChange.assembled(foldAssembly.markup())))
    .onFailure(() => dispatchBanner(bannerChange.raised('the plain fold could not be assembled')))
    .cancel, [dispatchBanner]);

  useMeasuredOnResize(maybe, dispatch, plainFoldChange.grown, body);

  return <iframe className="plain-fold" title="A fold measured by plain script"
    style={has(height) ? {'--stage-block-size': `${height}px`} : undefined}
    onLoad={event => maybe(event.currentTarget.contentDocument).mBind(({body}) => maybe(body)).map(loaded => {
      dispatch(plainFoldChange.loaded(loaded));
      measured(maybe(loaded), dispatch, plainFoldChange.grown);
    })}
    srcDoc={foldMarkup}/>;
};
