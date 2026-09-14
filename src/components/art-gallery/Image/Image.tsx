import {FC, PropsWithChildren, useContext, useState} from 'react';
import {Link} from 'react-router';
import {classNames} from '@components/class-names';
import {Loading} from '@components/Loading';
import {useSearchParamsObject} from '@components/search-params';
import * as schema from 'schemawax';
import {toQueryString} from '@transport/url';
import {Art} from '@components/art-gallery/museums/art';
import {GalleryLinks} from '@components/art-gallery/Links';
import noImage from '../../../assets/icons/missing-art.svg?url';
import './Image.css';

type ImageProps = {
  piece: Art;
  className?: string;
  linkEnabled?: boolean;
  priority?: boolean;
  lazy?: boolean;
};

export const Image: FC<ImageProps> = (
  {
    piece,
    className,
    linkEnabled = true,
    priority = false,
    lazy = false
  }) => {
  const [completed, isComplete] = useState(false);
  const [errored, isError] = useState(false);
  const {tab} = useSearchParamsObject({tab: schema.string});
  const {gallery} = useContext(GalleryLinks);
  const ConditionalLink: FC<PropsWithChildren & {enabled: boolean; area: string}> =
    ({children, enabled, area}) => enabled ?
      <Link to={`${gallery}${piece.id}${toQueryString({tab: area})}`}
        aria-label={piece.title}
        className="scrim">{children}</Link> : <>{children}</>;

  return errored ?
    <img alt={`${piece.title} would not load`}
      className="image stand-in"
      src={noImage}/> : !piece.image ?
      <img alt={`${piece.title} has nothing to show`}
        className="image stand-in"
        src={noImage}/> :
      (<>
        <ConditionalLink enabled={linkEnabled} area={tab ?? ''}>
          <img className={classNames('image', className)}
            referrerPolicy="no-referrer"
            onError={() => {
              isComplete(true);
              isError(true);
            }}
            onLoad={() => {
              isComplete(true);
              isError(false);
            }}
            fetchPriority={priority ? 'high' : 'auto'}
            loading={lazy ? 'lazy' : undefined}
            srcSet={piece.srcSet}
            sizes="(max-width: 600px) 85vw, (max-width: 1100px) 45vw, 33vw"
            alt={piece.altText} title={piece.title}
            src={piece.image}/>
        </ConditionalLink>
        {completed || <Loading/>}
      </>);
};
