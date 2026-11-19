import {ChangeEvent, FC, FocusEvent, KeyboardEvent, ToggleEvent, useId} from 'react';
import {has, maybe, not} from '@ryandur/sand';
import {typedValues, usePageFocus} from '@page';
import {useGallery, useKnownDoors} from '@pages/Gallery/Context';
import {museums, sourceParam} from '@pages/Gallery/museums';
import {useSuggestions} from '@pages/Gallery/Search';
import {opening} from '@pages/Gallery/opening';
import {pages} from '@pages/Gallery/pages';
import {numberField} from '@pages/Gallery/numberField';
import {useOnTheGallery} from '@pages/Gallery/useOnTheGallery';
import {useGalleryAddress} from './useGalleryAddress';

// WebKit ends a composition before the keydown of the Enter that confirms it,
// so only that keydown's keyCode, 229, marks it
const confirmsAComposition = ({nativeEvent, keyCode}: KeyboardEvent<HTMLInputElement>): boolean =>
  nativeEvent.isComposing || keyCode === 229;

const whenEntered = (send: (field: HTMLInputElement) => void) => (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter' && not(confirmsAComposition(event))) send(event.currentTarget);
};

// A browser blurs the focused field when the whole window loses focus, as when a phone reader switches apps,
// so only a move to something else on the page counts as leaving the field
const whenLeftForThePage = (pageHasFocus: () => boolean) =>
  (send: (field: HTMLInputElement) => void) => (event: FocusEvent<HTMLInputElement>) => {
    if (pageHasFocus()) send(event.currentTarget);
  };

const refusedSaysWhy = (field: HTMLInputElement): boolean => field.reportValidity();

const refusedGoesBackTo = (shown: number) => (field: HTMLInputElement): boolean => {
  if (field.checkValidity()) return true;
  numberField.shows(field, shown);
  return false;
};

// A change sent from inside the open popover moves the page while Page may hold the focus,
// and react-dom leaves a focused number field's default as it was, so the row that sent it puts Page there itself
const pageFieldShows = (page: number) => (sentFrom: HTMLElement): void => {
  const pageField = sentFrom.closest('fieldset')?.elements.namedItem('page');
  if (pageField instanceof HTMLInputElement) numberField.shows(pageField, page);
};

const MuseumRow: FC = () => {
  const {tab} = useGallery();
  const address = useGalleryAddress();
  const known = useKnownDoors();
  const offered = museums.all.filter(({param}) => known[param] === 'open' || param === tab);
  const choice = useId();
  const chosen = ({currentTarget}: ChangeEvent<HTMLSelectElement>) =>
    maybe(sourceParam.decode(currentTarget.value)).map(museum => {
      address.update({tab: museum, page: opening.page});
      pageFieldShows(opening.page)(currentTarget);
    });
  return <>
    <label className="settings-label field bold" htmlFor={choice}>Museum</label>
    <select id={choice} className="settings-field card ellipsis" value={maybe(tab).orElse('')}
      onChange={chosen}>
      {has(tab) || <option value="" disabled>Choose a museum</option>}
      {offered.map(({display, param}) => <option key={param} value={param}>{display}</option>)}
    </select>
  </>;
};

const SearchRow: FC = () => {
  const {tab, search} = useGallery();
  const leftForThePage = whenLeftForThePage(usePageFocus());
  const address = useGalleryAddress();
  const searched = maybe(search).orElse('');
  const onTheGallery = useOnTheGallery();
  const {suggestions, typed: suggestFor} = useSuggestions(tab);
  const fieldId = useId();
  const options = useId();

  const sent = (input: HTMLInputElement) => {
    if (input.value === '') address.remove(['search', 'page']);
    else address.update({search: input.value, page: opening.page});
    pageFieldShows(opening.page)(input);
  };

  const searchedFor = (input: HTMLInputElement) => {
    if (input.value === searched && onTheGallery) return;
    sent(input);
  };

  const leave = (input: HTMLInputElement) => {
    if (input.value === '') input.value = searched;
    else if (input.value !== searched) sent(input);
  };

  return <>
    <label className="settings-label field bold" htmlFor={fieldId}>Search</label>
    <input type="search" id={fieldId} list={options} autoComplete="off" enterKeyHint="search"
      className="settings-field bare card" defaultValue={searched}
      onInput={event => suggestFor(event.currentTarget.value)}
      onKeyDown={whenEntered(searchedFor)} onBlur={leftForThePage(leave)}/>
    <datalist id={options}>
      {suggestions.map(suggestion => <option value={suggestion} key={suggestion}>{suggestion}</option>)}
    </datalist>
  </>;
};

const scrolledToTheTop = {preventScrollReset: false};

const sendingNumber = (current: number, send: (value: number, input: HTMLInputElement) => void) =>
  (accepted: (field: HTMLInputElement) => boolean) => (input: HTMLInputElement): void => {
    if (input.valueAsNumber === current || not(accepted(input))) return;
    send(input.valueAsNumber, input);
    numberField.shows(input, input.valueAsNumber);
  };

const SizeRow: FC = () => {
  const {page, size, pagination} = useGallery();
  const leftForThePage = whenLeftForThePage(usePageFocus());
  const address = useGalleryAddress();
  const fieldId = useId();
  const sending = sendingNumber(size, (perPage, input) => {
    const pageSent = pages.withinTheEnd(page, perPage, pagination);
    address.update({size: perPage, page: pageSent}, scrolledToTheTop);
    pageFieldShows(pageSent)(input);
  });

  return <>
    <label className="settings-label field bold" htmlFor={fieldId}>Per page</label>
    <input type="number" id={fieldId} min={1} max={100} required enterKeyHint="go"
      className="settings-field bare card" defaultValue={size}
      onKeyDown={whenEntered(sending(refusedSaysWhy))}
      onBlur={leftForThePage(sending(refusedGoesBackTo(size)))}/>
  </>;
};

const PageRow: FC = () => {
  const {page, pagination} = useGallery();
  const leftForThePage = whenLeftForThePage(usePageFocus());
  const address = useGalleryAddress();
  const fieldId = useId();
  const shown = pages.shown(page, pagination);
  const goTo = (to: number) => address.update({page: to}, scrolledToTheTop);

  return <>
    <label className="settings-label field bold" htmlFor={fieldId}>Page</label>
    <input type="number" id={fieldId} name="page" min={1}
      max={pages.last(pagination).orElse(undefined)}
      required enterKeyHint="go" className="settings-field bare card" defaultValue={shown}
      onKeyDown={whenEntered(sendingNumber(page, goTo)(refusedSaysWhy))}
      onBlur={leftForThePage(sendingNumber(shown, goTo)(refusedGoesBackTo(shown)))}/>
  </>;
};

const showingTheAddress = ({newState, currentTarget}: ToggleEvent<HTMLElement>) => {
  if (newState === 'open') typedValues.droppedIn(currentTarget);
};

export const GallerySettingsPopover: FC<{readonly id: string}> = ({id}) =>
  <fieldset id={id} popover="auto" className="gallery-settings-popover phone-popover backdrop veiled"
    onBeforeToggle={showingTheAddress}>
    <legend className="off-screen">gallery settings</legend>
    <MuseumRow/>
    <SearchRow/>
    <SizeRow/>
    <PageRow/>
  </fieldset>;
