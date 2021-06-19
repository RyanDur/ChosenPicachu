import * as faker from 'faker';

export const About = () => {
    return <>
        <p>{faker.lorem.paragraphs(2)}</p>
        <p>{faker.lorem.paragraphs(2)}</p>
    </>;
};