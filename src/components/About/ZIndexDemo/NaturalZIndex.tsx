import {FC, useState} from "react";
import {not as toggle} from "@ryandur/sand";
import {PropsWithClassName} from "../../_types";
import {classNames} from "../../../util/classNames";
import './styles.css';

export const NaturalZIndex: FC<PropsWithClassName> = ({className}) => {
  const [isCollapsed, updateCollapsed] = useState(true);
  const onClick = () => updateCollapsed(toggle(isCollapsed));

  return <article id="z-index-demo" className={className}>
    <button className='primary' onClick={onClick}>{isCollapsed ? 'Collapse' : 'Expand'}</button>
    <section className='demo-container'>
      <p className={classNames(`card`, 'first', isCollapsed && 'closed')}>First</p>
      <p className={classNames(`card`, 'second', isCollapsed && 'closed')}>Second</p>
      <p className={classNames(`card`, 'third', isCollapsed && 'closed')}>Third</p>
    </section>
  </article>;
};