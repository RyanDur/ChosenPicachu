import {FC, useState} from "react";
import {not} from "@ryandur/sand";
import {PropsWithClassName} from "../../_types";
import './styles.css';

export const NaturalZIndex: FC<PropsWithClassName> = ({className}) => {
    const [isRelative, updatePosition] = useState(true);
    const onClick = () => updatePosition(not(isRelative));

    return <article id="z-index-demo" className={className}>
        <button className='primary' onClick={onClick}>{isRelative ? 'Collapse' : 'Expand'}</button>
        <section className='demo-container'>
            <p className={`card positioned-${isRelative ? 'relative' : 'absolute'}`}>First</p>
            <p className={`card positioned-${isRelative ? 'relative' : 'absolute'}`}>Second</p>
            <p className={`card positioned-${isRelative ? 'relative' : 'absolute'}`}>Third</p>
        </section>
    </article>;
};