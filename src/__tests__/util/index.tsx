import {FC, PropsWithChildren, ReactElement} from 'react';
import {render, RenderResult, screen} from '@testing-library/react';
import {
  createMemoryRouter,
  Location,
  MemoryRouter,
  Route,
  RouteObject,
  RouterProvider,
  Routes,
  useLocation
} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {toQueryString} from '../../util/URL';
import {AddressInfo, User} from '../../components/UserInfo/types';
import {AllArt, Art} from '../../components/Gallery/resource/types/response';
import {toDate} from 'date-fns';
import {GalleryContext} from '../../components/Gallery/Art/Context';
import {ArtPieceContext} from '../../components/Gallery/ArtPiece/Context';

export interface Rendered {
  result: RenderResult;
  testLocation?: Location;
}

interface URLContext {
  initialRoute: string;
  path: string;
  params: Record<string, unknown>;
}

const LocationHelper: FC<PropsWithChildren> = ({children}) => {
  const location = useLocation();

  return <>
    <article data-testid='subject-url-path'>{location.pathname}</article>
    <article data-testid='subject-url-search'>{location.search}</article>
    {children}
  </>;
};

const TestRouter: FC<PropsWithChildren & {
  context: URLContext,
}> = ({children, context}) => {
  return <MemoryRouter initialEntries={[`${(context.initialRoute)}${toQueryString(context.params)}`]}>
    <Routes>
      <Route path={context.path}
             element={<LocationHelper>{children}</LocationHelper>}>
      </Route>
      <Route path="*" element={<LocationHelper/>}/>
    </Routes>
  </MemoryRouter>;
};
type Defaults = Partial<URLContext & { pieceState: Partial<Art>, galleryState: AllArt }>;
const defaultUrlContext: URLContext = {initialRoute: '/initial/route', path: '/initial/route', params: {}};

type RenderWithRouter<STATE_TO_OMIT extends string = never> = (
  children: ReactElement,
  options?: Partial<Omit<Defaults, STATE_TO_OMIT>>
) => RenderResult;

export const renderWithGalleryContext: RenderWithRouter<'pieceState'> = (
  children,
  options = {}): RenderResult => {
  const {initialRoute, path, galleryState, params} = {
    initialRoute: defaultUrlContext.path,
    path: defaultUrlContext.path,
    params: defaultUrlContext.params
    , ...options
  };

  return render(<GalleryContext galleryState={galleryState}>
    <TestRouter
      context={{initialRoute, path, params}}>
      {children}
    </TestRouter>
  </GalleryContext>);
};

export const renderWithMemoryRouter = (routes: RouteObject, {
  path = defaultUrlContext.path
}: { path: string }) => {
  const router = createMemoryRouter([routes], {
    initialEntries: [path],
  });

  return render(<RouterProvider router={router}/>);
};

export const renderWithArtPieceContext: RenderWithRouter<'galleryState'> = (
  children,
  options = {}) => {
  const {pieceState, initialRoute, path, params} = {
    initialRoute: defaultUrlContext.path,
    path: defaultUrlContext.path,
    params: defaultUrlContext.params
    , ...options
  };

  return render(<ArtPieceContext pieceState={pieceState}>
    <TestRouter
      context={{initialRoute, path, params}}>
      {children}
    </TestRouter>
  </ArtPieceContext>);
};

export const renderWithRouter: RenderWithRouter<'galleryState' | 'pieceState'> = (
  children,
  options = {}
) => {
  const context = {
    initialRoute: defaultUrlContext.path,
    path: defaultUrlContext.path,
    params: defaultUrlContext.params
    , ...options
  };

  return render(
    <TestRouter
      context={context}>
      {children}
    </TestRouter>);
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
