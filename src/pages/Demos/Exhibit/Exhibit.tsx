import {FC, PropsWithChildren, useContext, useId} from 'react';
import {ExhibitRank} from './ExhibitRank';
import './Exhibit.css';

type ExhibitKind = 'Exhibit' | 'Sketch';

type Language = 'html' | 'css' | 'script';

const languages: readonly Language[] = ['html', 'css', 'script'];

const namesOf: Record<Language, string> = {html: 'HTML', css: 'CSS', script: 'script'};

const WrittenIn: FC<{languages: readonly Language[]}> = ({languages: used}) =>
  <p className="written-in caption">
    {languages.map(language => used.includes(language)
      ? <span key={language} className="language-mark inverse-ink field-inverse-filled field-inverse-outlined rounded-corners">
        {namesOf[language]}</span>
      : <span key={language} className="language-mark muted-ink muted-dashed-outline rounded-corners">
        no {namesOf[language]}</span>)}
  </p>;

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
    <hgroup className="veiled-rule-below">
      <p className="caption uppercase" aria-hidden="true">{kind}</p>
      {rank === 3
        ? <h3 id={headingId} className="sub-title bold">{name}</h3>
        : <h2 id={headingId} className="sub-title bold">{name}</h2>}
      {writtenIn && <WrittenIn languages={writtenIn}/>}
    </hgroup>
    {children}
  </section>;
};
