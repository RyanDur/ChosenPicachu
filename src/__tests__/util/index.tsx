import {ReactElement} from 'react';
import {render, RenderResult, screen} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import * as H from 'history';
import {Paths} from '../../App';
import {UserInfo} from '../../components/UserInfo/types';
import userEvent from '@testing-library/user-event';
import {toISOWithoutTime} from '../../components/util';

export interface Rendered {
    rendered?: RenderResult;
    testHistory?: H.History;
    testLocation?: H.Location;
}

type TestPaths = Paths | '/initial/route';

export const renderWithRouter = (component: ReactElement, path: TestPaths = '/initial/route'): Rendered => {
    let testHistory, testLocation, rendered;
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
    return {rendered, testHistory, testLocation};
};

export const fillOutAddress = (info: UserInfo, kind: string) => {
    const address = kind === 'home' ? info.homeAddress : info.workAddress!;
    userEvent.type(screen.getByTestId(`${kind}-address-street`), address.streetAddress);
    userEvent.type(screen.getByTestId(`${kind}-address-street-2`), address.streetAddressTwo!);
    userEvent.type(screen.getByTestId(`${kind}-address-city`), address.city);
    userEvent.selectOptions(screen.getByTestId(`${kind}-address-state`), address.state);
    userEvent.type(screen.getByTestId(`${kind}-address-zip`), address.zip);
};

export const fillOutUser = (info: UserInfo) => {
    userEvent.type(screen.getByLabelText('First Name'), info.user.firstName);
    userEvent.type(screen.getByLabelText('Last Name'), info.user.lastName);
    userEvent.type(screen.getByLabelText('Email'), info.user.email!);
    userEvent.type(screen.getByLabelText('Date Of Birth'), toISOWithoutTime(info.user.dob!));
};

export * from './dummyData';