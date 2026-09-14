import {SubmitEvent, useState} from 'react';
import {Maybe, nothing, some} from '@ryandur/sand';
import {gotoTopOfPage} from '@components/scroll';
import {useGallery} from '@components/art-gallery/Art/Context';
import {numberParam, useSearchParamsObject} from '@components/search-params';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import './PageControl.css';

const typed = (value: string): Maybe<number> => value === '' ? nothing() : some(+value);

export const PageControl = () => {
  const {pagination} = useGallery();
  const {page, size, updateSearchParams} = useSearchParamsObject({page: numberParam, size: numberParam}, {
    page: 1,
    size: defaultRecordLimit
  });
  const [pageNumber, updatePageNumber] = useState<Maybe<number>>(nothing());
  const [pageSize, updatePageSize] = useState<Maybe<number>>(nothing());

  const firstPage = 1;
  const lastPage = pagination?.totalPages;

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    gotoTopOfPage();
    event.currentTarget.reset();
    updateSearchParams({page: pageNumber.orElse(page), size: pageSize.orElse(size)});
    updatePageNumber(nothing());
    updatePageSize(nothing());
  };

  return <form onSubmit={onSubmit} id="page-control" className="page-control backdrop">
    <label id="go-to-label" className="go-to-label control-label field" htmlFor="go-to">Page #{page}</label>
    <input type="number"
           id="go-to"
           min={firstPage}
           max={lastPage}
           className="go-to control borderless"
           onChange={event => updatePageNumber(typed(event.currentTarget.value))}/>
    <label id="per-page-label" className="per-page-label control-label field" htmlFor="per-page">{size} Per Page</label>
    <input type="number"
           className="per-page control borderless"
           min={1}
           max={100}
           id="per-page"
           onChange={event => updatePageSize(typed(event.currentTarget.value))}/>
    <button type="submit" id="submit-page-number" className="submit-page control borderless field bold attentive">Go
    </button>
  </form>;
};
