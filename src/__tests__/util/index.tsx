import {FC, PropsWithChildren, ReactElement} from 'react';
import {render, RenderResult, screen} from '@testing-library/react';
import {MemoryRouter, Route, Routes, useLocation, Location} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {toQueryString} from '../../util/URL';
import {AddressInfo, User} from '../../components/UserInfo/types';
import {toISOWithoutTime} from '../../components/util.js';
import {Consumer} from '@ryandur/sand';

export interface Rendered {
  result: RenderResult;
  testLocation?: Location;
}

interface URLContext {
  initialRoute?: string;
  path?: string;
  params?: Record<string, unknown>;
}

const LocationHelper: FC<PropsWithChildren<{ testLocation: Consumer<Location> }>> = ({testLocation, children}) => {
  const location = useLocation();
  testLocation(location);
  return <>{children}</>;
};

const TestRouter: FC<{
  component: ReactElement,
  context: URLContext,
  testLocation: Consumer<Location>
}> = ({component, context, testLocation}) => {
  return <MemoryRouter initialEntries={[`${context.initialRoute || context.path}${toQueryString(context.params)}`]}>
    <Routes>
      <Route path={context.path}
             element={<LocationHelper testLocation={testLocation}>{component}</LocationHelper>}>
      </Route>
      <Route path="*" element={<LocationHelper testLocation={testLocation}/>}/>
    </Routes>
  </MemoryRouter>;
};

const defaultUrlContext: URLContext = {path: '/initial/route', params: {}};
export const renderWithRouter = (
  component: ReactElement, {
    initialRoute,
    path = defaultUrlContext.path,
    params = defaultUrlContext.params
  } = defaultUrlContext): () => Rendered => {
  let testLocation: Location;

  const result = render(<TestRouter
    component={component}
    context={{initialRoute, path, params}}
    testLocation={(location) => testLocation = location}/>);

  return () => ({result, testLocation});
};

export const fillOutAddress = (address: AddressInfo, kind: string) =>
  userEvent.type(screen.getByTestId(`${kind}-address-street`), address.streetAddress)
    .then(() => userEvent.type(screen.getByTestId(`${kind}-address-street-2`), address.streetAddressTwo!))
    .then(() => userEvent.type(screen.getByTestId(`${kind}-address-city`), address.city))
    .then(() => userEvent.selectOptions(screen.getByTestId(`${kind}-address-state`), address.state))
    .then(() => userEvent.type(screen.getByTestId(`${kind}-address-zip`), address.zip));

export const fillOutUser = (info: User) =>
  userEvent.type(screen.getByLabelText('First Name'), info.info.firstName)
    .then(() => userEvent.type(screen.getByLabelText('Last Name'), info.info.lastName))
    .then(() => userEvent.type(screen.getByLabelText('Email'), info.info.email!))
    .then(() => userEvent.type(screen.getByLabelText('Date Of Birth'), toISOWithoutTime(info.info.dob!)));

export const fillOutForm = (info: User) =>
  fillOutUser(info)
    .then(() => fillOutAddress(info.homeAddress, 'home'))
    .then(() => fillOutAddress(info.workAddress!, 'work'));

export * from './dummyData';
