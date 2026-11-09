import {FC} from 'react';
import './Diagrams.css';

export const WhatEachPromises: FC = () =>
  <table className="promises caption">
    <caption className="promises-title bold">What each element promises</caption>
    <thead>
      <tr>
        <td className="promise muted-rule-below"/>
        <th className="promise muted-rule-below" scope="col">closes on a second press</th>
        <th className="promise muted-rule-below" scope="col">one open at a time</th>
      </tr>
    </thead>
    <tbody>
      {[['checkbox', 'yes', 'no'], ['radio', 'no', 'yes'], ['details with a name', 'yes', 'yes']].map(([element, closes, one]) =>
        <tr key={element}>
          <th className="promise muted-rule-below" scope="row">{element}</th>
          <td className="promise muted-rule-below">{closes}</td>
          <td className="promise muted-rule-below">{one}</td>
        </tr>)}
    </tbody>
  </table>;
