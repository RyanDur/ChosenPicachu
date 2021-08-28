import {ReactElement} from 'react';
import {render, RenderResult, screen} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import * as H from 'history';
import {AddressInfo, UserInfo} from '../../components/UserInfo/types';
import userEvent from '@testing-library/user-event';
import {toISOWithoutTime} from '../../components/util';
import {toQueryString} from '../../util/URL';

export interface Rendered {
    result: RenderResult;
    testHistory?: H.History;
    testLocation?: H.Location;
}

interface URLContext {
    initialRoute?: string;
    path?: string;
    params?: Record<string, unknown>;
}

const defaultUrlContext: URLContext = {path: '/initial/route', params: {}};
export const renderWithRouter = (component: ReactElement, {
    initialRoute,
    path = defaultUrlContext.path,
    params = defaultUrlContext.params
} = defaultUrlContext): () => Rendered => {
    let testHistory: H.History, testLocation: H.Location,
        result = render(
            <MemoryRouter initialEntries={[`${initialRoute || path}${toQueryString(params)}`]}>
                <Route path={path}>{component}</Route>
                <Route
                    path="*"
                    render={({history, location}) => {
                        testHistory = history;
                        testLocation = location;
                        return null;
                    }}/>
            </MemoryRouter>);
    return () => ({result, testHistory, testLocation});
};

export const fillOutAddress = (address: AddressInfo, kind: string) => {
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