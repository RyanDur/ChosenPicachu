import {FC, PropsWithChildren, useContext, useState} from 'react';
import {Link} from 'react-router';
import {maybe, Maybe} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Loading} from '@components/Loading';
import {toQueryString} from '@transport';
import {useGallery} from '@pages/Gallery/Context';
import {GalleryLinks} from '@pages/Gallery/Links';
import noImage from '../../../assets/icons/missing-art.svg?url';
import './Image.css';
import {StandIn} from '@pages/Gallery/StandIn';
import {Art} from '@pages/Gallery/museums';

type Arrival = 'arriving' | 'shown' | 'missing';

type ImageProps = {
  piece: Art;
  className?: string;
  linkEnabled?: boolean;
  priority?: boolean;
  lazy?: boolean;
};

const Framed: FC<PropsWithChildren<{link: Maybe<string>; title: string}>> = ({link, title, children}) => link.either(
  to => <Link to={to} aria-label={title} className="scrim looking-glassed liftable">{children}</Link>,
  () => <>{children}</>
);

export const Image: FC<ImageProps> = (
  {
    piece,
    className,
    linkEnabled = true,
    priority = false,
    lazy = false
  }) => {
  const [arrival, arrived] = useState<Arrival>('arriving');
  const {tab} = useGallery();
  const {gallery} = useContext(GalleryLinks);
  const link = maybe(linkEnabled ? `${gallery}${piece.id}${toQueryString({tab})}` : undefined);

  return arrival === 'missing' ?
    <StandIn alt={`${piece.title} would not load`}
      className="image"
      src={noImage}/> : maybe(piece.picture).either(({src, srcSet}) =>
      <>
        <Framed link={link} title={piece.title}>
          <img className={classNames('image', className, arrival === 'arriving' && 'arriving')}
            referrerPolicy="no-referrer"
            onError={() => arrived('missing')}
            onLoad={() => arrived('shown')}
            fetchPriority={priority ? 'high' : 'auto'}
            loading={lazy ? 'lazy' : undefined}
            srcSet={srcSet}
            sizes="(max-width: 600px) 85vw, (max-width: 1100px) 45vw, 33vw"
            alt={piece.altText} title={piece.title}
            src={src}/>
        </Framed>
        {arrival === 'arriving' && <Loading/>}
      </>, () =>
      <StandIn alt={`${piece.title} has nothing to show`}
        className="image"
        src={noImage}/>);
};
