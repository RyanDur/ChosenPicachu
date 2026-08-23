import {useRouteError} from 'react-router';

export const PageError = () => {
  const error = useRouteError();
  console.error(error);

  return <section className="page-error in-view" aria-labelledby="closed-room">
    <h2 id="closed-room" className="title bold">This room is closed.</h2>
    <p>Something broke on this page — the rest of the gallery still works.</p>
  </section>;
};
