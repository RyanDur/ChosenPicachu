import {NaturalZIndex} from './ZIndexDemo';
import {ExclusiveAccordion, InclusiveAccordion} from './Accordians';
import './style.css';
import {useQuery} from "../hooks";

type Demos = 'accordions' | 'z-index'

export const About = () => {
  const {queryObj: {tab}} =
    useQuery<{ tab: Demos }>();

  return <section id='about'>
    {(tab === 'accordions' || tab === undefined) && <>
        <article>Different styles of Accordions.</article>
        <InclusiveAccordion className='card'/>
        <ExclusiveAccordion className='card'/>
    </>}
    {tab === 'z-index' && <>
        <article>Z-Index Demo.</article>
        <NaturalZIndex className='card'/>
    </>}
  </section>;
};
