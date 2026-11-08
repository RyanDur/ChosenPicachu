import {LoaderFunctionArgs, useLoaderData} from 'react-router';
import {asyncFailure, maybe, Result} from '@ryandur/sand';
import {HTTPError} from '@transport';
import {Art, art, sourceParam} from '@pages/Gallery/museums';
import {opening} from '@pages/Gallery/opening';

type Asked = {readonly piece: Promise<Result<Art, HTTPError>>};

const museumIn = (address: string) =>
  maybe(sourceParam.decode(new URL(address).searchParams.get('tab'))).orElse(opening.museum);

export const askedPiece = {
  loader: ({params, request}: LoaderFunctionArgs): Asked => {
    const asked = maybe(params.id)
      .map(id => art.get({id, source: museumIn(request.url)}))
      .orElse(asyncFailure(HTTPError.NOT_FOUND));
    request.signal.addEventListener('abort', asked.cancel);
    return {piece: asked.value};
  },
  useAsked: (): Asked => useLoaderData<Asked>()
};
