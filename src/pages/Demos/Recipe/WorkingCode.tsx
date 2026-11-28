import {FC, Fragment} from 'react';
import {repository} from '@navigation';
import {fileNames} from './fileNames';

export const WorkingCode: FC<{paths: readonly string[]}> = ({paths}) =>
  <p className="caption ink">The working code on the site: {paths.map((path, at) => <Fragment key={path}>
    {at > 0 && ', '}
    <a className="signpost" href={repository.file(path)} target="_blank" rel="noreferrer">{fileNames.of(path)}</a>
  </Fragment>)}</p>;
