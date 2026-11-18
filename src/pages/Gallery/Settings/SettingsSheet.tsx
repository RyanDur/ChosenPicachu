import {ChangeEvent, FC, KeyboardEvent, ToggleEvent, useContext, useId} from 'react';
import {maybe} from '@ryandur/sand';
import {KnownDoors, useGallery} from '@pages/Gallery/Context';
import {sourceParam} from '@pages/Gallery/museums';
import {doors} from '@pages/Gallery/doors';
import {useSuggestions} from '@pages/Gallery/Search';

const whenEntered = (apply: (field: HTMLInputElement) => void) => (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') apply(event.currentTarget);
};

const MuseumRow: FC = () => {
  const {tab, updateSearchParams} = useGallery();
  const open = doors.openIn(useContext(KnownDoors));
  const choice = useId();
  const chosen = (event: ChangeEvent<HTMLSelectElement>) =>
    maybe(sourceParam.decode(event.currentTarget.value)).map(museum => updateSearchParams({tab: museum}));
  return <>
    <label className="sheet-label field bold" htmlFor={choice}>Museum</label>
    <select id={choice} className="sheet-field card ellipsis" value={maybe(tab).orElse('')}
      onChange={chosen}>
      {open.map(({display, param}) => <option key={param} value={param}>{display}</option>)}
    </select>
  </>;
};

const SearchRow: FC = () => {
  const {tab, search, updateSearchParams, removeSearchParams} = useGallery();
  const searched = maybe(search).orElse('');
  const {suggestions, typed: suggestFor} = useSuggestions(tab);
  const field = useId();
  const options = useId();

  const apply = ({value}: HTMLInputElement) => {
    if (value === searched) return;
    if (value === '') removeSearchParams('search');
    else updateSearchParams({search: value});
  };

  return <>
    <label className="sheet-label field bold" htmlFor={field}>Search</label>
    <input type="search" id={field} list={options} autoComplete="off" enterKeyHint="search"
      className="sheet-field bare card" defaultValue={searched} onInput={event => suggestFor(event.currentTarget.value)}
      onKeyDown={whenEntered(apply)} onBlur={event => apply(event.currentTarget)}/>
    <datalist id={options}>
      {suggestions.map(suggestion => <option value={suggestion} key={suggestion}>{suggestion}</option>)}
    </datalist>
  </>;
};

const movedTo = {preventScrollReset: false};

const appliedNumber = (input: HTMLInputElement, shown: number, apply: (value: number) => void) => {
  if (input.valueAsNumber === shown) return;
  if (input.checkValidity()) apply(input.valueAsNumber);
  else input.value = input.defaultValue;
};

const SizeRow: FC = () => {
  const {size, updateSearchParams} = useGallery();
  const field = useId();
  const apply = (input: HTMLInputElement) =>
    appliedNumber(input, size, perPage => updateSearchParams({size: perPage}, movedTo));

  return <>
    <label className="sheet-label field bold" htmlFor={field}>Per page</label>
    <input type="number" id={field} min={1} max={100} required enterKeyHint="go"
      className="sheet-field bare card" defaultValue={size}
      onKeyDown={whenEntered(apply)} onBlur={event => apply(event.currentTarget)}/>
  </>;
};

const PageRow: FC = () => {
  const {page, pagination, updateSearchParams} = useGallery();
  const field = useId();
  const apply = (input: HTMLInputElement) =>
    appliedNumber(input, page, to => updateSearchParams({page: to}, movedTo));

  return <>
    <label className="sheet-label field bold" htmlFor={field}>Page</label>
    <input type="number" id={field} min={1} max={pagination.map(({totalPages}) => totalPages).orElse(undefined)}
      required enterKeyHint="go" className="sheet-field bare card" defaultValue={page}
      onKeyDown={whenEntered(apply)} onBlur={event => apply(event.currentTarget)}/>
  </>;
};

const showingTheAddress = ({newState, currentTarget}: ToggleEvent<HTMLElement>) => {
  if (newState === 'open') currentTarget.querySelectorAll('input').forEach(field => field.value = field.defaultValue);
};

export const SettingsSheet: FC<{readonly id: string}> = ({id}) =>
  <section id={id} popover="auto" aria-label="gallery settings" className="settings-sheet backdrop veiled"
    onBeforeToggle={showingTheAddress}>
    <MuseumRow/>
    <SearchRow/>
    <SizeRow/>
    <PageRow/>
  </section>;
