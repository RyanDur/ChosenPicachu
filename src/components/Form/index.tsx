import {FormEvent, useState} from 'react';
import {data} from '../../data';

export const Form = () => {
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        data.post({name: `${firstName} ${lastName}`});
    };

    return <form onSubmit={handleSubmit}>
        <label htmlFor="first-name">First Name</label>
        <input type="text" id="first-name" required
               onChange={event => setFirstName(event.currentTarget.value)}/>

        <label htmlFor="last-name">Surname</label>
        <input type="text" id="last-name" required
               onChange={event => setLastName(event.currentTarget.value)}/>

        <button type="submit">Submit</button>
    </form>;
};