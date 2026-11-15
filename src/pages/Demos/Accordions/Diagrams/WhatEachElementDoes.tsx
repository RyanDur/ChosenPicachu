import {FC} from 'react';
import './Diagrams.css';

export const WhatEachElementDoes: FC = () =>
  <table className="behaviors caption">
    <caption className="behaviors-title bold">What each element does</caption>
    <thead>
      <tr>
        <td className="behavior muted-rule-below"/>
        <th className="behavior muted-rule-below" scope="col">closes on a second press</th>
        <th className="behavior muted-rule-below" scope="col">one open at a time</th>
      </tr>
    </thead>
    <tbody>
      {[['checkbox', 'yes', 'no'], ['radio', 'no', 'yes'], ['details with a name', 'yes', 'yes']].map(([element, closes, one]) =>
        <tr key={element}>
          <th className="behavior muted-rule-below" scope="row">{element}</th>
          <td className="behavior muted-rule-below">{closes}</td>
          <td className="behavior muted-rule-below">{one}</td>
        </tr>)}
    </tbody>
  </table>;
