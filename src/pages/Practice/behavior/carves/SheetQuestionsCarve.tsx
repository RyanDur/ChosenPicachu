import {FC} from 'react';
import basePageSheet from '../../../../BasePage.css?sample';
import surfaceSheet from '../../../../styles/surface.css?sample';
import accordionsSheet from '@pages/Demos/Accordions/Accordions.css?sample';
import {Snippet, carve, Line, Sample} from '@pages/Demos/Recipe';

const oneLine = (sheet: Sample, line: string): Line[] => carve.span(sheet, line, line);

export const SheetQuestionsCarve: FC = () => <>
  <Snippet label="CSS" lines={oneLine(basePageSheet, '&:not(:has(.header-settings)) .app-title')}/>
  <Snippet label="CSS" lines={oneLine(accordionsSheet, '.info-toggle:not(:checked) ~ .info')}/>
  <Snippet label="CSS" lines={oneLine(surfaceSheet, '.liftable:is(:hover, :focus)::before')}/>
</>;
