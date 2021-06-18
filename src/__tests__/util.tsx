import {ReactElement} from 'react';
import {act, render, RenderResult} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import * as H from 'history';
import {Paths} from '../App';

interface Rendered {
    rendered?: RenderResult;
    testHistory?: H.History;
    testLocation?: H.Location;
}
type TestPaths = Paths | '/initial/route';

export const renderWithRouter = (component: ReactElement, path: TestPaths = '/initial/route'): Rendered => {
    let testHistory, testLocation, rendered;
    act(() => {
        rendered = render(<MemoryRouter initialEntries={[path as string]}>
            {component}
            <Route
        path="*"
        render={({history, location}) => {
            testHistory = history;
            testLocation = location;
            return null;
        }}
        />
        </MemoryRouter>);
    });
    return {rendered, testHistory, testLocation};
};