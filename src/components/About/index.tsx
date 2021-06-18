import * as faker from 'faker';

export const About = () => {
    return <div>{faker.lorem.sentence()}</div>;
};