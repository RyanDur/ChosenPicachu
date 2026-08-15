import {FC} from 'react';
import {frameDocument} from './assemble';
import './TableFrame.css';

export const TableFrame: FC = () =>
  <iframe className="table-frame" title="the living table, in html" srcDoc={frameDocument}/>;
