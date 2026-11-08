import {SubmitEvent, useId} from 'react';
import {Maybe, maybe} from '@ryandur/sand';
import {numberParam} from '@navigation/search-params';
import {useGallery} from '@pages/Gallery/Context';
import './PageControl.css';

const typed = (form: FormData, field: string): Maybe<number> =>
  maybe(form.get(field)).mBind(value => maybe(numberParam.decode(value)));

export const PageControl = () => {
  const {pagination, page, size, updateSearchParams} = useGallery();
  const goTo = useId();
  const perPage = useId();

  const firstPage = 1;
  const lastPage = pagination.map(({totalPages}) => totalPages).orElse(undefined);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const typedIn = new FormData(event.currentTarget);
    event.currentTarget.reset();
    updateSearchParams({page: typed(typedIn, 'page').orElse(page), size: typed(typedIn, 'size').orElse(size)},
      {preventScrollReset: false});
  };

  return <form onSubmit={onSubmit} className="page-control backdrop">
    <label className="go-to-label control-label field next-approached" htmlFor={goTo}>Page
      #{page}</label>
    <input type="number"
      id={goTo}
      min={firstPage}
      max={lastPage}
      name="page"
      className="go-to control borderless focus-ringed"/>
    <label className="per-page-label control-label field next-approached" htmlFor={perPage}>{size} Per Page</label>
    <input type="number"
      className="per-page control borderless focus-ringed"
      min={1}
      max={100}
      id={perPage}
      name="size"/>
    <button type="submit" className="submit-page control borderless field bold square-cornered attentive">Go
    </button>
  </form>;
};
