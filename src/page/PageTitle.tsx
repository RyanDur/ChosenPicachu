import {FC} from 'react';
import {useNamingThePage} from '@page-name';

export type Listing = {readonly title: string; readonly description: string};

export const PageTitle: FC<{title: string; listed: Listing}> = ({title, listed}) => {
  useNamingThePage(title);
  return <>
    {title}
    <title>{listed.title}</title>
    <meta name="description" content={listed.description}/>
  </>;
};
