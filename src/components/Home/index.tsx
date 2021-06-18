import * as faker from 'faker';

export const Home = () => {
    return <div>{faker.lorem.sentence()}</div>;
};