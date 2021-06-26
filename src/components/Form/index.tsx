import {FormEvent, useState} from 'react';
import {data} from '../../data';
import './Form.layout.css';
import './Form.css';
import {Address} from './Address';

export const Form = () => {
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        data.post({name: `${firstName} ${lastName}`});
    };

    return <section className="card overhang gutter">
        <form id="fancy-form" onSubmit={handleSubmit}>
            <section className="name">
                <h3 className="name-title">Name</h3>
                <article id="first-name-cell" className="stack">
                    <label id="first-name-label" htmlFor="first-name">First Name</label>
                    <input type="text" id="first-name" required
                           onChange={event => setFirstName(event.currentTarget.value)}/>
                </article>

                <article id="last-name-cell" className="stack">
                    <label id="last-name-label" htmlFor="last-name">Last Name</label>
                    <input type="text" id="last-name" required
                           onChange={event => setLastName(event.currentTarget.value)}/>
                </article>
            </section>

            <section id="addresses">
                <h3 id="home-address-title">Home Address</h3>
                <Address kind={'home'} id="home-address"/>

                <section id="work-address-title" className="center-horizontal spread">
                    <h3>Work Address</h3>
                    <article className="center-horizontal">
                        <label htmlFor="same-as-home">Same as Home</label>
                        <input id="same-as-home" type="checkbox"/>
                    </article>
                </section>
                <Address kind={'work'} id="work-address"/>
            </section>

            <section id="details-cell" className="stack">
                <label id="details-label" htmlFor="details">Details</label>
                <textarea name="details" id="details"/>
            </section>

            <button id="submit">Submit</button>
        </form>
    </section>;
};