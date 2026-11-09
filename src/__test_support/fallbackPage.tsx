import {render, RenderResult} from '@testing-library/react';
import {StrictMode} from 'react';
import {createMemoryRouter, RouterProvider} from 'react-router';
import {Paths} from '@navigation';
import {FallbackPage} from '@page';
import {environment} from '@transport';
import {SiteProviders} from '../SiteProviders';

export const renderFallbackPage = (): RenderResult => render(<StrictMode>
  <SiteProviders environment={environment}>
    <RouterProvider router={createMemoryRouter([{path: '*', Component: FallbackPage}], {initialEntries: [Paths.games]})}/>
  </SiteProviders>
</StrictMode>);
