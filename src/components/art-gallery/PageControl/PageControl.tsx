import {SubmitEvent} from 'react';
import {Maybe, maybe} from '@ryandur/sand';
import {gotoTopOfPage} from '@components/scroll';
import {paginationOf, useGallery} from '@components/art-gallery/Art/Context';
import {numberParam, useSearchParamsObject} from '@components/search-params';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import './PageControl.css';

const typed = (form: FormData, field: string): Maybe<number> =>
  maybe(form.get(field)).mBind(value => maybe(numberParam.decode(value)));

export const PageControl = () => {
  const pagination = paginationOf(useGallery().wall);
  const {page, size, updateSearchParams} = useSearchParamsObject({page: numberParam, size: numberParam}, {
    page: 1,
    size: defaultRecordLimit
  });

  const firstPage = 1;
  const lastPage = pagination.map(({totalPages}) => totalPages).orElse(undefined);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const typedIn = new FormData(event.currentTarget);
    gotoTopOfPage();
    event.currentTarget.reset();
    updateSearchParams({page: typed(typedIn, 'page').orElse(page), size: typed(typedIn, 'size').orElse(size)});
  };

  return <form onSubmit={onSubmit} id="page-control" className="page-control backdrop">
    <label id="go-to-label" className="go-to-label control-label field" htmlFor="go-to">Page #{page}</label>
    <input type="number"
      id="go-to"
      min={firstPage}
      max={lastPage}
      name="page"
      className="go-to control borderless"/>
    <label id="per-page-label" className="per-page-label control-label field" htmlFor="per-page">{size} Per Page</label>
    <input type="number"
      className="per-page control borderless"
      min={1}
      max={100}
      id="per-page"
      name="size"/>
    <button type="submit" id="submit-page-number" className="submit-page control borderless field bold attentive">Go
    </button>
  </form>;
};
