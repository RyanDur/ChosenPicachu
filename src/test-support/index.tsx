import {MountedTable} from '../router';
import {FC, PropsWithChildren, ReactElement} from 'react';
import {render, RenderResult, screen, within} from '@testing-library/react';
import {
  createMemoryRouter,
  Location,
  MemoryRouter,
  Route,
  RouteObject,
  RouterProvider,
  Routes,
  useLocation
} from 'react-router';
import userEvent from '@testing-library/user-event';

const swiftKeys = userEvent.setup({delay: null});
import {toQueryString} from '@transport/url';
import {GalleryLinks} from '@components/art-gallery/Links';
import {Paths} from '@pages/Paths';
import {AddressInfo, NewUser} from '@components/Users/UserInfo/types';
import {AllArt, Art} from '@components/art-gallery/museums/types/response';
import {toDate} from 'date-fns';
import {GalleryContext} from '@components/art-gallery/Art/Context';
import {BannerProvider, Banners} from '@components/Banners';
import {ArtPieceContext} from '@components/art-gallery/ArtPiece/Context';

export type Rendered = {
  result: RenderResult;
  testLocation?: Location;
}

type URLContext = {
  initialRoute: string;
  path: string;
  params: Record<string, unknown>;
}

const LocationHelper: FC<PropsWithChildren> = ({children}) => {
  const location = useLocation();

  return <>
    <data aria-label="url path">{location.pathname}</data>
    <data aria-label="url search">{location.search}</data>
    {children}
  </>;
};

const TestRouter: FC<PropsWithChildren & {
  context: URLContext,
}> = ({children, context}) => 
  <MemoryRouter initialEntries={[`${(context.initialRoute)}${toQueryString(context.params)}`]}>
    <BannerProvider>
      <Routes>
        <Route path={context.path}
               element={<LocationHelper><GalleryLinks.Provider value={{gallery: Paths.artGallery}}>{children}</GalleryLinks.Provider></LocationHelper>}>
        </Route>
        <Route path="*" element={<LocationHelper/>}/>
      </Routes>
      <Banners/>
    </BannerProvider>
  </MemoryRouter>
;
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
}: { path?: string }) => {
  const router = createMemoryRouter([{path: '/', element: <MountedTable/>, children: [routes]}], {
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

export const addressGroup = (kind: string) =>
  within(screen.getByRole('article', {name: new RegExp(`${kind} address`, 'i')}));

export const fillOutAddress = (address: AddressInfo, kind: string) =>
  swiftKeys.type(addressGroup(kind).getByLabelText('Street'), address.streetAddress)
    .then(() => swiftKeys.type(addressGroup(kind).getByLabelText('Street Line 2'), address.streetAddressTwo!))
    .then(() => swiftKeys.type(addressGroup(kind).getByLabelText('City'), address.city))
    .then(() => swiftKeys.selectOptions(addressGroup(kind).getByLabelText('State'), address.state))
    .then(() => swiftKeys.type(addressGroup(kind).getByLabelText('Postal / Zip code'), address.zip));

export const fillOutUser = (info: NewUser) =>
  swiftKeys.type(screen.getByLabelText('First Name'), info.info.firstName)
    .then(() => swiftKeys.type(screen.getByLabelText('Last Name'), info.info.lastName))
    .then(() => swiftKeys.type(screen.getByLabelText('Email'), info.info.email!))
    .then(() => {
      const text = toDate(info.info.dob!).toISOString().split('T')[0];
      return swiftKeys.type(screen.getByLabelText('Date Of Birth'), text);
    });

export const fillOutForm = (info: NewUser) =>
  fillOutUser(info)
    .then(() => fillOutAddress(info.homeAddress, 'home'))
    .then(() => fillOutAddress(info.workAddress!, 'work'));
