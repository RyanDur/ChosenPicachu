import {FC} from 'react';
import {Snippet, lines, Line, CodeFile} from '@pages/Demos/Recipe';

// sand ships only its built files, so its source is carved by hand from the commit the installed 10.0.0 was built from
const sandUtil: CodeFile = {
  path: 'src/lib/util/index.ts',
  owner: 'sand',
  url: 'https://github.com/RyanDur/sand/blob/65821220fe38666bfad429a6a1b4cfbb65b4c463/src/lib/util/index.ts'
};
const sandLine = (line: number, text: string): Line => ({text, from: {file: sandUtil, line}});

export const PreludeCarve: FC = () => <Snippet label="TS" lines={[
  sandLine(77, 'export const not = (value: unknown): boolean => !value;'),
  lines.aside('// …'),
  sandLine(89, 'export const is = (value: unknown): boolean => !not(value);'),
  lines.aside('// …'),
  sandLine(164, 'export const notEmpty = <T>(value: T | null | undefined): value is T => not(empty(value));'),
  lines.aside('// …'),
  sandLine(188, 'export const has = notEmpty;')
]}/>;
