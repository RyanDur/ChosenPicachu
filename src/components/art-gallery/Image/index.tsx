import {FC, PropsWithChildren, useContext, useState} from 'react';
import {Link} from 'react-router';
import {join} from '@components/class-names';
import {Loading} from '@components/art-gallery/Loading';
import {useSearchParamsObject} from '@components/search-params';
import * as D from 'schemawax';
import {toQueryString} from '@transport/url';
import {Art} from '@components/art-gallery/museums/types/response';
import {GalleryLinks} from '@components/art-gallery/Links';
import './Image.css';

type ImageProps = {
  piece: Partial<Art>;
  className?: string;
  linkEnabled?: boolean;
}

export const Image: FC<ImageProps> = (
  {
    piece,
    className,
    linkEnabled = true
  }) => {
  const [completed, isComplete] = useState(false);
  const [errored, isError] = useState(false);
  const {tab} = useSearchParamsObject({tab: D.string});
  const {gallery} = useContext(GalleryLinks);
  const gotoTopOfPage = () => window.scrollTo(0, 0);
  const ConditionalLink: FC<PropsWithChildren & { enabled: boolean, area: string }> =
    ({children, enabled, area}) => enabled ?
      <Link onClick={gotoTopOfPage} to={`${gallery}/${piece.id}${toQueryString({tab: area})}`}
            className="scrim">{children}</Link> : <>{children}</>;

    return (errored || !piece.image) ?
        <img alt="oops"
             className="error"
             src="https://img.icons8.com/ios/100/000000/no-image.png"
             data-testid="error"/> :
        (<>
            <ConditionalLink enabled={linkEnabled} area={tab ?? ''}>
                <img className={join('image', 'off-screen', className)}
                     referrerPolicy="no-referrer"
                     onError={() => {
                         isComplete(true);
                         isError(true);
                     }}
                     onLoad={event => {
                         isComplete(true);
                         isError(false);
                         event.currentTarget.classList.remove('off-screen');
                     }}
                     width={100}
                     alt={piece.altText} title={piece.title}
                     data-testid={`piece-${piece.id}`}
                     src={piece.image}/>
            </ConditionalLink>
            {completed || <Loading/>}
        </>);
};
