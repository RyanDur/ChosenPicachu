import {useLocation} from 'react-router';
import {maybe} from '@ryandur/sand';
import * as schema from 'schemawax';

type Form = 'search' | 'pages';

const keptKeys = schema.object({optional: {search: schema.string, pages: schema.string}});

export const keptForm = {
  across: (form: Form, key: string): Partial<Record<Form, string>> => ({[form]: key}),
  useKey: (form: Form, fromTheAddress: string): string => {
    const {state} = useLocation();
    return maybe(keptKeys.decode(state)).mBind(kept => maybe(kept[form])).orElse(fromTheAddress);
  }
};
