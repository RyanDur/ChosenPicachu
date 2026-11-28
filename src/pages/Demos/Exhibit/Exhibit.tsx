import {FC, PropsWithChildren, useContext, useId} from 'react';
import {ExhibitRank} from './ExhibitRank';
import './Exhibit.css';

type ExhibitKind = 'Exhibit' | 'Sketch';

type Language = 'html' | 'css' | 'script';

const languages: readonly Language[] = ['html', 'css', 'script'];

const namesOf: Record<Language, string> = {html: 'HTML', css: 'CSS', script: 'script'};

type Exhibited = PropsWithChildren<{
  kind?: ExhibitKind;
  name: string;
  heading?: string;
  writtenIn?: readonly Language[];
}>;

export const Exhibit: FC<Exhibited> = ({
  kind = 'Exhibit',
  name,
  heading,
  writtenIn,
  children
}) => {
  const generatedId = `exhibit${useId()}`;
  const headingId = heading ?? generatedId;
  const rank = useContext(ExhibitRank);
  return <section aria-labelledby={headingId} className="exhibit card rounded-corners lifted">
    <header className="veiled-rule-below">
      <hgroup>
        <p className="caption uppercase" aria-hidden="true">{kind}</p>
        {rank === 3
          ? <h3 id={headingId} className="sub-title bold">{name}</h3>
          : <h2 id={headingId} className="sub-title bold">{name}</h2>}
      </hgroup>
      {writtenIn && <ul className="written-in caption">
        {languages.map(language => writtenIn.includes(language)
          ? <li key={language} className="language-mark inverse-ink field-inverse-filled field-inverse-outlined rounded-corners">
            {namesOf[language]}</li>
          : <li key={language} className="language-mark muted-ink muted-dashed-outline rounded-corners">
            no {namesOf[language]}</li>)}
      </ul>}
    </header>
    {children}
  </section>;
};
