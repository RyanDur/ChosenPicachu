import {useRouteError} from 'react-router';

export const PageError = () => {
  const error = useRouteError();
  console.error(error);

  return <main data-testid="page-error" className="in-view">
    <h2>This room is closed.</h2>
    <p>Something broke on this page — the rest of the gallery still works.</p>
  </main>;
};
