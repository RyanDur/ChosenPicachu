import {ReactNode} from 'react';
import {Sample} from '../../Recipe';

export type SortBuild = {
  react: string;
  vanilla: string;
  tableSource: Sample;
  buildSource: Sample;
  headerSource: Sample;
  rowSource: Sample;
  pace: ReactNode;
};
