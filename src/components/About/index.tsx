import * as faker from 'faker';
import './About.css';

export const About = () => {
    return <ul id="about">

        <li className="fold card">
            <input id="first" className="info-toggle off-screen" type="checkbox"/>
            <label className="info-label" htmlFor="first">{faker.lorem.word()}</label>
            <p className="info">{faker.lorem.paragraphs(2)}</p>
        </li>

        <li className="fold card">
            <input id="second" className="info-toggle off-screen" type="checkbox"/>
            <label className="info-label" htmlFor="second">{faker.lorem.word()}</label>
            <p className="info">{faker.lorem.paragraphs(2)}</p>
        </li>

        <li className="fold card">
            <input id="third" className="info-toggle off-screen" type="checkbox"/>
            <label className="info-label" htmlFor="third">{faker.lorem.word()}</label>
            <p className="info">{faker.lorem.paragraphs(2)}</p>
        </li>

        <li className="fold card">
            <input id="fourth" className="info-toggle off-screen" type="checkbox"/>
            <label className="info-label" htmlFor="fourth">{faker.lorem.word()}</label>
            <p className="info">{faker.lorem.paragraphs(2)}</p>
        </li>

        <li className="fold card">
            <input id="fifth" className="info-toggle off-screen" type="checkbox"/>
            <label className="info-label" htmlFor="fifth">{faker.lorem.word()}</label>
            <p className="info">{faker.lorem.paragraphs(2)}</p>
        </li>
    </ul>;
};