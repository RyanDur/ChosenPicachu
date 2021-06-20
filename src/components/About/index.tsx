import * as faker from 'faker';
import './About.css';

export const About = () => {
    return <section>
        <ul className="accordion">
            <li className="fold card">
                <input id="first-checkbox" className="info-toggle off-screen" type="checkbox"/>
                <label className="info-label" htmlFor="first-checkbox">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>

            <li className="fold card">
                <input id="second-checkbox" className="info-toggle off-screen" type="checkbox"/>
                <label className="info-label" htmlFor="second-checkbox">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>

            <li className="fold card">
                <input id="third-checkbox" className="info-toggle off-screen" type="checkbox"/>
                <label className="info-label" htmlFor="third-checkbox">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>

            <li className="fold card">
                <input id="fourth-checkbox" className="info-toggle off-screen" type="checkbox"/>
                <label className="info-label" htmlFor="fourth-checkbox">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>

            <li className="fold card">
                <input id="fifth-checkbox" className="info-toggle off-screen" type="checkbox"/>
                <label className="info-label" htmlFor="fifth-checkbox">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>
        </ul>

        <hr className="bar"/>

        <ul className="accordion">
            <li className="close">
                <input id="close-radio" className="info-toggle off-screen" type="radio" name="group"/>
                <label className="info-label" htmlFor="close-radio">Close</label>
            </li>
            <li className="fold card">
                <input id="first-radio" className="info-toggle off-screen" type="radio" name="group"/>
                <label className="info-label" htmlFor="first-radio">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>

            <li className="fold card">
                <input id="second-radio" className="info-toggle off-screen" type="radio" name="group"/>
                <label className="info-label" htmlFor="second-radio">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>

            <li className="fold card">
                <input id="third-radio" className="info-toggle off-screen" type="radio" name="group"/>
                <label className="info-label" htmlFor="third-radio">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>

            <li className="fold card">
                <input id="fourth-radio" className="info-toggle off-screen" type="radio" name="group"/>
                <label className="info-label" htmlFor="fourth-radio">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>

            <li className="fold card">
                <input id="fifth-radio" className="info-toggle off-screen" type="radio" name="group"/>
                <label className="info-label" htmlFor="fifth-radio">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>
        </ul>

    </section>;
};