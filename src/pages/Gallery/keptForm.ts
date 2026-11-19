import {useLocation} from 'react-router';
import {maybe} from '@ryandur/sand';
import * as schema from 'schemawax';

type Form = 'search' | 'pages';

const keptKeys = schema.object({optional: {search: schema.string, pages: schema.string}});

const paramsOf: Record<Form, string[]> = {search: ['search'], pages: ['page', 'size']};

const addressKeyOf = (form: Form, search: string): string => {
  const params = new URLSearchParams(search);
  return paramsOf[form].map(param => params.get(param) ?? '').join(' ');
};

export const keptForm = {
  across: (form: Form, key: string): Partial<Record<Form, string>> => ({[form]: key}),
  useKey: (form: Form): string => {
    const {state, search} = useLocation();
    return maybe(keptKeys.decode(state)).mBind(kept => maybe(kept[form])).orElse(addressKeyOf(form, search));
  }
};
