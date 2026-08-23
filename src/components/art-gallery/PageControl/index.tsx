import {FormEvent, useState} from 'react';
import {gotoTopOfPage} from '@pages/scroll';
import {useGallery} from '@components/art-gallery/Art/Context';
import {numberParam, useSearchParamsObject} from '@components/search-params';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import './PageControl.css';

export const PageControl = () => {
  const {art} = useGallery();
  const {page, size, updateSearchParams} = useSearchParamsObject({page: numberParam, size: numberParam}, {page: 1, size: defaultRecordLimit});
  const [pageNumber, updatePageNumber] = useState(page);
  const [pageSize, updatePageSize] = useState(size);

  const firstPage = 1;
  const lastPage = art?.pagination?.totalPages ?? Number.MAX_VALUE;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    gotoTopOfPage();
    event.currentTarget.reset();
    updateSearchParams({page: pageNumber, size: pageSize});
  };

  return <form onSubmit={onSubmit} id="page-control" className="void">
    <input type="number"
           id="go-to"
           min={firstPage}
           max={lastPage}
           className="control input"
           onChange={event => updatePageNumber(+event.currentTarget.value)}/>
    <label id="go-to-label" className="control-label paper" htmlFor="go-to">Page #{page}</label>
    <input type="number"
           className="control input"
           min={1}
           max={100}
           id="per-page"
           onChange={event => updatePageSize(+event.currentTarget.value)}/>
    <label id="per-page-label" className="control-label paper" htmlFor="per-page">{size} Per Page</label>
    <button type="submit" id="submit-page-number" className="control paper bold">Go</button>
  </form>;
};
