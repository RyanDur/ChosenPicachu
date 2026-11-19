import {SubmitEvent, useId} from 'react';
import {Maybe, maybe} from '@ryandur/sand';
import {numberParam} from '@navigation/search-params';
import {useGallery} from '@pages/Gallery/Context';
import {keptForm} from '@pages/Gallery/keptForm';
import {pages} from '@pages/Gallery/pages';
import {numberField} from '@pages/Gallery/numberField';
import './PageControl.css';

const typed = (form: FormData, field: string): Maybe<number> =>
  maybe(form.get(field)).mBind(value => maybe(numberParam.decode(value)));

const showingWhatWasSent = (field: Element | RadioNodeList | null, sent: number): void => {
  if (field instanceof HTMLInputElement) numberField.shows(field, sent);
};

export const PageControl = () => {
  const {pagination, page, size, updateSearchParams} = useGallery();
  const goTo = useId();
  const perPage = useId();
  const formKey = keptForm.useKey('pages');

  const firstPage = 1;
  const pageShown = pages.shown(page, pagination);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {elements} = event.currentTarget;
    const typedIn = new FormData(event.currentTarget);
    const sizeChosen = typed(typedIn, 'size').orElse(size);
    const pageSent = pages.withinTheEnd(typed(typedIn, 'page').orElse(page), sizeChosen, pagination);
    showingWhatWasSent(elements.namedItem('page'), pageSent);
    showingWhatWasSent(elements.namedItem('size'), sizeChosen);
    updateSearchParams({page: pageSent, size: sizeChosen},
      {preventScrollReset: false, state: keptForm.across('pages', formKey)});
  };

  return <form key={formKey} onSubmit={onSubmit} className="page-control backdrop">
    <label className="go-to-label control-label field next-approached bold" htmlFor={goTo}>Page</label>
    <input type="number"
      id={goTo}
      defaultValue={pageShown}
      min={firstPage}
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
