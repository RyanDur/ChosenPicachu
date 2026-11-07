import {FC} from 'react';
import {useRoomToStandOpen} from '@components/room';
import {PageControl} from '@pages/Gallery/PageControl';

export const GalleryAside: FC = () => {
  const room = useRoomToStandOpen();
  return room && <aside id="filter" className="filter field backdrop-below" aria-label="gallery settings">
    <PageControl/>
  </aside>;
};
