import * as faker from 'faker';
import './About.scss';

export const About = () => {
    return <>
        <ul className="accordion">
            <li className="fold">
                <input id="first-checkbox" className="info-toggle off-screen" type="checkbox"/>
                <label className="info-label" htmlFor="first-checkbox">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>

            <li className="fold">
                <input id="second-checkbox" className="info-toggle off-screen" type="checkbox"/>
                <label className="info-label" htmlFor="second-checkbox">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>

            <li className="fold">
                <input id="third-checkbox" className="info-toggle off-screen" type="checkbox"/>
                <label className="info-label" htmlFor="third-checkbox">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>

            <li className="fold">
                <input id="fourth-checkbox" className="info-toggle off-screen" type="checkbox"/>
                <label className="info-label" htmlFor="fourth-checkbox">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>

            <li className="fold">
                <input id="fifth-checkbox" className="info-toggle off-screen" type="checkbox"/>
                <label className="info-label" htmlFor="fifth-checkbox">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>
        </ul>

        <ul className="accordion">
            <li className="close">
                <input id="close-radio" defaultChecked={true} className="info-toggle off-screen" type="radio" name="group"/>
                <label className="info-label center" htmlFor="close-radio">Close</label>
            </li>
            <li className="fold">
                <input tabIndex={0} id="first-radio" className="info-toggle off-screen" type="radio" name="group"/>
                <label className="info-label" htmlFor="first-radio">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>

            <li className="fold">
                <input id="second-radio" className="info-toggle off-screen" type="radio" name="group"/>
                <label className="info-label" htmlFor="second-radio">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>

            <li className="fold">
                <input id="third-radio" className="info-toggle off-screen" type="radio" name="group"/>
                <label className="info-label" htmlFor="third-radio">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>

            <li className="fold">
                <input id="fourth-radio" className="info-toggle off-screen" type="radio" name="group"/>
                <label className="info-label" htmlFor="fourth-radio">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>

            <li className="fold">
                <input id="fifth-radio" className="info-toggle off-screen" type="radio" name="group"/>
                <label className="info-label" htmlFor="fifth-radio">{faker.lorem.word()}</label>
                <p className="info">{faker.lorem.paragraphs(Math.floor(Math.random() * 6) + 1)}</p>
            </li>
        </ul>
    </>;
};