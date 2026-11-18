import {ChangeEvent, FC, KeyboardEvent, useContext, useId, useState} from 'react';
import {maybe} from '@ryandur/sand';
import {KnownDoors, useGallery} from '@pages/Gallery/Context';
import {sourceParam} from '@pages/Gallery/museums';
import {doors} from '@pages/Gallery/doors';
import {useSuggestions} from '@pages/Gallery/Search';

type Draft = {readonly shown: string; readonly typed: string};

const useDraft = (shown: string) => {
  const [draft, setDraft] = useState<Draft>({shown, typed: shown});
  const current = draft.shown === shown ? draft : {shown, typed: shown};
  if (current !== draft) setDraft(current);
  return {typed: current.typed, type: (typed: string): void => setDraft({shown, typed})};
};

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
  const {typed, type} = useDraft(searched);
  const field = useId();
  const options = useId();

  const apply = ({value}: HTMLInputElement) => {
    if (value === searched) return;
    if (value === '') removeSearchParams('search');
    else updateSearchParams({search: value});
  };

  const typing = ({currentTarget: {value}}: ChangeEvent<HTMLInputElement>) => {
    type(value);
    suggestFor(value);
  };

  return <>
    <label className="sheet-label field bold" htmlFor={field}>Search</label>
    <input type="search" id={field} list={options} autoComplete="off" enterKeyHint="search"
      className="sheet-field bare card" value={typed} onChange={typing}
      onKeyDown={whenEntered(apply)} onBlur={event => apply(event.currentTarget)}/>
    <datalist id={options}>
      {suggestions.map(suggestion => <option value={suggestion} key={suggestion}>{suggestion}</option>)}
    </datalist>
  </>;
};

type NumberRowProps = {
  readonly label: string;
  readonly shown: number;
  readonly min: number;
  readonly max?: number;
  readonly applied: (value: number) => void;
};

const NumberRow: FC<NumberRowProps> = ({label, shown, min, max, applied}) => {
  const {typed, type} = useDraft(String(shown));
  const field = useId();

  const apply = (input: HTMLInputElement) => {
    if (input.valueAsNumber === shown) return;
    if (input.checkValidity()) applied(input.valueAsNumber);
    else type(String(shown));
  };

  return <>
    <label className="sheet-label field bold" htmlFor={field}>{label}</label>
    <input type="number" id={field} min={min} max={max} required enterKeyHint="go"
      className="sheet-field bare card" value={typed}
      onChange={event => type(event.currentTarget.value)}
      onKeyDown={whenEntered(apply)} onBlur={event => apply(event.currentTarget)}/>
  </>;
};

export const SettingsSheet: FC<{readonly id: string}> = ({id}) => {
  const {page, size, pagination, updateSearchParams} = useGallery();
  const movedTo = {preventScrollReset: false};
  return <section id={id} popover="auto" aria-label="gallery settings" className="settings-sheet backdrop veiled">
    <MuseumRow/>
    <SearchRow/>
    <NumberRow label="Per page" shown={size} min={1} max={100}
      applied={perPage => updateSearchParams({size: perPage}, movedTo)}/>
    <NumberRow label="Page" shown={page} min={1} max={pagination.map(({totalPages}) => totalPages).orElse(undefined)}
      applied={to => updateSearchParams({page: to}, movedTo)}/>
  </section>;
};
