import {SubmitEvent, useId} from 'react';
import {Maybe, maybe} from '@ryandur/sand';
import {numberParam} from '@navigation/search-params';
import {useGallery} from '@pages/Gallery/Context';
import {keptForm} from '@pages/Gallery/keptForm';
import {pages} from '@pages/Gallery/pages';
import './PageControl.css';

const typed = (form: FormData, field: string): Maybe<number> =>
  maybe(form.get(field)).mBind(value => maybe(numberParam.decode(value)));

export const PageControl = () => {
  const {pagination, page, size, updateSearchParams} = useGallery();
  const goTo = useId();
  const perPage = useId();
  const formKey = keptForm.useKey('pages');

  const firstPage = 1;
  const lastPage = pagination.map(({totalPages}) => totalPages).orElse(undefined);
  const pageShown = pagination.map(({totalPages}) => Math.min(page, Math.max(totalPages, firstPage))).orElse(page);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const typedIn = new FormData(event.currentTarget);
    event.currentTarget.reset();
    const sizeChosen = typed(typedIn, 'size').orElse(size);
    const pageChosen = typed(typedIn, 'page').orElse(page);
    updateSearchParams({
      page: pages.withinTheEnd(pageChosen, sizeChosen, pagination),
      size: sizeChosen
    }, {preventScrollReset: false, state: keptForm.across('pages', formKey)});
  };

  return <form key={formKey} onSubmit={onSubmit} className="page-control backdrop">
    <label className="go-to-label control-label field next-approached bold" htmlFor={goTo}>Page</label>
    <input type="number"
      id={goTo}
      defaultValue={pageShown}
      min={firstPage}
      max={lastPage}
      name="page"
      className="go-to control borderless focus-ringed"/>
    <label className="per-page-label control-label field next-approached bold" htmlFor={perPage}>Per page</label>
    <input type="number"
      defaultValue={size}
      className="per-page control borderless focus-ringed"
      min={1}
      max={100}
      id={perPage}
      name="size"/>
    <button type="submit" className="submit-page control borderless field bold square-cornered attentive">Go
    </button>
  </form>;
};
