import {FC, PropsWithChildren, useContext, useState} from 'react';
import {Link} from 'react-router';
import {classNames} from '@components/class-names';
import {Loading} from '@components/Loading';
import {useSearchParamsObject} from '@components/search-params';
import * as schema from 'schemawax';
import {toQueryString} from '@transport/url';
import {Art} from '@components/art-gallery/museums/types/response';
import {GalleryLinks} from '@components/art-gallery/Links';
import noImage from '../../../assets/icons/no-image.png';
import './Image.css';

type ImageProps = {
  piece: Partial<Art>;
  className?: string;
  linkEnabled?: boolean;
  priority?: boolean;
  lazy?: boolean;
}

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
  const gotoTopOfPage = () => window.scrollTo(0, 0);
  const ConditionalLink: FC<PropsWithChildren & { enabled: boolean, area: string }> =
    ({children, enabled, area}) => enabled ?
      <Link onClick={gotoTopOfPage} to={`${gallery}${piece.id}${toQueryString({tab: area})}`}
            aria-label={piece.title}
            className="scrim">{children}</Link> : <>{children}</>;

    return (errored || !piece.image) ?
        <img alt="oops"
             className="image error"
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
                     srcSet={piece.srcSet ?? undefined}
                     sizes="(max-width: 600px) 85vw, (max-width: 1100px) 45vw, 33vw"
                     alt={piece.altText} title={piece.title}
                     src={piece.image}/>
            </ConditionalLink>
            {completed || <Loading/>}
        </>);
};
