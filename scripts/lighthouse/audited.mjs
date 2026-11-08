import {budgeted} from '../../e2e/pages';

export const stage = 'http://localhost:4517/ChosenPicachu/';

export const slug = name => name.replace(/\s+/g, '-');

export const audited = () => budgeted().map(({name, path}) => ({page: slug(name), url: `${stage}${path}`}));

if (import.meta.main) {
  process.stdout.write(JSON.stringify(audited()));
}
