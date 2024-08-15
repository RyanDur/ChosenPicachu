import {FC, PropsWithChildren, ReactElement} from 'react';
import {render, RenderResult, screen} from '@testing-library/react';
import {Location, MemoryRouter, Route, Routes, useLocation} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {toQueryString} from '../../util/URL';
import {AddressInfo, User} from '../../components/UserInfo/types';
import {Consumer} from '@ryandur/sand';
import {AppContext} from '../../AppContext';
import {AllArt, Art} from '../../components/Gallery/resource/types/response';
import {toDate} from 'date-fns';

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

const TestRouter: FC<PropsWithChildren & {
  context: URLContext,
  testLocation: Consumer<Location>
}> = ({children, context, testLocation}) => {
  return <MemoryRouter initialEntries={[`${(context.initialRoute)}${toQueryString(context.params)}`]}>
    <Routes>
      <Route path={context.path}
             element={<LocationHelper testLocation={testLocation}>{children}</LocationHelper>}>
      </Route>
      <Route path="*" element={<LocationHelper testLocation={testLocation}/>}/>
    </Routes>
  </MemoryRouter>;
};
type Defaults = Partial<URLContext & { pieceState: Partial<Art>, galleryState: AllArt }>;
const defaultUrlContext: URLContext = {path: '/initial/route', params: {}};
export const renderWithRouter = (
  component: ReactElement, {
    pieceState,
    galleryState,
    initialRoute = defaultUrlContext.path,
    path = defaultUrlContext.path,
    params = defaultUrlContext.params
  }: Defaults = {}): () => Rendered => {
  let testLocation: Location;

  const result = render(<AppContext pieceState={pieceState} galleryState={galleryState}>
    <TestRouter
      context={{initialRoute, path, params}}
      testLocation={(location) => testLocation = location}>
      {component}
    </TestRouter>
  </AppContext>);

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
    .then(() => {
      const text = toDate(info.info.dob!).toISOString().split('T')[0];
      return userEvent.type(screen.getByLabelText('Date Of Birth'), text);
    });

export const fillOutForm = (info: User) =>
  fillOutUser(info)
    .then(() => fillOutAddress(info.homeAddress, 'home'))
    .then(() => fillOutAddress(info.workAddress!, 'work'));
