import {FC, PropsWithChildren, useContext, useState} from 'react';
import {Link} from 'react-router';
import {empty, maybe, Maybe} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Loading} from '@components/Loading';
import {useSearchParamsObject} from '@components/search-params';
import {toQueryString} from '@transport/url';
import {Art} from '@components/art-gallery/museums/art';
import {sourceParam} from '@components/art-gallery/museums/source';
import {GalleryLinks} from '@components/art-gallery/Links';
import noImage from '../../../assets/icons/missing-art.svg?url';
import './Image.css';

type Picture = 'arriving' | 'shown' | 'missing';

type ImageProps = {
  piece: Art;
  className?: string;
  linkEnabled?: boolean;
  priority?: boolean;
  lazy?: boolean;
};

const Framed: FC<PropsWithChildren<{door: Maybe<string>; title: string}>> = ({door, title, children}) => door.either(
  to => <Link to={to} aria-label={title} className="scrim">{children}</Link>,
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
  const [picture, pictured] = useState<Picture>('arriving');
  const {tab} = useSearchParamsObject({tab: sourceParam});
  const {gallery} = useContext(GalleryLinks);
  const door = maybe(linkEnabled ? `${gallery}${piece.id}${toQueryString({tab})}` : undefined);

  return picture === 'missing' ?
    <img alt={`${piece.title} would not load`}
      className="image stand-in"
      src={noImage}/> : empty(piece.image) ?
      <img alt={`${piece.title} has nothing to show`}
        className="image stand-in"
        src={noImage}/> :
      (<>
        <Framed door={door} title={piece.title}>
          <img className={classNames('image', className)}
            referrerPolicy="no-referrer"
            onError={() => pictured('missing')}
            onLoad={() => pictured('shown')}
            fetchPriority={priority ? 'high' : 'auto'}
            loading={lazy ? 'lazy' : undefined}
            srcSet={piece.srcSet}
            sizes="(max-width: 600px) 85vw, (max-width: 1100px) 45vw, 33vw"
            alt={piece.altText} title={piece.title}
            src={piece.image}/>
        </Framed>
        {picture === 'arriving' && <Loading/>}
      </>);
};
