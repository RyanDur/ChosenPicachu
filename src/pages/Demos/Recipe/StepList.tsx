import {FC, ReactNode} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Line, Snippet} from './Snippet';

export type Block = {
  label: 'HTML' | 'CSS' | 'JS';
  lines: Line[];
  foil?: boolean;
};

export type StepEntry = {
  title: string;
  want: string;
  says: string[];
  dial?: ReactNode;
  figure?: ReactNode;
  code: Block[];
};

export const plain = (text: string): Line => ({text});
export const aside = (text: string): Line => ({text, dim: true});

export const StepList: FC<{steps: StepEntry[]}> = ({steps}) =>
  <ol className="steps">
    {steps.map(step =>
      <li className={classNames('step', has(step.dial) && 'tuned')} key={step.title}>
        <article className="step-body">
          <div className="step-heading">
            <h3 className="step-title">{step.title}</h3>
            {step.dial}
          </div>
          <div className="step-flow">
            <div className="step-words">
              <p className="step-want">{step.want}</p>
              {step.says.map(paragraph => <p className="step-says" key={paragraph}>{paragraph}</p>)}
              {step.figure}
            </div>
            <div className="step-code">
              {step.code.map(({label, lines, foil}, at) => <Snippet label={label} lines={lines} foil={foil} key={at}/>)}
            </div>
          </div>
        </article>
      </li>)}
  </ol>;
