import {FC, SubmitEvent, useContext, useId} from 'react';
import {useNavigate} from 'react-router';
import {has} from '@ryandur/sand';
import {GalleryLinks} from '@pages/Gallery/Links';
import {classNames, PropsWithClassName} from '@components';
import {useGallery} from '@pages/Gallery/Context';
import {useSuggestions} from './useSuggestions';
import {keptForm} from '@pages/Gallery/keptForm';
import {opening} from '@pages/Gallery/opening';
import './Search.css';
import searchIcon from '../../../assets/icons/search.svg?url';
import resetIcon from '../../../assets/icons/reset.svg?url';

const wordsIn = (form: HTMLFormElement): string => {
  const words = new FormData(form).get('search');
  return typeof words === 'string' ? words : '';
};

export const Search: FC<PropsWithClassName> = ({className}) => {
  const navigate = useNavigate();
  const {gallery} = useContext(GalleryLinks);
  const {tab, search, removeSearchParams, searchFromAddress} = useGallery();
  const {suggestions, typed, cleared} = useSuggestions(tab);
  const query = useId();
  const options = useId();
  const formKey = keptForm.useKey('search');

  const submitted = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const words = wordsIn(event.currentTarget);
    if (words === search) return;
    void navigate({pathname: gallery, search: searchFromAddress({search: words, page: opening.page})},
      {preventScrollReset: true, state: keptForm.across('search', formKey)});
  };

  const reset = () => {
    cleared();
    if (has(search)) removeSearchParams(['search', 'page'], {state: keptForm.across('search', formKey)});
  };

  return <search className={classNames('search', 'backdrop', className)}>
    <form key={formKey} className="search-form" onSubmit={submitted}>
      <label className="query-label field next-approached ellipsis bold" htmlFor={query}>Search</label>
      <input type="search" name="search" autoComplete="off" list={options} id={query} required
        defaultValue={search}
        className="query bare card"
        onInput={event => typed(event.currentTarget.value)}/>
      <button className="reset-query button icon-button borderless field attentive reachable" type="reset"
        aria-label="reset search" onClick={reset}><img className="icon" src={resetIcon} width="24" height="24" alt=""/></button>
      <button className="submit-query button icon-button borderless field attentive reachable" type="submit"
        aria-label="submit search"><img className="icon" src={searchIcon} width="24" height="24" alt=""/></button>
      <datalist id={options} className="field">
        {suggestions.map(suggestion =>
          <option value={suggestion} key={suggestion}>{suggestion}</option>)}
      </datalist>
    </form>
  </search>;
};
