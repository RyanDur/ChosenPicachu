import {SubmitEvent} from 'react';
import {Maybe, maybe} from '@ryandur/sand';
import {numberParam} from '@components/search-params';
import {useGallery} from '@pages/Gallery/Context';
import './PageControl.css';

const typed = (form: FormData, field: string): Maybe<number> =>
  maybe(form.get(field)).mBind(value => maybe(numberParam.decode(value)));

export const PageControl = () => {
  const {pagination, page, size, updateSearchParams} = useGallery();

  const firstPage = 1;
  const lastPage = pagination.map(({totalPages}) => totalPages).orElse(undefined);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const typedIn = new FormData(event.currentTarget);
    event.currentTarget.reset();
    updateSearchParams({page: typed(typedIn, 'page').orElse(page), size: typed(typedIn, 'size').orElse(size)},
      {preventScrollReset: false});
  };

  return <form onSubmit={onSubmit} id="page-control" className="page-control backdrop">
    <label id="go-to-label" className="go-to-label control-label field next-approached" htmlFor="go-to">Page
      #{page}</label>
    <input type="number"
      id="go-to"
      min={firstPage}
      max={lastPage}
      name="page"
      className="go-to control borderless focus-ringed"/>
    <label id="per-page-label" className="per-page-label control-label field next-approached" htmlFor="per-page">{size} Per Page</label>
    <input type="number"
      className="per-page control borderless focus-ringed"
      min={1}
      max={100}
      id="per-page"
      name="size"/>
    <button type="submit" id="submit-page-number" className="submit-page control borderless field bold square-cornered attentive">Go
    </button>
  </form>;
};
