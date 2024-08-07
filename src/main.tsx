import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {AboutPage, ArtGalleryPage, ArtGalleryPiecePage, HomePage, UsersPage} from './routes';
import {AppContext} from './AppContext.tsx';
import * as ReactDom  from "react-dom/client";
import {StrictMode} from "react";
import {Paths} from './routes/Paths.ts';
import './index.css';

const router = createBrowserRouter([
  {
    path: Paths.home,
    element: <HomePage/>
  },
  {
    path: Paths.about,
    element: <AboutPage/>
  },
  {
    path: Paths.users,
    element: <UsersPage/>
  },
  {
    path: Paths.artGallery,
    element: <ArtGalleryPage/>
  },
  {
    path: Paths.artGalleryPiece,
    element: <ArtGalleryPiecePage/>
  }
]);

ReactDom.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppContext>
      <RouterProvider router={router}/>
    </AppContext>
  </StrictMode>
);
