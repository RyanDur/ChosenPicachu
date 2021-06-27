import {FormEvent, useState} from 'react';
import {data} from '../../data';
import {Address} from './Address';
import './Form.layout.css';
import './Form.css';

export interface AddressInfo {
    streetAddress: string;
    streetAddress2?: string;
    city: string;
    state: string;
    zip: string;
}

interface User {
    firstName: string;
    lastName: string;
}

export interface UserInfo {
    user: User;
    homeAddress: AddressInfo;
    workAddress?: AddressInfo;
    details?: string;
}


export const Form = () => {
    const [user, updateUser] = useState<User>({firstName: '', lastName: ''});
    const [homeAddress, updateHomeAddress] = useState<AddressInfo>({
        city: '',
        state: '',
        streetAddress: '',
        zip: ''
    });
    const [workAddress, updateWorkAddress] = useState<AddressInfo>();
    const [details, updateDetails] = useState<string>();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        data.post({
            user,
            homeAddress,
            workAddress,
            details
        });
    };

    return <section className="card overhang gutter">
        <form id="fancy-form" onSubmit={handleSubmit}>
            <section className="name">
                <h3 className="name-title">Name</h3>
                <article id="first-name-cell" className="stack">
                    <input type="text" id="first-name" required
                           onChange={event => updateUser({...user, firstName: event.currentTarget.value})}/>
                    <label id="first-name-label" htmlFor="first-name">First Name</label>
                </article>

                <article id="last-name-cell" className="stack">
                    <input type="text" id="last-name" required
                           onChange={event => updateUser({...user, lastName: event.currentTarget.value})}/>
                    <label id="last-name-label" htmlFor="last-name">Last Name</label>
                </article>
            </section>

            <section id="addresses">
                <h3 id="home-address-title">Home Address</h3>
                <Address kind={'home'} id="home-address" consumer={updateHomeAddress} required={true}/>

                <section id="work-address-title" className="center-horizontal spread">
                    <h3>Work Address</h3>
                    <article className="center-horizontal">
                        <label htmlFor="same-as-home">Same as Home</label>
                        <input id="same-as-home" type="checkbox"/>
                    </article>
                </section>
                <Address kind={'work'} id="work-address" consumer={updateWorkAddress}/>
            </section>

            <section id="details-cell" className="stack">
                <textarea name="details" id="details" onChange={event => updateDetails(event.currentTarget.value)}/>
                <label id="details-label" htmlFor="details">Details</label>
            </section>

            <button id="submit">Submit</button>
        </form>
    </section>;
};