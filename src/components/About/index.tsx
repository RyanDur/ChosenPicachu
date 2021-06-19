import * as faker from 'faker';

export const About = () => {
    return <section className="gutter">
        <p>{faker.lorem.paragraphs(2)}</p>
        <p>{faker.lorem.paragraphs(2)}</p>
    </section>;
};